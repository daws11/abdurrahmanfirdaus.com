# /fde-apply Draft Mode — Design

**Date:** 2026-08-12
**Status:** Approved (awaiting user review of written spec)
**Author:** Claude (brainstorming session)
**Subject:** Abdurrahman Firdaus (Daus)
**Supersedes:** `2026-08-11-forward-deploy-job-search-automation-design.md` § Decisions 5/9/10 (drafting was specified but never implemented)

---

## Purpose

Extend the existing `/fde-apply` slash command so it actually generates **draft answers** to job application forms (cover letter + essays), persists them to `state.json`, and shows them to the user. The user fills the form manually from the URL — automation stops at draft generation, no auto-submit.

This closes the gap where `Job.cover_letter` and `Job.essay_answers` fields existed in the dataclass but were never populated.

## Non-Goals

- Not building auto-submit. User fills forms themselves.
- Not building form-question extraction from JDs (heuristic). Standard essays + user-pasted questions only.
- Not generating resume variants — those are pre-defined in `profile.json`.
- Not touching `submit` / `confirm` flows (still optional, behavior unchanged).
- Not retroactive drafting of existing jobs in queue.
- Not adding new dependencies. Python stdlib only.
- Not breaking existing 14 smoke tests.

---

## Decisions (locked from brainstorming)

| # | Decision | Locked value |
|---|---|---|
| 1 | Draft generation location | Claude-side (inside `/fde-apply` slash command) |
| 2 | Persistence | `state.json` via new `update` subcommand |
| 3 | Essay sourcing | Hybrid — 3 standard essays auto-generated + per-question drafts if user pastes questions |
| 4 | Flow shape | Insert draft step between `add` and `review`. Keep `submit` / `confirm` as optional. |
| 5 | Draft interaction | Inline iterative chat — user replies with "ok" / "regenerate X" / "swap variant" / "skip" |
| 6 | Standard essays | `why_company` + `why_you` + `deployment_story` (STAR format) |
| 7 | Approach scope | Pendekatan B (A + discover quick wins) |
| 8 | Schema change | Add `updated_at` field to Job dataclass (optional/null for old jobs). No version bump. |
| 9 | Screenshot behavior in discover | Default behavior = skip screenshot loop (no Chrome tabs). `--skip-screenshots` flag defaults `True`. Opt back in with `--include-screenshots`. |
| 10 | Multi-board discover | New `--boards <csv>` flag, dedupe by `gh_id`, partial-failure tolerant. |

---

## Architecture

### File layout (changes)

```
job-search/
  job-search.py                    # +135 LOC (cmd_update ~80, --boards/--skip-screenshots ~50, updated_at field +5)
  test_smoke.py                    # +150 LOC (5 new tests)
  state.json                       # unchanged schema (new jobs gain updated_at)
  profile.json                     # unchanged
  discovery.json                   # unchanged format (multi-board merge writes same shape)

.claude/commands/
  fde-apply.md                     # +40 LOC (new Step 5.5)

docs/superpowers/specs/
  2026-08-12-fde-apply-draft-mode-design.md  # this file
```

No new directories. No new dependencies.

### Stack

- Python 3 stdlib only. Reuses existing helpers: `_state_lock()`, `load_state()`, `save_state()`, `_profile_variants()`, `_arg_non_empty()`.
- Slash command is markdown prompt — no runtime code.

### Why no schema version bump

Existing `version: 1` schema is forward-compatible with the `updated_at` addition. The new field is optional (`str | None = None`). Old jobs read fine, new jobs write the field. No migration needed.

---

## Components

### 1. New CLI subcommand: `update`

```
python3 job-search.py update <JOB-ID>
    [--cover-letter "<text>"]
    [--essay-answers '{"why_company": "...", "why_you": "...", "deployment_story": "..."}']
    [--resume-variant <name>]
```

**Validation (all before lock release):**
- JOB-ID must exist in state.
- Status must be `draft` or `approved`. Submitted/rejected are read-only.
- `--cover-letter` ≤ 10000 chars if provided.
- `--essay-answers` must be valid JSON, ≤ 20 keys, each value ≤ 5000 chars.
- `--resume-variant` must exist in `profile.json` variants.
- At least one of the three update fields must be provided.

