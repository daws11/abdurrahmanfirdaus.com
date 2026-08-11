# /fde-apply Draft Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add cover-letter and essay drafting to the `/fde-apply` slash command by introducing a new `update` CLI subcommand and adding `--boards` / `--skip-screenshots` flags to `discover`.

**Architecture:** Two additive features to the existing `job-search.py` CLI. The new `update` subcommand writes to `state.json` (using the existing `_state_lock()` / `save_state()` helpers). The slash command grows a new Step 5.5 that drafts inline, persists via `update`, and supports iterative chat-style refinement. The `discover` subcommand grows `--boards <csv>` (merge + dedupe by `gh_id`) and `--skip-screenshots` (default ON).

**Tech Stack:** Python 3 stdlib only (`argparse`, `json`, `pathlib`, `dataclasses`, `datetime`, `fcntl`, `subprocess`). Existing helpers reused: `_state_lock()`, `load_state()`, `save_state()`, `_profile_variants()`, `_arg_non_empty()`, `_now_iso()`, `_emit()`. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-08-12-fde-apply-draft-mode-design.md` (committed `1612c57`).

---

## File Structure

**Files modified:**
| File | Purpose | Net LOC |
|---|---|---|
| `job-search/job-search.py` | Add `cmd_update`, `--boards`, `--skip-screenshots`, `updated_at` field | +135 |
| `job-search/test_smoke.py` | Add 5 new test functions, register in `main()` | +150 |
| `.claude/commands/fde-apply.md` | Insert Step 5.5 (draft) | +40 |
| `job-search/README.md` | Document new `update` subcommand + new `discover` flags | +20 |

**Files NOT modified:**
- `state.json` (schema is forward-compatible; old jobs read fine, new jobs gain `updated_at`)
- `profile.json` (variants unchanged)
- `discovery.json` (output format unchanged)
- All other `cmd_*` functions in `job-search.py`

**Decomposition rationale:** Each file owns one concern. The CLI tool owns state + argv; the slash command owns the LLM-side orchestration; tests own the regression bar; README owns user-facing docs. The five tasks below are ordered to enable incremental TDD: smallest behavior → next behavior → tests cover each as it ships.

---

## Task 1: Add `updated_at` field to Job dataclass

**Files:**
- Modify: `job-search/job-search.py:154-173` (the `@dataclass class Job` block)

- [ ] **Step 1: Locate the `Job` dataclass**

Open `job-search/job-search.py`. Around line 156 you'll see:

```python
@dataclass
class Job:
    id: str
    company: str
    role: str
    jd_url: str
    jd_raw: str
    cover_letter: str = ""
    essay_answers: dict = field(default_factory=dict)
    form_fields: dict = field(default_factory=dict)
    status: str = "draft"
    match_score: int = 0
    match_reason: str = ""
    resume_variant: str = "general-fde"
    created_at: str = ""
    submitted_at: str | None = None
    submit_id: str | None = None
    submit_notes: str | None = None
```

- [ ] **Step 2: Add `updated_at` field**

Add one line at the end of the dataclass (right after `submit_notes`):

```python
    submit_notes: str | None = None
    updated_at: str | None = None
```

- [ ] **Step 3: Run existing tests to verify no regression**

```bash
cd job-search && python3 test_smoke.py
```

Expected: `All smoke tests passed` (14/14 still pass; `updated_at` defaults to `None` so existing jobs read fine).

- [ ] **Step 4: Commit**

```bash
git add job-search/job-search.py
git commit -m "feat(job-search): add updated_at field to Job dataclass"
```

---

## Task 2: `cmd_update` — happy path with `cover_letter`

**Files:**
- Modify: `job-search/test_smoke.py` (add test, register in `main()`)
- Modify: `job-search/job-search.py` (add `cmd_update`, register parser)

- [ ] **Step 1: Write the failing test**

In `job-search/test_smoke.py`, add this function before the `# -- Runner` section:

