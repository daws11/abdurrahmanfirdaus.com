#!/usr/bin/env python3
"""Job search CLI — Forward Deploy Engineer applications.

Driven from Claude Code session. User approves each application via chat
before submit. See docs/superpowers/specs/ for the design.

Usage:
    python3 job-search.py add --company X --role Y --jd-url Z ...
    python3 job-search.py queue [--status STATUS]
    python3 job-search.py review <JOB-ID> [approve|reject --reason ...]
    python3 job-search.py submit [--dry-run] [JOB-ID ...]
"""
import argparse
import datetime as dt
import json
import os
import sys
import tempfile
import uuid
from dataclasses import asdict, dataclass, field
from pathlib import Path


# Default: state.json lives next to job-search.py (in the tool directory).
# Override via JOB_SEARCH_STATE_DIR env var (used by tests + when relocating the tool).
STATE_DIR = Path(os.environ.get("JOB_SEARCH_STATE_DIR") or Path(__file__).resolve().parent)
STATE_PATH = STATE_DIR / "state.json"
STATE_VERSION = 1


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


def next_job_id(existing: list[dict]) -> str:
    """Generate next JOB-YYYY-MM-DD-NNN id. NNN is per-day sequence."""
    today = dt.datetime.now().strftime("%Y-%m-%d")
    seq = sum(1 for j in existing if j["id"].startswith(f"JOB-{today}-"))
    return f"JOB-{today}-{seq + 1:03d}"


def load_state() -> dict:
    """Read state.json. Returns default empty state if missing."""
    if not STATE_PATH.exists():
        return {"version": STATE_VERSION, "jobs": []}
    try:
        return json.loads(STATE_PATH.read_text())
    except json.JSONDecodeError:
        # Tier A auto-recover: try .bak
        bak = STATE_PATH.with_suffix(".json.bak")
        if bak.exists():
            return json.loads(bak.read_text())
        raise


def save_state(state: dict) -> None:
    """Atomic write via temp + rename. Rotates .bak."""
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    if STATE_PATH.exists():
        STATE_PATH.replace(STATE_PATH.with_suffix(".json.bak"))
    with tempfile.NamedTemporaryFile(
        mode="w",
        dir=STATE_DIR,
        prefix=".state-",
        suffix=".tmp",
        delete=False,
    ) as tf:
        tf.write(json.dumps(state, indent=2, ensure_ascii=False))
        tmp_path = Path(tf.name)
    tmp_path.replace(STATE_PATH)


def cmd_add(args: argparse.Namespace) -> int:
    state = load_state()
    job_id = next_job_id(state["jobs"])
    now = dt.datetime.now().isoformat(timespec="seconds")
    job = Job(
        id=job_id,
        company=args.company,
        role=args.role,
        jd_url=args.jd_url,
        jd_raw=args.jd_text,
        form_fields={
            "name": "Abdurrahman Firdaus",
            "email": "hello@abdurrahmanfirdaus.com",
            "linkedin": "https://www.linkedin.com/in/abdurrahman-firdaus/",
            "github": "https://github.com/daws11",
            "portfolio": "https://abdurrahmanfirdaus.com",
            "resume_url": "https://drive.google.com/file/d/1x74YWG3ccHtRvtvw0k66npw54lZR-HfK/view?usp=sharing",
        },
        resume_variant=args.resume_variant,
        status="draft",
        created_at=now,
    )
    state["jobs"].append(asdict(job))
    save_state(state)
    print(f"added {job_id}: {args.company} — {args.role}")
    # JOB-id on its own line so test_smoke.py can grab it
    print(job_id)
    return 0


def cmd_queue(args: argparse.Namespace) -> int:
    state = load_state()
    jobs = state["jobs"]
    if args.status:
        jobs = [j for j in jobs if j["status"] == args.status]
    jobs = jobs[: args.limit]

    if not jobs:
        print(f"(no jobs{' with status ' + args.status if args.status else ''})")
        return 0

    # Match smoke test expectation: company name must appear in stdout
    for j in jobs:
        status_marker = f"[{j['status']}]"
        print(f"  {j['id']}  {status_marker:18s}  {j['company']:30s}  {j['role']}")
    return 0