**Mutation:**
- Acquire `_state_lock()`.
- Apply provided fields. Other fields untouched. `essay_answers` keys merge (don't overwrite unspecified keys).
- Set `job["updated_at"] = _now_iso()`.
- `save_state()` — atomic write + backup rotation.

**Output:**
- `--json`: `{"id": "...", "updated_fields": ["cover_letter", "essay_answers"], "status": "draft"}`
- Human: `updated JOB-... (cover_letter, essay_answers)`

### 2. `discover` changes

**New argparse flags:**

| Flag | Default | Purpose |
|---|---|---|
| `--boards <csv>` | (none) | Comma-separated board slugs. Mutually exclusive with `--board`. |
| `--skip-screenshots` | `True` | Skip agent-browser screenshot loop. |
| `--include-screenshots` | (none) | Counterpart opt-in flag. Sets `--skip-screenshots False`. |

**Multi-board logic:**

```python
if args.board and args.boards:
    return error("board_and_boards_both_set")
if args.boards:
    boards = [b.strip() for b in args.boards.split(",") if b.strip()]
    entries, errors = [], []
    for b in boards:
        try:
            entries.extend(fetch_greenhouse_jobs(b, keywords, args.limit))
        except Exception as e:
            errors.append({"board": b, "reason": str(e)})
    entries = dedupe_by_gh_id(entries)
elif args.board:
    entries = fetch_greenhouse_jobs(args.board, keywords, args.limit)
```

`dedupe_by_gh_id` keeps first occurrence per `gh_id` (later board wins on ties via insertion order).

**Screenshot loop:** gated on `not args.skip_screenshots`. Default OFF.

### 3. Slash command: Step 5.5 (NEW)

Inserted between current Step 5 (`add`) and Step 6 (`review`). Reads:

```markdown
## Step 5.5 — Draft

For each added job:

1. Read `state.json[job_id].jd_raw` and `profile.json.variants[resume_variant]`.
2. Generate inline (printed to chat with section headers):
   - `cover_letter` — ~300 words, tailored to role + company
   - `essay_answers.why_company` — ~150 words, ties mission to personal motivation
   - `essay_answers.why_you` — ~150 words, picks 2-3 highlights from chosen variant
   - `essay_answers.deployment_story` — ~250 words, STAR-format from portfolio
3. Save via:
   ```
   python3 job-search/job-search.py --json update <JOB-ID> \
     --cover-letter "<text>" \
     --essay-answers '{"why_company":"...","why_you":"...","deployment_story":"..."}'
   ```
4. Wait for user reply. Interpret as one of:
   - "ok" / "lanjut" / "looks good" → continue to Step 6
   - "regenerate <field>" / "pendekin cover letter" → re-draft field, re-save via update
   - "swap variant ke <name>" → re-draft with different variant, re-save
   - "skip" / "URL aja" → continue without drafts, user fills manually
   - User pastes form questions → generate per-question drafts, save as additional essay_answers keys
```

### 4. State.json schema (additive change)

```python
@dataclass
class Job:
    # ... existing fields ...
    cover_letter: str = ""              # now actually populated
    essay_answers: dict = field(...)    # now actually populated
    updated_at: str | None = None       # NEW: timestamp of last update
```

`updated_at` is `None` for jobs added before this design ships. Doesn't break existing readers.

---

## Data flow

### Happy path: discover → add → draft → ready

```
User: /fde-apply
  Step 1: scope → "default boards"
  Step 2: discover --boards anthropic,palantir,...,stripe --skip-screenshots
          → 7 internal fetches → merged → deduped → discovery.json
  Step 3: Claude reads discovery.json + profile.json → scores
  Step 4: Claude presents top 3-5
  Step 5: for each approved job: add → state.json (status=draft)
  Step 5.5 (NEW):
          Claude reads JD + profile → drafts 4 fields → prints
          Claude: update <JOB-ID> --cover-letter "..." --essay-answers '{...}'
          → state.json gains cover_letter + essay_answers + updated_at
          User: "ok" → continue
          User: "regenerate cover letter" → Claude re-drafts, runs update again
  Step 6: review → approve (gates submit, not draft)
  Step 7-8: submit + confirm (optional, unchanged)
```

### Multi-board discover with partial failure

```
discover --boards anthropic,palantir,stripe
  ├─ fetch anthropic → 12 entries
  ├─ fetch palantir → 8 entries
  ├─ fetch stripe → (network error)
  ├─ dedupe → 20 entries (0 dupes)
  ├─ skip screenshot loop (default)
  ├─ save_discovery(entries)
  └─ print:
      discovered 20 jobs from 3 boards (1 error: stripe network timeout)
      errors: [{"board": "stripe", "reason": "..."}]
```

### `update` read-modify-save

```
update JOB-X --cover-letter "X" --essay-answers '{...}'
  ├─ acquire _state_lock()
  ├─ load_state() (with backup fallback)
  ├─ find job → must exist, status in {draft, approved}
  ├─ validate all inputs (lengths, JSON, variant)
  ├─ apply fields (merge essay_answers, don't overwrite unspecified)
  ├─ set updated_at
  ├─ save_state() (atomic + rotate backups)
  └─ emit JSON or human output
```

### Existing 5 jobs in queue

Not retroactively drafted. Schema change is forward-compatible (`updated_at = None`). User CAN backfill manually by saying "draft this for JOB-2026-08-11-001" — not in spec scope.

---

## Error handling

### `update` errors

| Condition | Output | Exit |
|---|---|---|
| JOB-ID not found | `{"error": "not_found", "job_id": "..."}` | 1 |
| Status is `submitted` | `{"error": "already_submitted", "status": "submitted"}` | 1 |
| Status is `rejected` | `{"error": "wrong_status", "status": "rejected"}` | 1 |
| `--cover-letter` > 10000 chars | `{"error": "cover_letter_too_long", "max": 10000}` | 1 |
| `--essay-answers` invalid JSON | `{"error": "essay_json_invalid", "detail": "..."}` | 1 |
| `--essay-answers` > 20 keys | `{"error": "too_many_essay_keys", "count": N, "max": 20}` | 1 |
| Essay value > 5000 chars | `{"error": "essay_value_too_long", "key": "...", "max": 5000}` | 1 |
| `--resume-variant` unknown | `{"error": "unknown_variant", "variant": "...", "choices": [...]}` | 1 |
| No update fields provided | `{"error": "no_fields_to_update"}` | 1 |

All validation runs BEFORE lock release with any mutation.

### `discover` errors

| Condition | Output | Exit |
|---|---|---|
| Both `--board` and `--boards` | `{"error": "board_and_boards_both_set"}` | 1 |
| `--boards` with non-greenhouse source (linkedin OR file) | `{"error": "boards_only_for_greenhouse"}` | 1 |
| One board fails | continue, emit `errors: [...]` | 0 |
| All boards fail | `{"error": "all_boards_failed", "errors": [...]}` | 1 |
| agent-browser missing + screenshots requested | `{"error": "agent_browser_missing", "note": "screenshot loop skipped"}` | 0 |
| Duplicate gh_id | dedupe (keep first), log "deduped: N jobs" | 0 |

### State file safety (unchanged)

- `_state_lock()` prevents concurrent writes.
- `load_state()` falls back through `.bak`, `.bak.1`, `.bak.2`.
- `save_state()` does atomic temp + rename + rotating backups.

---

## Testing

### New tests (5 total)

| Test | Verifies |
|---|---|
| `test_update_sets_cover_letter` | Happy path: cover_letter + essay_answers + updated_at written to state.json |
| `test_update_rejects_submitted` | update on `submitted` job returns error, no mutation |
| `test_update_rejects_invalid_json` | malformed `--essay-answers` fails before lock release |
| `test_update_validates_lengths` | cover_letter > 10000 chars and essay value > 5000 chars rejected |
| `test_discover_boards_csv` | multi-board merge works, dedupe by gh_id correct |

### Not tested (intentional)

- LLM-drafted content quality — human judgment.
- Slash command prompt behavior — markdown prompts, not code.
- agent-browser screenshot loop when opted-in — already covered by existing `test_discover_greenhouse_real` when browser on PATH.

### Test runner

```bash
python3 job-search/test_smoke.py
```

Existing 14 tests must still pass. New 5 bring total to **19/19 pass**.

---

## Out of scope (explicitly deferred)

- ❌ Retroactive drafting of existing 5 jobs.
- ❌ LinkedIn source removal (already broken, leave alone).
- ❌ `summary` subcommand.
- ❌ Moving default boards to `profile.json`.
- ❌ `--first-name` / `--last-name` split in `default_personal`.
- ❌ `review approve --variant` override.
- ❌ Schema version bump (no breaking change).
- ❌ Auto-form-fill via agent-browser — explicitly removed from Step 7 wording.
- ❌ Form-question extraction from JD text (heuristic, fragile).

---

## Rollback plan

- `update` is additive — never deletes data. Output makes it obvious what changed.
- `--boards` is additive — old `--board` still works.
- `--skip-screenshots` defaults ON (saves time, no behavior loss). Old behavior via `--include-screenshots`.
- All changes isolated per file. Reverting any one file restores prior behavior.

---

## Acceptance criteria

Done when:
1. `/fde-apply` produces cover_letter + 3 standard essays for any newly-added job without re-running discovery.
2. Drafts persist across Claude Code sessions (visible via `queue` or `review <JOB-ID>`).
3. User can say "regenerate X" / "swap variant" / "skip" and slash command handles each inline.
4. `python3 job-search/test_smoke.py` shows 19/19 pass (14 existing + 5 new).
5. No changes to `state.json` schema force a migration; old jobs still readable.

---

## File-level diff summary

| File | Type | Lines | Description |
|---|---|---|---|
| `job-search/job-search.py` | modify | +135 | `cmd_update` (~80), `--boards` / `--skip-screenshots` argparse + logic (~50), `updated_at` field (+5) |
| `.claude/commands/fde-apply.md` | modify | +40 | New Step 5.5 |
| `job-search/test_smoke.py` | modify | +150 | 5 new test functions |
| `docs/superpowers/specs/2026-08-12-fde-apply-draft-mode-design.md` | create | (this file) | Spec, ~250 lines |

**Total: ~575 lines added across 4 files. No deletions.**