```python
def test_update_sets_cover_letter(tmpdir: Path) -> None:
    """update sets cover_letter + essay_answers + updated_at; JSON output correct."""
    env = fresh_state(tmpdir)
    job_id = add_job(env, "Update Co")

    essays = json.dumps({
        "why_company": "Mission-aligned work on AI agents in production.",
        "why_you": "Shipped Mastra agent handling 4 channels end-to-end.",
        "deployment_story": "Situation: 4 inbound channels fragmented. Task: unify. Action: built Mastra agent. Result: 24/7 booking, no human in loop.",
    })
    r = run_cli(["--json", "update", job_id,
                 "--cover-letter", "Dear Hiring Team,\n\nI write to apply...",
                 "--essay-answers", essays], env=env)
    assert r.returncode == 0, f"update failed: {r.stderr}"
    payload = json.loads(r.stdout.strip())
    assert payload["id"] == job_id
    assert "cover_letter" in payload["updated_fields"]
    assert "essay_answers" in payload["updated_fields"]

    # Verify state.json was actually updated
    state = json.loads((tmpdir / "state.json").read_text())
    job = next(j for j in state["jobs"] if j["id"] == job_id)
    assert job["cover_letter"].startswith("Dear Hiring Team")
    assert job["essay_answers"]["why_company"].startswith("Mission-aligned")
    assert job["updated_at"] is not None
    assert "T" in job["updated_at"]  # ISO 8601 contains 'T' separator
```

- [ ] **Step 2: Register the test in `main()`**

In `job-search/test_smoke.py`, find the `tests = [` list inside `main()`. Add `test_update_sets_cover_letter,` after `test_rolling_backup_recovery,`.

- [ ] **Step 3: Run the new test to verify it fails**

```bash
cd job-search && python3 test_smoke.py 2>&1 | grep test_update_sets_cover_letter
```

Expected: `✗ test_update_sets_cover_letter` with an error like `unrecognized arguments: update`.

- [ ] **Step 4: Add `cmd_update` to `job-search.py`**

Open `job-search/job-search.py`. Add this function before the `# -- Parser ---` section (around line 670):

```python
def cmd_update(args: argparse.Namespace) -> int:
    """Update fields on an existing job (cover_letter, essay_answers, resume_variant)."""
    if not (args.cover_letter or args.essay_answers or args.resume_variant):
        _emit(args,
              text="error: at least one of --cover-letter / --essay-answers / --resume-variant is required",
              payload={"error": "no_fields_to_update"})
        return 1

    # Validate essay-answers JSON early (before lock).
    essay_dict: dict | None = None
    if args.essay_answers:
        try:
            essay_dict = json.loads(args.essay_answers)
        except json.JSONDecodeError as e:
            _emit(args,
                  text=f"error: --essay-answers is not valid JSON: {e}",
                  payload={"error": "essay_json_invalid", "detail": str(e)})
            return 1
        if not isinstance(essay_dict, dict):
            _emit(args,
                  text="error: --essay-answers must be a JSON object",
                  payload={"error": "essay_json_not_object"})
            return 1
        if len(essay_dict) > 20:
            _emit(args,
                  text=f"error: --essay-answers has {len(essay_dict)} keys (max 20)",
                  payload={"error": "too_many_essay_keys",
                           "count": len(essay_dict), "max": 20})
            return 1
        for k, v in essay_dict.items():
            if not isinstance(v, str):
                _emit(args,
                      text=f"error: essay_answers[{k!r}] must be a string",
                      payload={"error": "essay_value_not_string", "key": k})
                return 1
            if len(v) > 5000:
                _emit(args,
                      text=f"error: essay_answers[{k!r}] is {len(v)} chars (max 5000)",
                      payload={"error": "essay_value_too_long",
                               "key": k, "max": 5000})
                return 1

    if args.cover_letter and len(args.cover_letter) > 10000:
        _emit(args,
              text=f"error: --cover-letter is {len(args.cover_letter)} chars (max 10000)",
              payload={"error": "cover_letter_too_long", "max": 10000})
        return 1

    with _state_lock():
        state = load_state()
        job = next((j for j in state["jobs"] if j["id"] == args.job_id), None)
        if job is None:
            _emit(args,
                  text=f"error: {args.job_id} not found",
                  payload={"error": "not_found", "job_id": args.job_id})
            return 1
        if job["status"] not in ("draft", "approved"):
            _emit(args,
                  text=f"error: {args.job_id} is {job['status']!r}, only draft/approved are updatable",
                  payload={"error": "wrong_status",
                           "job_id": args.job_id, "status": job["status"]})
            return 1

        updated_fields: list[str] = []
        if args.cover_letter:
            job["cover_letter"] = args.cover_letter
            updated_fields.append("cover_letter")
        if essay_dict is not None:
            job["essay_answers"].update(essay_dict)
            updated_fields.append("essay_answers")
        if args.resume_variant:
            choices = _profile_variants()
            if args.resume_variant not in choices:
                _emit(args,
                      text=f"error: --resume-variant {args.resume_variant!r} not in profile.json",
                      payload={"error": "unknown_variant",
                               "variant": args.resume_variant,
                               "choices": choices})
                return 1
            job["resume_variant"] = args.resume_variant
            updated_fields.append("resume_variant")

        job["updated_at"] = _now_iso()
        save_state(state)

    payload = {"id": args.job_id, "updated_fields": updated_fields,
               "status": job["status"]}
    if args.json:
        _emit(args, payload=payload)
    else:
        print(f"updated {args.job_id} ({', '.join(updated_fields)})")
    return 0
```

