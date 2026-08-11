"""Smoke test for job-search CLI.

Drives the actual CLI binary via subprocess.run. No mocks.
Run: python3 <this-dir>/test_smoke.py
Exit 0 = pass.
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

# Allow override via env (useful when this script lives in a repo that
# gets relocated). Default: the directory containing this file.
ROOT = Path(os.environ.get("JOB_SEARCH_ROOT") or Path(__file__).resolve().parent)
CLI = ROOT / "job-search.py"


def run_cli(args: list[str], env: dict | None = None, input_text: str | None = None) -> subprocess.CompletedProcess:
    """Run the CLI as a subprocess. Returns CompletedProcess."""
    return subprocess.run(
        [sys.executable, str(CLI), *args],
        capture_output=True,
        text=True,
        env=env,
        input=input_text,
        timeout=30,
    )


def add_job(env: dict, company: str, role: str = "Forward Deployed Engineer",
            url: str = "https://example.com/jobs/1",
            jd: str = "FDE role. Python and TypeScript required.",
            variant: str = "general-fde") -> str:
    """Helper: add a job via --json, return its JOB-id. Fails the test on error."""
    r = run_cli([
        "--json", "add",
        "--company", company, "--role", role,
        "--jd-url", url, "--jd-text", jd,
        "--resume-variant", variant,
    ], env=env)
    assert r.returncode == 0, f"add failed: {r.stderr}"
    return json.loads(r.stdout.strip())["id"]


def fresh_state(tmpdir: Path) -> dict:
    """Env vars to redirect state.json into tmpdir (via JOB_SEARCH_STATE_DIR)."""
    return {**os.environ, "JOB_SEARCH_STATE_DIR": str(tmpdir)}


def _ab_close() -> None:
    if not shutil.which("agent-browser"):
        return
    try:
        subprocess.run(
            ["agent-browser", "close"],
            capture_output=True, text=True, timeout=10,
        )
    except Exception:
        pass


# -- Core lifecycle -----------------------------------------------------------

def test_add_then_queue(tmpdir: Path) -> None:
    """Step 1: add → queue shows 1 draft job."""
    env = fresh_state(tmpdir)
    job_id = add_job(env, "Test Corp")

    r = run_cli(["queue", "--status", "draft"], env=env)
    assert r.returncode == 0, f"queue failed: {r.stderr}"
    assert "Test Corp" in r.stdout
    assert job_id in r.stdout


def test_review_approve(tmpdir: Path) -> None:
    """Step 2: review <id> approve moves draft → approved."""
    env = fresh_state(tmpdir)
    job_id = add_job(env, "Test Corp")

    r = run_cli(["--json", "review", job_id, "approve"], env=env)
    assert r.returncode == 0, f"review approve failed: {r.stderr}"
    payload = json.loads(r.stdout.strip())
    assert payload["status"] == "approved"

    r = run_cli(["queue", "--status", "approved"], env=env)
    assert "Test Corp" in r.stdout


def test_submit_dry_run_and_confirm(tmpdir: Path) -> None:
    """Step 3a: submit --dry-run previews but does NOT mutate state.
    Step 3b: confirm <id> transitions approved → submitted.
    """
    env = fresh_state(tmpdir)
    job_id = add_job(env, "DryRun Co", role="Solutions Engineer")
    run_cli(["--json", "review", job_id, "approve"], env=env)

    # 3a: dry-run must NOT mutate state
    r = run_cli(["--json", "submit", "--dry-run", job_id], env=env)
    assert r.returncode == 0, f"submit --dry-run failed: {r.stderr}"
    payload = json.loads(r.stdout.strip())
    assert payload["dry_run"] is True
    assert any(o["id"] == job_id for o in payload["would_submit"])

    state_file = tmpdir / "state.json"
    state = json.loads(state_file.read_text())
    job = next(j for j in state["jobs"] if j["id"] == job_id)
    assert job["status"] == "approved", \
        f"dry-run mutated state to {job['status']!r}, expected 'approved'"

    # 3b: confirm transitions to submitted
    r = run_cli(["--json", "confirm", job_id], env=env)
    assert r.returncode == 0, f"confirm failed: {r.stderr}"
    state = json.loads(state_file.read_text())
    job = next(j for j in state["jobs"] if j["id"] == job_id)
    assert job["status"] == "submitted"
    assert job.get("submitted_at"), "submitted_at not stamped"
    assert (job.get("submit_id") or "").startswith("CONFIRMED-")


def test_submit_opens_browser(tmpdir: Path) -> None:
    """Step 4: submit (no --dry-run) opens URL via agent-browser, saves artifacts, does NOT mutate state.
    Skipped if agent-browser is not on PATH.
    """
    if not shutil.which("agent-browser"):
        print("    (skipped: agent-browser not in PATH)")
        return

    _ab_close()
    try:
        env = fresh_state(tmpdir)
        job_id = add_job(env, "Browser Co", url="https://example.com/")
        run_cli(["--json", "review", job_id, "approve"], env=env)

        r = run_cli(["--json", "submit", job_id], env=env)
        assert r.returncode == 0, f"submit failed: {r.stderr}"
        payload = json.loads(r.stdout.strip())
        assert payload["opened_count"] == 1
        assert payload["error_count"] == 0

        artifacts_dir = tmpdir / "artifacts"
        assert artifacts_dir.is_dir()
        assert (artifacts_dir / f"{job_id}-prefill.png").is_file()
        assert (artifacts_dir / f"{job_id}-snapshot.txt").is_file()

        # state NOT mutated
        state = json.loads((tmpdir / "state.json").read_text())
        job = next(j for j in state["jobs"] if j["id"] == job_id)
        assert job["status"] == "approved", \
            f"submit mutated state to {job['status']!r}, expected 'approved'"
    finally:
        _ab_close()


def test_confirm_rejects_non_approved(tmpdir: Path) -> None:
    """Step 5: confirm requires state==approved; rejects with clear error otherwise."""
    env = fresh_state(tmpdir)
    job_id = add_job(env, "Confirm Co")

    r = run_cli(["--json", "confirm", job_id], env=env)
    assert r.returncode != 0
    payload = json.loads(r.stdout.strip())
    assert payload.get("error") == "not_approved"

    run_cli(["--json", "review", job_id, "approve"], env=env)
    r = run_cli(["--json", "confirm", job_id, "--notes", "auto-confirmed via smoke test"], env=env)
    assert r.returncode == 0
    state = json.loads((tmpdir / "state.json").read_text())
    job = next(j for j in state["jobs"] if j["id"] == job_id)
    assert job["status"] == "submitted"
    assert job["submit_notes"] == "auto-confirmed via smoke test"


def test_state_json_schema(tmpdir: Path) -> None:
    """Step 6: state.json has the documented top-level shape."""
    env = fresh_state(tmpdir)
    add_job(env, "Schema Co")
    state = json.loads((tmpdir / "state.json").read_text())
    assert state["version"] == 1
    assert isinstance(state["jobs"], list)
    j = state["jobs"][0]
    for key in ("id", "company", "role", "status", "form_fields", "created_at"):
        assert key in j, f"missing key {key}: {list(j.keys())}"


# -- Discover (find jobs) -----------------------------------------------------

def test_discover_from_file(tmpdir: Path) -> None:
    """discover --source file reads pre-formatted entries and persists to discovery.json."""
    fixture = tmpdir / "fixture.json"
    fixture.write_text(json.dumps([
        {
            "title": "Forward Deployed Engineer",
            "company": "Test Co",
            "location": "Remote",
            "url": "https://example.com/jobs/1",
            "jd_text": "Build cool stuff. Python required.",
        },
        {
            "title": "Backend Engineer",
            "company": "Other Co",
            "location": "NYC",
            "url": "https://example.com/jobs/2",
            "jd_text": "Maintain services. Go experience a plus.",
        },
    ]))

    env = fresh_state(tmpdir)
    r = run_cli(["--json", "discover", "--source", "file", "--file", str(fixture)], env=env)
    assert r.returncode == 0, f"discover failed: {r.stderr}"
    payload = json.loads(r.stdout.strip())
    assert payload["count"] == 2
    assert payload["source"] == "file"
    assert payload["jobs"][0]["id"] == "DISC-001"
    assert payload["jobs"][0]["title"] == "Forward Deployed Engineer"

    # discovery.json created in STATE_DIR (which is tmpdir)
    discovery_path = tmpdir / "discovery.json"
    assert discovery_path.exists(), "discovery.json not written"
    state = json.loads(discovery_path.read_text())
    assert state["version"] == 1
    assert state["discovered_at"]
    assert len(state["jobs"]) == 2


def test_discover_greenhouse_real(tmpdir: Path) -> None:
    """discover --source greenhouse hits the real API. Skipped if no network."""
    env = fresh_state(tmpdir)
    try:
        r = run_cli(["--json", "discover", "--source", "greenhouse",
                     "--board", "stripe", "--limit", "3",
                     "--keywords", "forward deploy"], env=env)
    except subprocess.TimeoutExpired:
        print("    (skipped: greenhouse request timed out)")
        return
    if r.returncode != 0:
        print(f"    (skipped: greenhouse unreachable: {r.stderr.strip()[:80]})")
        return
    payload = json.loads(r.stdout.strip())
    assert payload["source"] == "greenhouse"
    assert payload["count"] >= 1, "expected at least 1 FDE role at stripe"
    assert any("forward" in j["title"].lower() for j in payload["jobs"]), \
        f"no FDE titles in results: {[j['title'] for j in payload['jobs']]}"


# -- New fixes (issues 6.1, 6.2, 6.5, 6.6, 6.7, 6.8, 6.10) -----------------

def test_input_validation_rejects_bad_input(tmpdir: Path) -> None:
    """6.5: empty --company and bad --jd-url are rejected by argparse type=."""
    env = fresh_state(tmpdir)

    # Empty company
    r = run_cli(["add", "--company", "  ", "--role", "FDE",
                 "--jd-url", "https://example.com/", "--jd-text", "x"], env=env)
    assert r.returncode != 0, "empty company should fail"
    assert "must not be empty" in r.stderr

    # Bad URL
    r = run_cli(["add", "--company", "X", "--role", "FDE",
                 "--jd-url", "not-a-url", "--jd-text", "x"], env=env)
    assert r.returncode != 0, "bad URL should fail"
    assert "invalid --jd-url" in r.stderr

    # http (not https) is accepted
    r = run_cli(["add", "--company", "X", "--role", "FDE",
                 "--jd-url", "http://example.com/", "--jd-text", "x"], env=env)
    assert r.returncode == 0, f"http URL should be accepted: {r.stderr}"


def test_json_output(tmpdir: Path) -> None:
    """6.7: --json emits parseable JSON with the expected keys."""
    env = fresh_state(tmpdir)
    r = run_cli(["--json", "add", "--company", "JSON Co", "--role", "FDE",
                 "--jd-url", "https://example.com/", "--jd-text", "x"], env=env)
    assert r.returncode == 0
    payload = json.loads(r.stdout.strip())
    assert payload["id"].startswith("JOB-")
    assert payload["company"] == "JSON Co"
    assert payload["status"] == "draft"

    # queue --json too
    r = run_cli(["--json", "queue"], env=env)
    assert r.returncode == 0
    payload = json.loads(r.stdout.strip())
    assert payload["count"] == 1
    assert payload["jobs"][0]["company"] == "JSON Co"


def test_delete_force(tmpdir: Path) -> None:
    """6.10: delete --force removes a job from state."""
    env = fresh_state(tmpdir)
    job_id = add_job(env, "Del Co")

    # Confirm present
    state = json.loads((tmpdir / "state.json").read_text())
    assert any(j["id"] == job_id for j in state["jobs"])

    # Delete
    r = run_cli(["--json", "delete", job_id, "--force"], env=env)
    assert r.returncode == 0
    payload = json.loads(r.stdout.strip())
    assert payload["deleted"] is True

    # Confirm gone
    state = json.loads((tmpdir / "state.json").read_text())
    assert all(j["id"] != job_id for j in state["jobs"]), "job should be removed"


def test_delete_requires_force(tmpdir: Path) -> None:
    """6.10: delete without --force returns non-zero with a clear payload."""
    env = fresh_state(tmpdir)
    job_id = add_job(env, "Protected Co")

    r = run_cli(["--json", "delete", job_id], env=env)
    assert r.returncode != 0
    payload = json.loads(r.stdout.strip())
    assert payload.get("error") == "force_required"

    # State unchanged
    state = json.loads((tmpdir / "state.json").read_text())
    assert any(j["id"] == job_id for j in state["jobs"])


def test_profile_variant_choices(tmpdir: Path) -> None:
    """6.8: --resume-variant accepts any variant from profile.json; rejects unknown."""
    profile = json.loads((ROOT / "profile.json").read_text())
    expected = sorted((profile.get("variants") or {}).keys())
    assert expected, "profile.json must have at least one variant"

    env = fresh_state(tmpdir)
    # Each declared variant must be accepted
    for variant in expected:
        r = run_cli(["add", "--company", f"Co-{variant}", "--role", "FDE",
                     "--jd-url", "https://example.com/", "--jd-text", "x",
                     "--resume-variant", variant], env=env)
        assert r.returncode == 0, f"variant {variant!r} rejected: {r.stderr}"

    # Unknown variant must be rejected
    r = run_cli(["add", "--company", "X", "--role", "FDE",
                 "--jd-url", "https://example.com/", "--jd-text", "x",
                 "--resume-variant", "not-in-profile"], env=env)
    assert r.returncode != 0, "unknown variant should be rejected"


def test_title_default_matches_canonical(tmpdir: Path) -> None:
    """Canonical title stays in sync across portfolio + job-search profile."""
    profile = json.loads((ROOT / "profile.json").read_text())
    assert profile["default_personal"]["title_default"] == "Forward Deployed Engineer & Tech Lead"


def test_rolling_backup_recovery(tmpdir: Path) -> None:
    """6.2: corrupt state.json triggers fallback to .bak; state is not lost."""
    env = fresh_state(tmpdir)
    # First save: only state.json is created (no .bak yet).
    add_job(env, "First Co")
    # Second save: rotates state.json → .bak, writes a new state.json.
    add_job(env, "Second Co")
    assert (tmpdir / "state.json.bak").exists(), "second save should have created .bak"

    # Corrupt the main file; load_state should fall back to .bak.
    (tmpdir / "state.json").write_text("{ not valid json")

    r = run_cli(["--json", "queue"], env=env)
    assert r.returncode == 0, f"queue after corruption failed: {r.stderr}"
    payload = json.loads(r.stdout.strip())
    # The .bak from the second save still contains "First Co" (the state
    # captured before the second add), so the recovered queue should be
    # non-empty and contain that job.
    assert payload["count"] >= 1
    companies = {j["company"] for j in payload["jobs"]}
    assert "First Co" in companies, f"recovery missed 'First Co': {companies}"


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


# -- Runner -------------------------------------------------------------------

def main() -> int:
    failures = 0
    with tempfile.TemporaryDirectory() as tmp:
        tests = [
            test_add_then_queue,
            test_review_approve,
            test_submit_dry_run_and_confirm,
            test_submit_opens_browser,
            test_confirm_rejects_non_approved,
            test_state_json_schema,
            # New fixes
            test_input_validation_rejects_bad_input,
            test_json_output,
            test_delete_force,
            test_delete_requires_force,
            test_profile_variant_choices,
            test_title_default_matches_canonical,
            test_rolling_backup_recovery,
            # Discover
            test_discover_from_file,
            test_discover_greenhouse_real,
            # Update (drafts)
            test_update_sets_cover_letter,
        ]
        for test_fn in tests:
            tmpdir = Path(tmp) / test_fn.__name__
            tmpdir.mkdir()
            try:
                test_fn(tmpdir)
                print(f"  ✓ {test_fn.__name__}")
            except AssertionError as e:
                print(f"  ✗ {test_fn.__name__}: {e}")
                failures += 1
            except Exception as e:
                print(f"  ✗ {test_fn.__name__}: {type(e).__name__}: {e}")
                failures += 1
    if failures:
        print(f"\n{failures}/{len(tests)} tests failed")
        return 1
    print(f"\nAll smoke tests passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