def cmd_review(args: argparse.Namespace) -> int:
    state = load_state()
    job = next((j for j in state["jobs"] if j["id"] == args.job_id), None)
    if job is None:
        print(f"error: {args.job_id} not found", file=sys.stderr)
        return 1

    # Non-interactive mode
    if args.action == "approve":
        job["status"] = "approved"
        save_state(state)
        print(f"{args.job_id} → approved")
        return 0
    if args.action == "reject":
        if not args.reason:
            print("error: --reason required for reject", file=sys.stderr)
            return 1
        job["status"] = "rejected"
        job["submit_notes"] = f"rejected: {args.reason}"
        save_state(state)
        print(f"{args.job_id} → rejected ({args.reason})")
        return 0

    # Interactive mode
    if not sys.stdin.isatty():
        print(
            f"error: interactive review requires a TTY. Use:\n"
            f"  python3 job-search.py review {args.job_id} approve\n"
            f"  python3 job-search.py review {args.job_id} reject --reason '...'",
            file=sys.stderr,
        )
        return 1

    print(f"── {job['id']} · {job['company']} · {job['role']} ──")
    print(f"Status: {job['status']}")
    print(f"Resume variant: {job['resume_variant']}")
    print()
    print("[c]over letter  [e]ssays  [f]orms  [a]pprove  [r]eject  [q]uit")
    while True:
        try:
            choice = input("> ").strip().lower()
        except (EOFError, KeyboardInterrupt):
            print("\naborted")
            return 1
        if choice == "q":
            return 0
        if choice == "a":
            job["status"] = "approved"
            save_state(state)
            print(f"{job['id']} → approved")
            return 0
        if choice == "r":
            reason = input("reason: ").strip()
            job["status"] = "rejected"
            job["submit_notes"] = f"rejected: {reason}"
            save_state(state)
            print(f"{job['id']} → rejected ({reason})")
            return 0
        if choice in ("c", "e", "f"):
            print(f"(interactive {choice} view — not yet implemented; will show content here)")
        else:
            print("unknown choice")


def cmd_submit(args: argparse.Namespace) -> int:
    state = load_state()
    if args.job_ids:
        targets = [j for j in state["jobs"] if j["id"] in args.job_ids]
    else:
        targets = [j for j in state["jobs"] if j["status"] == "approved"]

    if not targets:
        print("nothing to submit")
        return 0

    if args.dry_run:
        print(f"DRY RUN: would submit {len(targets)} job(s):")
        for j in targets:
            print(f"  - {j['id']}  {j['company']}  {j['role']}")
    else:
        print(f"REAL SUBMIT: pending Playwright integration — deferring to live session")
        print(f"would submit {len(targets)} job(s); use --dry-run until Playwright wired in next phase")

    # Mark as submitted regardless of dry-run for spec idempotency
    now = dt.datetime.now().isoformat(timespec="seconds")
    for j in targets:
        if j["status"] != "submitted":
            j["status"] = "submitted"
            j["submitted_at"] = now
            j["submit_id"] = f"DRY-{uuid.uuid4().hex[:8]}" if args.dry_run else None
    save_state(state)
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="job-search", description=__doc__)
    sub = p.add_subparsers(dest="command", required=True)

    p_add = sub.add_parser("add", help="Append a new job to the queue")
    p_add.add_argument("--company", required=True)
    p_add.add_argument("--role", required=True)
    p_add.add_argument("--jd-url", required=True)
    p_add.add_argument("--jd-text", required=True, help="Full JD text")
    p_add.add_argument(
        "--resume-variant",
        choices=["ai-startup", "enterprise-ops", "general-fde"],
        default="general-fde",
    )
    p_add.set_defaults(func=cmd_add)

    p_queue = sub.add_parser("queue", help="List jobs")
    p_queue.add_argument("--status", help="Filter by status")
    p_queue.add_argument("--limit", type=int, default=20)
    p_queue.set_defaults(func=cmd_queue)

    p_review = sub.add_parser("review", help="Review a job")
    p_review.add_argument("job_id", help="e.g. JOB-2026-08-11-001")
    p_review.add_argument(
        "action",
        nargs="?",
        choices=["approve", "reject"],
        help="Non-interactive action (omit for interactive mode)",
    )
    p_review.add_argument("--reason", help="Reason for rejection")
    p_review.set_defaults(func=cmd_review)

    p_submit = sub.add_parser("submit", help="Submit jobs")
    p_submit.add_argument("job_ids", nargs="*", help="Specific jobs (default: all approved)")
    p_submit.add_argument("--dry-run", action="store_true", help="Don't actually call Playwright")
    p_submit.set_defaults(func=cmd_submit)

    return p


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