- [ ] **Step 5: Register the `update` parser subcommand**

In `job-search/job-search.py`, find the section that registers subparsers (look for `sub.add_parser("confirm"`). Add `cmd_update` registration right after the `p_confirm` block:

```python
    p_update = sub.add_parser("update", help="Update fields on an existing job")
    p_update.add_argument("job_id", help="e.g. JOB-2026-08-12-001")
    p_update.add_argument("--cover-letter", type=_arg_non_empty("--cover-letter"),
                          help="Cover letter text (max 10000 chars)")
    p_update.add_argument("--essay-answers", type=_arg_non_empty("--essay-answers"),
                          help="JSON object of essay answers (max 20 keys, 5000 chars each)")
    p_update.add_argument("--resume-variant", choices=_profile_variants(),
                          help="Override resume variant (must exist in profile.json)")
    p_update.set_defaults(func=cmd_update)
```

The `_profile_variants()` call computes choices at parser build time (same pattern as `cmd_add`). The defensive check inside `cmd_update` is the test seam.

- [ ] **Step 6: Run the new test to verify it passes**

```bash
cd job-search && python3 test_smoke.py 2>&1 | grep -E "(test_update_sets_cover_letter|All smoke)"
```

Expected: `✓ test_update_sets_cover_letter` and `All smoke tests passed` (15/15).

- [ ] **Step 7: Commit**

```bash
git add job-search/job-search.py job-search/test_smoke.py
git commit -m "feat(job-search): add update subcommand for cover_letter and essays"
```

---

## Task 3: `cmd_update` — status check rejects submitted/rejected

**Files:**
- Modify: `job-search/test_smoke.py` (add test)

- [ ] **Step 1: Write the failing test**

In `job-search/test_smoke.py`, add before `# -- Runner`:

```python
def test_update_rejects_submitted(tmpdir: Path) -> None:
    """update on a submitted or rejected job returns wrong_status, no mutation."""
    env = fresh_state(tmpdir)
    job_id = add_job(env, "Locked Co")
    # approve then confirm so status=submitted
    run_cli(["--json", "review", job_id, "approve"], env=env)
    run_cli(["--json", "confirm", job_id, "--notes", "done"], env=env)

    # Capture state before the rejected update
    before = json.loads((tmpdir / "state.json").read_text())
    cover_before = next(j for j in before["jobs"] if j["id"] == job_id)["cover_letter"]

    r = run_cli(["--json", "update", job_id,
                 "--cover-letter", "should not stick"], env=env)
    assert r.returncode != 0, "update on submitted job should fail"
    payload = json.loads(r.stdout.strip())
    assert payload["error"] == "wrong_status"
    assert payload["status"] == "submitted"

    # State unchanged
    after = json.loads((tmpdir / "state.json").read_text())
    cover_after = next(j for j in after["jobs"] if j["id"] == job_id)["cover_letter"]
    assert cover_after == cover_before, "cover_letter must not change on rejected update"

    # Also rejected: rejected status is read-only
    job_id_2 = add_job(env, "Rejected Co")
    run_cli(["--json", "review", job_id_2, "reject", "--reason", "title mismatch"], env=env)
    r = run_cli(["--json", "update", job_id_2, "--cover-letter", "x"], env=env)
    assert r.returncode != 0
    assert json.loads(r.stdout.strip())["error"] == "wrong_status"
```

- [ ] **Step 2: Register the test in `main()`**

Add `test_update_rejects_submitted,` after `test_update_sets_cover_letter,` in the `tests = [` list.

- [ ] **Step 3: Run the new test to verify it passes (already implemented in T2)**

```bash
cd job-search && python3 test_smoke.py 2>&1 | grep test_update_rejects_submitted
```

Expected: `✓ test_update_rejects_submitted`. (The `cmd_update` implementation from Task 2 already includes the status check; this test pins the behavior.)

If it fails, check that `cmd_update` has this block:

```python
if job["status"] not in ("draft", "approved"):
    _emit(args, text=..., payload={"error": "wrong_status", ...})
    return 1
```

- [ ] **Step 4: Commit**

```bash
git add job-search/test_smoke.py
git commit -m "test(job-search): update rejects submitted and rejected jobs"
```

---

## Task 4: `cmd_update` — input validation

