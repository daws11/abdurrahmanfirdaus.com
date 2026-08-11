"""Smoke test for job-search CLI.

Drives the actual CLI binary via subprocess.run. No mocks.
Run: python3 <this-dir>/test_smoke.py
Exit 0 = pass.
"""
import json
import os
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


def fresh_state(tmpdir: Path) -> dict:
    """Env vars to redirect state.json into tmpdir (via JOB_SEARCH_STATE_DIR)."""
    return {**os.environ, "JOB_SEARCH_STATE_DIR": str(tmpdir)}


def test_add_then_queue(tmpdir: Path) -> None:
    """Step 1: add → queue shows 1 draft job."""
    env = fresh_state(tmpdir)
    jd_text = "We're looking for a Forward Deployed Engineer who can ship in customer environments. Python and TypeScript required."

    r = run_cli([
        "add",
        "--company", "Test Corp",
        "--role", "Forward Deployed Engineer",
        "--jd-url", "https://example.com/jobs/1",
        "--jd-text", jd_text,
        "--resume-variant", "general-fde",
    ], env=env)
    assert r.returncode == 0, f"add failed: {r.stderr}"
    assert "JOB-" in r.stdout, f"no JOB-id returned: {r.stdout}"

    r = run_cli(["queue", "--status", "draft"], env=env)
    assert r.returncode == 0, f"queue failed: {r.stderr}"
    assert "Test Corp" in r.stdout


def test_review_approve(tmpdir: Path) -> None:
    """Step 2: review <id> approve moves draft → approved."""
    env = fresh_state(tmpdir)
    add_result = run_cli([
        "add",
        "--company", "Test Corp",
        "--role", "Forward Deployed Engineer",
        "--jd-url", "https://example.com/jobs/1",
        "--jd-text", "FDE role. Python and TypeScript required.",
        "--resume-variant", "general-fde",
    ], env=env)
    job_id = add_result.stdout.strip().split("\n")[-1].strip()

    r = run_cli(["review", job_id, "approve"], env=env)
    assert r.returncode == 0, f"review approve failed: {r.stderr}"

    r = run_cli(["queue", "--status", "approved"], env=env)
    assert "Test Corp" in r.stdout, f"approved job not shown: {r.stdout}"


def test_submit_dry_run(tmpdir: Path) -> None:
    """Step 3: submit --dry-run marks job submitted without calling Playwright."""
    env = fresh_state(tmpdir)
    add_result = run_cli([
        "add",
        "--company", "DryRun Co",
        "--role", "Solutions Engineer",
        "--jd-url", "https://example.com/jobs/2",
        "--jd-text", "Sits with customers. Python + TypeScript. Remote.",
        "--resume-variant", "general-fde",
    ], env=env)
    job_id = add_result.stdout.strip().split("\n")[-1].strip()

    run_cli(["review", job_id, "approve"], env=env)

    r = run_cli(["submit", "--dry-run", job_id], env=env)
    assert r.returncode == 0, f"submit --dry-run failed: {r.stderr}"
    assert "would submit" in r.stdout.lower() or "submitted" in r.stdout.lower()

    state_file = tmpdir / "state.json"
    state = json.loads(state_file.read_text())
    assert any(j["id"] == job_id and j["status"] == "submitted" for j in state["jobs"]), \
        f"job {job_id} not marked submitted in {state}"


def test_state_json_schema(tmpdir: Path) -> None:
    """Step 4: state.json has the documented top-level shape."""
    env = fresh_state(tmpdir)
    run_cli([
        "add",
        "--company", "Schema Co",
        "--role", "FDE",
        "--jd-url", "https://example.com/jobs/3",
        "--jd-text", "FDE role.",
        "--resume-variant", "general-fde",
    ], env=env)
    state_file = tmpdir / "state.json"
    state = json.loads(state_file.read_text())
    assert "version" in state and state["version"] == 1
    assert "jobs" in state and isinstance(state["jobs"], list)
    j = state["jobs"][0]
    for key in ("id", "company", "role", "status", "form_fields", "created_at"):
        assert key in j, f"missing key {key} in job: {list(j.keys())}"


def main() -> int:
    """Run all 4 tests in sequence. Each in its own tmpdir for isolation."""
    failures = 0
    with tempfile.TemporaryDirectory() as tmp:
        tests = [test_add_then_queue, test_review_approve, test_submit_dry_run, test_state_json_schema]
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