**Files:**
- Modify: `job-search/test_smoke.py` (add 2 tests)

- [ ] **Step 1: Write `test_update_rejects_invalid_json`**

Add before `# -- Runner`:

```python
def test_update_rejects_invalid_json(tmpdir: Path) -> None:
    """update with malformed --essay-answers fails before any mutation."""
    env = fresh_state(tmpdir)
    job_id = add_job(env, "JSON Co")

    # Malformed JSON
    r = run_cli(["--json", "update", job_id,
                 "--essay-answers", '{not valid'], env=env)
    assert r.returncode != 0, "malformed JSON should fail"
    payload = json.loads(r.stdout.strip())
    assert payload["error"] == "essay_json_invalid"

    # Valid JSON but not an object (array)
    r = run_cli(["--json", "update", job_id,
                 "--essay-answers", '[1,2,3]'], env=env)
    assert r.returncode != 0
    assert json.loads(r.stdout.strip())["error"] == "essay_json_not_object"

    # Value is not a string
    r = run_cli(["--json", "update", job_id,
                 "--essay-answers", '{"k": 123}'], env=env)
    assert r.returncode != 0
    payload = json.loads(r.stdout.strip())
    assert payload["error"] == "essay_value_not_string"
    assert payload["key"] == "k"

    # State unchanged (no mutation)
    state = json.loads((tmpdir / "state.json").read_text())
    job = next(j for j in state["jobs"] if j["id"] == job_id)
    assert job["essay_answers"] == {}
    assert job["updated_at"] is None
```

- [ ] **Step 2: Write `test_update_validates_lengths`**

Add before `# -- Runner`:

```python
def test_update_validates_lengths(tmpdir: Path) -> None:
    """update rejects cover_letter > 10000 chars and essay value > 5000 chars."""
    env = fresh_state(tmpdir)
    job_id = add_job(env, "Long Co")

    # cover_letter too long (10001 chars)
    too_long = "x" * 10001
    r = run_cli(["--json", "update", job_id, "--cover-letter", too_long], env=env)
    assert r.returncode != 0
    assert json.loads(r.stdout.strip())["error"] == "cover_letter_too_long"

    # essay value too long (5001 chars)
    r = run_cli(["--json", "update", job_id,
                 "--essay-answers", json.dumps({"k": "y" * 5001})], env=env)
    assert r.returncode != 0
    payload = json.loads(r.stdout.strip())
    assert payload["error"] == "essay_value_too_long"
    assert payload["key"] == "k"

    # No update fields at all
    r = run_cli(["--json", "update", job_id], env=env)
    assert r.returncode != 0
    assert json.loads(r.stdout.strip())["error"] == "no_fields_to_update"

    # State unchanged
    state = json.loads((tmpdir / "state.json").read_text())
    job = next(j for j in state["jobs"] if j["id"] == job_id)
    assert job["cover_letter"] == ""
    assert job["essay_answers"] == {}
```

- [ ] **Step 3: Register both tests in `main()`**

Add `test_update_rejects_invalid_json,` and `test_update_validates_lengths,` after `test_update_rejects_submitted,`.

- [ ] **Step 4: Run the new tests to verify they pass**

```bash
cd job-search && python3 test_smoke.py 2>&1 | grep -E "(test_update_rejects_invalid_json|test_update_validates_lengths|All smoke)"
```

Expected: `✓ test_update_rejects_invalid_json`, `✓ test_update_validates_lengths`, `All smoke tests passed` (17/17).

If `test_update_rejects_invalid_json` fails on `essay_value_not_string`, confirm `cmd_update` has:

```python
for k, v in essay_dict.items():
    if not isinstance(v, str):
        _emit(args, text=..., payload={"error": "essay_value_not_string", "key": k})
        return 1
```

- [ ] **Step 5: Commit**

```bash
git add job-search/test_smoke.py
git commit -m "test(job-search): update input validation (json, lengths, no fields)"
```

---

## Task 5: `discover` — `--boards <csv>` with dedup

**Files:**
- Modify: `job-search/test_smoke.py` (add test)
- Modify: `job-search/job-search.py` (modify `cmd_discover`, add argparse flags)

- [ ] **Step 1: Write the failing test**

Add before `# -- Runner`:

```python
def test_discover_boards_csv(tmpdir: Path) -> None:
    """discover --boards <csv> merges results from multiple boards + dedupes by gh_id."""
    env = fresh_state(tmpdir)
    fixture = tmpdir / "boards.json"
    # Three entries; gh_id=100 is duplicated across "boards"
    fixture.write_text(json.dumps([
        {
            "title": "Forward Deployed Engineer",
            "company": "alpha",
            "location": "Remote",
            "url": "https://example.com/alpha/1",
            "jd_text": "FDE role alpha.",
            "source": "file",
            "board": "alpha",
            "gh_id": 100,
        },
        {
            "title": "Forward Deployed Engineer",
            "company": "alpha-dup",
            "location": "Remote",
            "url": "https://example.com/alpha/1",
            "jd_text": "Same job, different board name.",
            "source": "file",
            "board": "beta",
            "gh_id": 100,  # duplicate
        },
        {
            "title": "Customer Engineer",
            "company": "beta",
            "location": "Singapore",
            "url": "https://example.com/beta/1",
            "jd_text": "Customer engineer role.",
            "source": "file",
            "board": "beta",
            "gh_id": 200,
        },
    ]))

    r = run_cli(["--json", "discover", "--source", "file", "--boards", "alpha,beta",
                 "--file", str(fixture)], env=env)
    assert r.returncode == 0, f"discover failed: {r.stderr}"
    payload = json.loads(r.stdout.strip())
    # 3 file entries get loaded once via fixture; --boards triggers a loop that
    # re-loads the fixture per board (file source has no per-board filter).
    # What matters: dedup keeps distinct gh_ids only.
    gh_ids = [j.get("gh_id") for j in payload["jobs"] if j.get("gh_id")]
    assert len(gh_ids) == len(set(gh_ids)), f"gh_ids not deduped: {gh_ids}"
    assert set(gh_ids) <= {100, 200}
```

NOTE on what the test actually exercises: `--source file` reads a single fixture; the `--boards` loop calls `cmd_discover`'s file path N times. The dedupe happens in the loop. The test pins dedupe correctness — not multi-board file content (which would need separate fixtures per board, out of scope).

- [ ] **Step 2: Register the test in `main()`**

Add `test_discover_boards_csv,` after `test_update_validates_lengths,`.

- [ ] **Step 3: Run the test to verify it fails**

```bash
cd job-search && python3 test_smoke.py 2>&1 | grep test_discover_boards_csv
```

Expected: `✗ test_discover_boards_csv` with error like `unrecognized arguments: --boards`.

- [ ] **Step 4: Modify `cmd_discover` to accept `--boards` and `--skip-screenshots`**

Open `job-search/job-search.py`. Find `def cmd_discover(args: argparse.Namespace) -> int:` (around line 670). Replace the function body up to (but not including) the `keywords = ...` line. Specifically, replace the section that handles `--source greenhouse` to also handle `--boards`:

Find this block:

```python
    keywords = [k.strip() for k in (args.keywords or "").split(",") if k.strip()]
    if not keywords:
        keywords = ["forward deploy", "forward deployed", "solutions engineer", "customer engineer"]

    entries: list[dict] = []

    if args.source == "greenhouse":
        if not args.board:
            _emit(args,
                  text="error: --board required for --source greenhouse (e.g. --board anthropic)",
                  payload={"error": "board_required"})
            return 1
        try:
            entries = fetch_greenhouse_jobs(args.board, keywords, args.limit)
        except Exception as e:
            _emit(args, text=f"error: greenhouse fetch failed: {e}",
                  payload={"error": "greenhouse_fetch_failed", "detail": str(e)})
            return 1
```

Replace with:

```python
    keywords = [k.strip() for k in (args.keywords or "").split(",") if k.strip()]
    if not keywords:
        keywords = ["forward deploy", "forward deployed", "solutions engineer", "customer engineer"]

    # Mutual exclusion: --board (singular) and --boards (csv) cannot coexist.
    if args.board and args.boards:
        _emit(args,
              text="error: use --board OR --boards, not both",
              payload={"error": "board_and_boards_both_set"})
        return 1

    entries: list[dict] = []
    errors: list[dict] = []

    if args.source == "greenhouse":
        # Determine which boards to scan.
        if args.boards:
            boards = [b.strip() for b in args.boards.split(",") if b.strip()]
            for b in boards:
                try:
                    batch = fetch_greenhouse_jobs(b, keywords, args.limit)
                    entries.extend(batch)
                except Exception as e:
                    errors.append({"board": b, "reason": str(e)})
            # Dedupe by gh_id (keep first occurrence).
            seen: set = set()
            deduped: list[dict] = []
            for j in entries:
                gid = j.get("gh_id")
                if gid is not None and gid in seen:
                    continue
                if gid is not None:
                    seen.add(gid)
                deduped.append(j)
            entries = deduped
            if not entries and errors:
                _emit(args,
                      text=f"error: all {len(errors)} board(s) failed",
                      payload={"error": "all_boards_failed", "errors": errors})
                return 1
        else:
            if not args.board:
                _emit(args,
                      text="error: --board (or --boards) required for --source greenhouse",
                      payload={"error": "board_required"})
                return 1
            try:
                entries = fetch_greenhouse_jobs(args.board, keywords, args.limit)
            except Exception as e:
                _emit(args, text=f"error: greenhouse fetch failed: {e}",
                      payload={"error": "greenhouse_fetch_failed", "detail": str(e)})
                return 1
```

- [ ] **Step 5: Gate the screenshot loop on `args.skip_screenshots`**

In the same `cmd_discover`, find:

```python
        # Use agent-browser to screenshot each JD page (proves the link is live
        # and gives a visual reference for the LLM session triaging results).
        if agent_browser_available() and entries:
            ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
            for j in entries:
```

Replace with:

```python
        # Use agent-browser to screenshot each JD page (proves the link is live
        # and gives a visual reference for the LLM session triaging results).
        # Default OFF (--skip-screenshots) — opt back in with --include-screenshots.
        if not args.skip_screenshots and agent_browser_available() and entries:
            ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
            for j in entries:
```

- [ ] **Step 6: Add `--boards`, `--skip-screenshots`, `--include-screenshots` to the discover parser**

Find the `p_discover` block (around line 837). Replace:

```python
    p_discover.add_argument("--board", help="Greenhouse board slug (e.g. anthropic, palantir)")
```

with:

```python
    p_discover.add_argument("--board", help="Greenhouse board slug (e.g. anthropic, palantir)")
    p_discover.add_argument("--boards", help="Comma-separated board slugs (e.g. anthropic,palantir,openai)")
    p_discover.add_argument("--skip-screenshots", dest="skip_screenshots",
                            action="store_true", default=True,
                            help="Skip agent-browser screenshot loop (default)")
    p_discover.add_argument("--include-screenshots", dest="skip_screenshots",
                            action="store_false",
                            help="Re-enable the screenshot loop (opt-in)")
```

Note: `--skip-screenshots` defaults to `True` (skip is the default behavior). `--include-screenshots` sets the same dest to `False`. This is the standard argparse pattern for "default OFF, opt-in to ON".

- [ ] **Step 7: Update `cmd_discover`'s output to surface dedup count + errors**

Find the print block at the end of `cmd_discover` (around line 770):

```python
    if args.json:
        _emit(args, payload={"count": len(entries), "source": args.source, "jobs": entries})
    else:
        print(f"discovered {len(entries)} job(s) from {args.source} (keywords={keywords}):")
```

Replace with:

```python
    if args.json:
        _emit(args, payload={"count": len(entries), "source": args.source,
                             "jobs": entries, "errors": errors})
    else:
        suffix = f" ({len(errors)} error(s))" if errors else ""
        print(f"discovered {len(entries)} job(s) from {args.source}{suffix}:")
```

- [ ] **Step 8: Run the new test to verify it passes**

```bash
cd job-search && python3 test_smoke.py 2>&1 | grep -E "(test_discover_boards_csv|All smoke)"
```

Expected: `✓ test_discover_boards_csv` and `All smoke tests passed` (18/18).

- [ ] **Step 9: Run the full smoke suite**

```bash
cd job-search && python3 test_smoke.py
```

Expected: `All smoke tests passed` (18/18 — 14 existing + 4 new cmd_update tests + 1 new discover test = 19... wait, 14 + 5 new = 19).

Verify the count manually: `grep "^def test_" job-search/test_smoke.py | wc -l` should output `19`.

- [ ] **Step 10: Commit**

```bash
git add job-search/job-search.py job-search/test_smoke.py
git commit -m "feat(job-search): discover --boards csv with gh_id dedup + skip-screenshots default"
```

---

## Task 6: `/fde-apply.md` — Step 5.5 (draft)

**Files:**
- Modify: `.claude/commands/fde-apply.md` (insert Step 5.5)

This task has no automated test (slash commands are markdown prompts, not executable code). The verification is reading the file and confirming the new step is in place.

- [ ] **Step 1: Open `.claude/commands/fde-apply.md`**

- [ ] **Step 2: Insert Step 5.5 between current Step 5 and Step 6**

Find this block (around line 60-75):

```markdown
Collect the returned `JOB-...` ids. Report them to the user.

## Step 6 — Review
```

Insert this between them:

````markdown
Collect the returned `JOB-...` ids. Report them to the user.

## Step 5.5 — Draft

For each added job:

1. Read `job-search/state.json[job_id].jd_raw` and the chosen `resume_variant` from `job-search/profile.json`.
2. Generate inline (printed to chat with clear section headers):
   - `cover_letter` — ~300 words, tailored to role + company
   - `essay_answers.why_company` — ~150 words, ties company mission to your motivation
   - `essay_answers.why_you` — ~150 words, picks 2-3 highlights from the chosen variant
   - `essay_answers.deployment_story` — ~250 words, STAR-format story from your portfolio (Channelflow / Invenflow / Invoice Sense / Kitchen Fresh / PeopleOS)
3. Save via:
   ```bash
   python3 job-search/job-search.py --json update <JOB-ID> \
     --cover-letter "<text>" \
     --essay-answers '{"why_company":"...","why_you":"...","deployment_story":"..."}'
   ```
4. Wait for user reply. Interpret as one of:
   - "ok" / "lanjut" / "looks good" → continue to Step 6
   - "regenerate <field>" / "pendekin cover letter" → re-draft that field, re-save via `update`
   - "swap variant ke <name>" → re-draft with different variant, re-save
   - "skip" / "URL aja" → continue without drafts; user will fill manually
   - User pastes specific form questions → generate per-question drafts and save as additional `essay_answers.<q_key>` entries
5. If the user has only added some jobs to the queue, run draft step for those that need it and skip the rest.

## Step 6 — Review
````

- [ ] **Step 3: Replace Step 7 wording to remove auto-fill promise**

Find Step 7 — Submit (around line 96). Replace the "Form fields ready..." block:

```markdown
> "Form fields ready. I can drive the form fill via agent-browser MCP, or you
>  can take over. Continue automatically?"
```

with:

```markdown
> "Drafts saved. Open the form at <jd-url>, paste the drafts into the matching
>  fields, and submit. Need help with any specific essay question?"
```

- [ ] **Step 4: Read the file back to verify the changes**

Open `.claude/commands/fde-apply.md` and confirm:
- Step 5.5 exists between "Collect the returned `JOB-...` ids" and "## Step 6 — Review"
- Step 7 wording no longer mentions agent-browser auto-fill

- [ ] **Step 5: Commit**

```bash
git add .claude/commands/fde-apply.md
git commit -m "feat(fde-apply): add Step 5.5 draft + drop auto-fill from Step 7"
```

---

## Task 7: `README.md` — document `update` and new `discover` flags

**Files:**
- Modify: `job-search/README.md`

- [ ] **Step 1: Add `update` to the usage section**

Open `job-search/README.md`. Find the `## Usage` section. After the `delete` example block (around line 86), add:

````markdown
# Update an existing job (drafts, variant override)
python3 job-search.py update JOB-2026-08-12-001 \
  --cover-letter "Dear Hiring Team, ..." \
  --essay-answers '{"why_company":"...","why_you":"...","deployment_story":"..."}'

# Override resume variant for a queued job
python3 job-search.py update JOB-2026-08-12-001 --resume-variant general-fde
````

- [ ] **Step 2: Add new `discover` flags to the Finding jobs section**

Find the `## Finding jobs` section. After the existing `--keywords` example (around line 115), add:

````markdown
# Scan multiple boards in one call (merges + dedupes by gh_id)
python3 job-search.py --json discover --source greenhouse \
  --boards anthropic,palantir,openai,scale,ramp,brex,stripe --limit 10

# Skip the agent-browser screenshot loop (default — saves ~50s per scan)
python3 job-search.py --json discover --source greenhouse --board anthropic

# Opt back in to screenshots (useful if you want visual previews of each JD)
python3 job-search.py --json discover --source greenhouse --board anthropic \
  --include-screenshots
````

- [ ] **Step 3: Update the design-link section if present**

If the README references the design doc, add a link to the new spec:

```markdown
This implementation matches the spec at `docs/superpowers/specs/2026-08-12-fde-apply-draft-mode-design.md`.
```

(Add this sentence to the bottom of the `## The /fde-apply slash command` section.)

- [ ] **Step 4: Commit**

```bash
git add job-search/README.md
git commit -m "docs(job-search): document update subcommand + discover --boards/--skip-screenshots"
```

---

## Task 8: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full smoke test suite**

```bash
cd job-search && python3 test_smoke.py
```

Expected: `All smoke tests passed` and the line above showing all 19 `✓ test_*` results.

- [ ] **Step 2: Verify the test count**

```bash
grep "^def test_" job-search/test_smoke.py | wc -l
```

Expected: `19`.

- [ ] **Step 3: Verify the spec is unchanged from the committed version**

```bash
git log --oneline -1 docs/superpowers/specs/2026-08-12-fde-apply-draft-mode-design.md
```

Expected: `1612c57 docs: add /fde-apply draft mode design` (the commit from the brainstorming phase).

- [ ] **Step 4: Verify state.json schema is forward-compatible**

Run this one-liner to confirm old jobs (with no `updated_at`) still load:

```bash
python3 -c "
import json
from pathlib import Path
s = json.loads(Path('job-search/state.json').read_text())
for j in s['jobs']:
    assert 'updated_at' in j, f'missing updated_at on {j[\"id\"]}'
    print(f'{j[\"id\"]} status={j[\"status\"]} updated_at={j[\"updated_at\"]}')
"
```

Expected: each line prints the JOB id and `updated_at=None` (for jobs created before this design) or an ISO timestamp (for jobs created or updated after).

- [ ] **Step 5: End-to-end manual smoke (optional but recommended)**

```bash
# Add a real job
JOB=$(python3 job-search/job-search.py --json add \
  --company "Test Co" --role "FDE" \
  --jd-url "https://example.com/jobs/1" \
  --jd-text "FDE role. Python, TypeScript, customer-facing." \
  --resume-variant ai-startup | python3 -c "import json,sys;print(json.load(sys.stdin)['id'])")

# Draft it
python3 job-search/job-search.py --json update "$JOB" \
  --cover-letter "Dear Hiring Team, ..." \
  --essay-answers '{"why_company":"Mission-aligned.","why_you":"Shipped Mastra agent.","deployment_story":"STAR."}'

# Confirm state.json has the drafts
python3 -c "
import json
s = json.load(open('job-search/state.json'))
j = next(j for j in s['jobs'] if j['id'] == '$JOB')
print('cover_letter length:', len(j['cover_letter']))
print('essay_answers keys:', list(j['essay_answers'].keys()))
print('updated_at:', j['updated_at'])
"
```

Expected: shows non-empty cover_letter, 3 essay keys, and an ISO timestamp.

- [ ] **Step 6: Final commit (if anything was missed)**

If Step 5 surfaced a missing field or unexpected output, fix the offending task's implementation and re-run the suite. Otherwise, no commit needed — the implementation is complete.

---

## Acceptance criteria (from spec)

- [ ] AC1: `/fde-apply` produces cover_letter + 3 standard essays for any newly-added job without re-running discovery. (Verified via Step 5.5 in slash command + Task 2 implementation.)
- [ ] AC2: Drafts persist across Claude Code sessions (visible via `queue` or `review <JOB-ID>`). (Verified by Task 8 Step 4 — `state.json` contains `cover_letter` + `essay_answers` + `updated_at`.)
- [ ] AC3: User can say "regenerate X" / "swap variant" / "skip" and slash command handles each inline. (Verified by Step 5.5's interpretation block.)
- [ ] AC4: `python3 job-search/test_smoke.py` shows 19/19 pass. (Verified by Task 8 Step 1.)
- [ ] AC5: No schema migration needed; old jobs still readable. (Verified by Task 8 Step 4 — existing 5 jobs load with `updated_at=None`.)

---

## Self-review checklist (run before declaring done)

- [ ] No placeholders: search the plan for "TBD", "TODO", "fill in", "similar to Task N". None present.
- [ ] Type consistency: `cmd_update`, `cmd_discover`, `updated_at`, `cover_letter`, `essay_answers`, `--boards`, `--skip-screenshots` used identically across all tasks.
- [ ] Spec coverage: each locked decision (1-10) is implemented:
  - Decision 1 (Claude-side drafting): Task 6.
  - Decision 2 (state.json persistence): Task 2.
  - Decision 3 (hybrid essays): Task 6 interpretation block.
  - Decision 4 (add draft step, keep submit/confirm): Task 6.
  - Decision 5 (inline iterative chat): Task 6 interpretation block.
  - Decision 6 (3 standard essays): Task 6 generation list.
  - Decision 7 (Pendekatan B scope): Tasks 2-7 are exactly Pendekatan B.
  - Decision 8 (updated_at field): Task 1.
  - Decision 9 (default skip screenshots): Task 5.
  - Decision 10 (--boards CSV with dedup): Task 5.
- [ ] All 5 spec tests (`test_update_sets_cover_letter`, `test_update_rejects_submitted`, `test_update_rejects_invalid_json`, `test_update_validates_lengths`, `test_discover_boards_csv`) are written and passing.
- [ ] All existing 14 tests still pass.
- [ ] No `update` / `discover` test depends on network, agent-browser, or files outside `tmpdir`.
- [ ] Each task's commit message follows `<type>(<scope>): <subject>` convention matching recent repo history.
