#!/usr/bin/env python3
"""Job search CLI — Forward Deploy Engineer applications.

Driven from Claude Code session. User approves each application via chat
before submit. See docs/superpowers/specs/ for the design.

Usage:
    python3 job-search.py [--json] add --company X --role Y --jd-url Z ...
    python3 job-search.py [--json] queue [--status STATUS]
    python3 job-search.py [--json] review <JOB-ID> [approve|reject --reason ...]
    python3 job-search.py [--json] submit [--dry-run] [JOB-ID ...]
    python3 job-search.py [--json] confirm <JOB-ID> [--submit-id ...] [--notes ...]
    python3 job-search.py [--json] delete <JOB-ID> [--force]
    python3 job-search.py [--json] discover [--source SOURCE] [--board BOARD | --query Q]
"""
import argparse
import contextlib
import datetime as dt
import fcntl
import json
import os
import shutil
import ssl
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
import uuid
from dataclasses import asdict, dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterator


# -- Paths and config ---------------------------------------------------------
# Default: state.json + artifacts/ live next to job-search.py (in the tool dir).
# Override via JOB_SEARCH_STATE_DIR env var (used by tests + when relocating).
STATE_DIR = Path(os.environ.get("JOB_SEARCH_STATE_DIR") or Path(__file__).resolve().parent)
STATE_PATH = STATE_DIR / "state.json"
STATE_VERSION = 1
ARTIFACTS_DIR = STATE_DIR / "artifacts"
# Lock file used for exclusive flock around read-modify-save critical sections.
LOCK_PATH = STATE_DIR / "state.lock"
# Discovery results (separate from state.json so they don't pollute the apply pipeline).
DISCOVERY_PATH = STATE_DIR / "discovery.json"
DISCOVERY_VERSION = 1
# Rolling backup chain (newest first). On save: shift forward + drop oldest.
BACKUP_SUFFIXES = [".json.bak", ".json.bak.1", ".json.bak.2"]
# profile.json ships in the tool dir (committed) and lists resume variants.
PROFILE_PATH = Path(__file__).resolve().parent / "profile.json"
# agent-browser CLI calls have a 25s default; we wrap them in 30s for headroom.
AB_TIMEOUT = 30
# Default resume form fields applied to every new job.
DEFAULT_FORM_FIELDS = {
    "name": "Abdurrahman Firdaus",
    "email": "hello@abdurrahmanfirdaus.com",
    "phone": "+6285603520775",
    "linkedin": "https://www.linkedin.com/in/abdurrahman-firdaus/",
    "github": "https://github.com/daws11",
    "portfolio": "https://abdurrahmanfirdaus.com",
    "resume_url": "https://www.abdurrahmanfirdaus.com/CV.pdf",
}


# -- Helpers ------------------------------------------------------------------

def _now() -> dt.datetime:
    """Local time, tz-aware. Used for IDs and ISO timestamps."""
    return dt.datetime.now().astimezone()


def _now_iso() -> str:
    return _now().isoformat(timespec="seconds")


def _arg_non_empty(flag: str):
    """argparse type: strip and require non-empty."""
    def validator(value: str) -> str:
        s = (value or "").strip()
        if not s:
            raise argparse.ArgumentTypeError(f"{flag} must not be empty")
        return s
    return validator


def _arg_url(value: str) -> str:
    """argparse type: must be http(s):// with a non-empty host."""
    s = _arg_non_empty("--jd-url")(value)
    parsed = urllib.parse.urlparse(s)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise argparse.ArgumentTypeError(
            f"invalid --jd-url: {s!r} (need http:// or https:// with a host)"
        )
    return s


def load_profile() -> dict:
    """Read profile.json; return empty shell on missing or corrupt."""
    if PROFILE_PATH.exists():
        try:
            return json.loads(PROFILE_PATH.read_text())
        except json.JSONDecodeError:
            pass
    return {"variants": {}}


def _profile_variants() -> list[str]:
    """Names of resume variants declared in profile.json, or a single default."""
    variants = list((load_profile().get("variants") or {}).keys())
    return variants or ["general-fde"]


@contextlib.contextmanager
def _state_lock() -> Iterator[None]:
    """Exclusive flock on LOCK_PATH for the duration of the critical section.

    Prevents concurrent `add` from computing the same JOB-ID (issue 6.1).
    """
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    fd = os.open(LOCK_PATH, os.O_CREAT | os.O_RDWR, 0o644)
    try:
        fcntl.flock(fd, fcntl.LOCK_EX)
        yield
    finally:
        try:
            fcntl.flock(fd, fcntl.LOCK_UN)
        finally:
            os.close(fd)


def _emit(args: argparse.Namespace, text: str | None = None, payload: dict | None = None) -> None:
    """Print either human text or a single-line JSON payload based on --json."""
    if getattr(args, "json", False):
        print(json.dumps(payload or {}, ensure_ascii=False))
    elif text is not None:
        print(text)


def _backup_paths() -> list[Path]:
    """Backup chain ordered newest-first (index 0 = .bak, index -1 = oldest)."""
    return [STATE_PATH.with_suffix(s) for s in BACKUP_SUFFIXES]


def _rotate_backups() -> None:
    """Shift the backup chain forward by one slot, drop the oldest."""
    paths = _backup_paths()
    for i in range(len(paths) - 1, 0, -1):
        if paths[i].exists():
            paths[i].unlink()
        if paths[i - 1].exists():
            paths[i - 1].replace(paths[i])


# -- Job dataclass ------------------------------------------------------------

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
    today = _now().strftime("%Y-%m-%d")
    seq = sum(1 for j in existing if j["id"].startswith(f"JOB-{today}-"))
    return f"JOB-{today}-{seq + 1:03d}"


# -- State I/O ----------------------------------------------------------------

def load_state() -> dict:
    """Read state.json. Falls back through the backup chain on parse error.

    Returns the default empty state if every candidate is missing or corrupt.
    """
    candidates = [STATE_PATH] + _backup_paths()
    for path in candidates:
        if not path.exists():
            continue
        try:
            return json.loads(path.read_text())
        except json.JSONDecodeError:
            continue
    return {"version": STATE_VERSION, "jobs": []}


def save_state(state: dict) -> None:
    """Atomic write via temp + rename. Rotates the backup chain (issue 6.2)."""
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    if STATE_PATH.exists():
        _rotate_backups()
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


# -- Discovery (find jobs) ----------------------------------------------------
# ponytail: discovery is fetch-and-persist only. Triage and ranking is the
# Claude session's job — it reads discovery.json, applies profile.json, and
# picks the ones worth adding. Keeps the tool dumb and the LLM in charge of
# judgment calls.

def strip_html(html: str) -> str:
    """Strip HTML tags and collapse whitespace. Returns plain text."""
    class _TextExtractor(HTMLParser):
        def __init__(self) -> None:
            super().__init__()
            self.parts: list[str] = []

        def handle_data(self, data: str) -> None:
            self.parts.append(data)

    p = _TextExtractor()
    p.feed(html or "")
    return " ".join("".join(p.parts).split())


def _ssl_context() -> ssl.SSLContext | None:
    """Build an SSL context, falling back to the system CA bundle if Python's
    default is empty (common with pyenv / homebrew Python on macOS)."""
    ctx = ssl.create_default_context()
    if ctx.get_ca_certs():
        return ctx
    for path in ("/etc/ssl/cert.pem", "/opt/homebrew/etc/openssl@3/cert.pem"):
        if os.path.exists(path):
            return ssl.create_default_context(cafile=path)
    return ctx  # use whatever Python has, even if empty


def fetch_greenhouse_jobs(board: str, keywords: list[str], limit: int) -> list[dict]:
    """Pull jobs from Greenhouse's public JSON API. No auth.

    https://developers.greenhouse.io/job-board.html
    """
    url = f"https://boards-api.greenhouse.io/v1/boards/{board}/jobs?content=true"
    req = urllib.request.Request(url, headers={"User-Agent": "job-search/1.0"})
    with urllib.request.urlopen(req, timeout=20, context=_ssl_context()) as r:
        data = json.loads(r.read().decode("utf-8"))
    out: list[dict] = []
    for j in data.get("jobs") or []:
        title = j.get("title") or ""
        if keywords and not any(kw.lower() in title.lower() for kw in keywords):
            continue
        out.append({
            "title": title,
            "company": board,
            "location": (j.get("location") or {}).get("name") or "",
            "url": j.get("absolute_url") or "",
            "jd_text": strip_html(j.get("content") or ""),
            "source": "greenhouse",
            "board": board,
            "gh_id": j.get("id"),
            "updated_at": j.get("updated_at"),
        })
        if len(out) >= limit:
            break
    return out


def fetch_linkedin_search(query: str, location: str) -> dict:
    """Open LinkedIn Jobs search via agent-browser; return raw markdown dump.

    LinkedIn's results page is JS-heavy; we let agent-browser render it then
    dump as markdown. Parsing is left to the calling Claude session — the
    markdown may have noise and changes often.
    """
    params = urllib.parse.urlencode({"keywords": query, "location": location or ""})
    url = f"https://www.linkedin.com/jobs/search/?{params}"
    title = agent_browser_open(url)
    md = agent_browser_read(url)
    return {"title": title, "raw": md, "url": url}


def save_discovery(entries: list[dict]) -> Path:
    """Persist discovery results. Atomic write via temp + rename."""
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    payload = {
        "version": DISCOVERY_VERSION,
        "discovered_at": _now_iso(),
        "jobs": entries,
    }
    with tempfile.NamedTemporaryFile(
        mode="w",
        dir=STATE_DIR,
        prefix=".discovery-",
        suffix=".tmp",
        delete=False,
    ) as tf:
        json.dump(payload, tf, ensure_ascii=False, indent=2)
        tmp_path = Path(tf.name)
    tmp_path.replace(DISCOVERY_PATH)
    return DISCOVERY_PATH


def load_discovery() -> dict:
    if not DISCOVERY_PATH.exists():
        return {"version": DISCOVERY_VERSION, "discovered_at": None, "jobs": []}
    try:
        return json.loads(DISCOVERY_PATH.read_text())
    except json.JSONDecodeError:
        return {"version": DISCOVERY_VERSION, "discovered_at": None, "jobs": []}


# -- agent-browser wrapper ----------------------------------------------------
# ponytail: thin subprocess shim. The browser session is owned by agent-browser's
# Rust daemon, not us. We just dispatch commands. If a richer integration is
# needed (state, refs across calls, MCP), add a dedicated module.

def agent_browser_available() -> bool:
    return shutil.which("agent-browser") is not None


def _ab(*args: str, timeout: int = AB_TIMEOUT) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["agent-browser", *args],
        capture_output=True,
        text=True,
        timeout=timeout,
    )


def agent_browser_open(url: str) -> str:
    r = _ab("open", url)
    if r.returncode != 0:
        raise RuntimeError(f"agent-browser open failed (rc={r.returncode}): {r.stderr.strip()}")
    return r.stdout.strip()


def agent_browser_snapshot() -> str:
    r = _ab("snapshot")
    if r.returncode != 0:
        raise RuntimeError(f"agent-browser snapshot failed (rc={r.returncode}): {r.stderr.strip()}")
    return r.stdout


def agent_browser_screenshot(path: Path) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    r = _ab("screenshot", str(path))
    if r.returncode != 0:
        raise RuntimeError(f"agent-browser screenshot failed (rc={r.returncode}): {r.stderr.strip()}")
    return path


def agent_browser_read(url: str) -> str:
    """Fetch URL and return the rendered page as markdown (via `read`)."""
    r = _ab("read", url)
    if r.returncode != 0:
        raise RuntimeError(f"agent-browser read failed (rc={r.returncode}): {r.stderr.strip()}")
    return r.stdout


# -- Commands -----------------------------------------------------------------

def cmd_add(args: argparse.Namespace) -> int:
    with _state_lock():
        state = load_state()
        job_id = next_job_id(state["jobs"])
        job = Job(
            id=job_id,
            company=args.company,
            role=args.role,
            jd_url=args.jd_url,
            jd_raw=args.jd_text,
            form_fields=dict(DEFAULT_FORM_FIELDS),
            resume_variant=args.resume_variant,
            status="draft",
            created_at=_now_iso(),
        )
        state["jobs"].append(asdict(job))
        save_state(state)

    payload = {
        "id": job_id,
        "company": args.company,
        "role": args.role,
        "status": "draft",
        "resume_variant": args.resume_variant,
    }
    if args.json:
        _emit(args, payload=payload)
    else:
        print(f"added {job_id}: {args.company} — {args.role}")
        print(job_id)
    return 0


def cmd_queue(args: argparse.Namespace) -> int:
    state = load_state()
    jobs = state["jobs"]
    if args.status:
        jobs = [j for j in jobs if j["status"] == args.status]
    jobs = jobs[: args.limit]

    if args.json:
        _emit(args, payload={"count": len(jobs), "jobs": jobs})
        return 0

    if not jobs:
        print(f"(no jobs{' with status ' + args.status if args.status else ''})")
        return 0
    for j in jobs:
        status_marker = f"[{j['status']}]"
        print(f"  {j['id']}  {status_marker:18s}  {j['company']:30s}  {j['role']}")
    return 0


def cmd_review(args: argparse.Namespace) -> int:
    if args.action:
        # Non-interactive: short critical section, hold lock through save.
        with _state_lock():
            state = load_state()
            job = next((j for j in state["jobs"] if j["id"] == args.job_id), None)
            if job is None:
                _emit(args, text=f"error: {args.job_id} not found",
                      payload={"error": "not_found", "job_id": args.job_id})
                return 1 if not args.json else 1

            if args.action == "approve":
                job["status"] = "approved"
                save_state(state)
                _emit(args, text=f"{args.job_id} → approved",
                      payload={"id": args.job_id, "status": "approved"})
                return 0

            if args.action == "reject":
                if not args.reason:
                    _emit(args, text="error: --reason required for reject",
                          payload={"error": "reason_required"})
                    return 1
                job["status"] = "rejected"
                job["submit_notes"] = f"rejected: {args.reason}"
                save_state(state)
                _emit(args, text=f"{args.job_id} → rejected ({args.reason})",
                      payload={"id": args.job_id, "status": "rejected", "reason": args.reason})
                return 0

    # Interactive mode: hold lock for the whole session (no other writer expected).
    with _state_lock():
        state = load_state()
        job = next((j for j in state["jobs"] if j["id"] == args.job_id), None)
        if job is None:
            print(f"error: {args.job_id} not found", file=sys.stderr)
            return 1
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
            if choice == "c":
                cl = job.get("cover_letter") or ""
                print(cl if cl else "(no cover letter yet)")
            elif choice == "e":
                ea = job.get("essay_answers") or {}
                if ea:
                    for k, v in ea.items():
                        print(f"  {k}: {v}")
                else:
                    print("(no essay answers yet)")
            elif choice == "f":
                ff = job.get("form_fields") or {}
                if ff:
                    for k, v in ff.items():
                        print(f"  {k}: {v}")
                else:
                    print("(no form fields yet)")
            else:
                print("unknown choice")


def cmd_submit(args: argparse.Namespace) -> int:
    """Submit (or preview) approved jobs.

    Two modes:
      --dry-run: read-only preview. Prints what would happen. NEVER mutates state.
      default:   opens each job's JD URL in agent-browser, saves a pre-fill
                 screenshot + accessibility snapshot to ARTIFACTS_DIR, prints
                 the form_fields to fill. NEVER mutates state. Use `confirm`
                 after the actual submission to mark a job as submitted.
    """
    state = load_state()
    if args.job_ids:
        targets = [j for j in state["jobs"] if j["id"] in args.job_ids]
    else:
        targets = [j for j in state["jobs"] if j["status"] == "approved"]

    if not targets:
        _emit(args, text="nothing to submit", payload={"count": 0, "opened": []})
        return 0

    if args.dry_run:
        payload = {"dry_run": True, "would_submit": [
            {"id": j["id"], "company": j["company"], "role": j["role"]} for j in targets
        ]}
        if args.json:
            _emit(args, payload=payload)
        else:
            print(f"DRY RUN: would submit {len(targets)} job(s):")
            for j in targets:
                print(f"  - {j['id']}  {j['company']}  {j['role']}")
            print("(dry-run does not mutate state; run `confirm <id>` after actual submission)")
        return 0

    if not agent_browser_available():
        msg = ("error: agent-browser not found in PATH. "
               "Install via `brew install agent-browser` or `npm i -g agent-browser`, "
               "then run `agent-browser install` to download Chrome.")
        _emit(args, text=msg, payload={"error": "agent_browser_missing"})
        return 1

    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    opened: list[dict] = []
    errors: list[dict] = []
    for j in targets:
        if j["status"] != "approved":
            errors.append({"id": j["id"], "reason": f"status is {j['status']}, not approved"})
            continue
        url = j.get("jd_url") or ""
        if not url:
            errors.append({"id": j["id"], "reason": "no jd_url"})
            continue
        try:
            title = agent_browser_open(url)
            snap = agent_browser_snapshot()
            shot = ARTIFACTS_DIR / f"{j['id']}-prefill.png"
            agent_browser_screenshot(shot)
            (ARTIFACTS_DIR / f"{j['id']}-snapshot.txt").write_text(snap)
        except Exception as e:
            errors.append({"id": j["id"], "reason": str(e)})
            continue
        opened.append({
            "id": j["id"],
            "company": j["company"],
            "title": title,
            "screenshot": str(shot),
            "snapshot": str(ARTIFACTS_DIR / f"{j['id']}-snapshot.txt"),
            "form_fields": j.get("form_fields") or {},
        })

    payload = {
        "opened_count": len(opened),
        "error_count": len(errors),
        "opened": opened,
        "errors": errors,
    }
    if args.json:
        _emit(args, payload=payload)
    else:
        for o in opened:
            print(f"  READY  {o['id']}  {o['company']}  →  {o['screenshot']}")
            print(f"    title: {o['title']}")
            print(f"    snapshot: {o['snapshot']}")
            print(f"    form_fields to fill:")
            for k, v in o["form_fields"].items():
                print(f"      {k}: {v}")
        for e in errors:
            print(f"  skip {e['id']}: {e['reason']}", file=sys.stderr)
        print(f"\nopened {len(opened)}/{len(targets)} job(s) in browser")
        print("next: fill forms via agent-browser (MCP) or `agent-browser chat`, "
              "then run `confirm <id>` to mark submitted")
    return 0


def cmd_confirm(args: argparse.Namespace) -> int:
    """Mark an approved job as submitted. Use after `submit` + actual form fill."""
    with _state_lock():
        state = load_state()
        job = next((j for j in state["jobs"] if j["id"] == args.job_id), None)
        if job is None:
            _emit(args, text=f"error: {args.job_id} not found",
                  payload={"error": "not_found", "job_id": args.job_id})
            return 1
        if job["status"] != "approved":
            _emit(args,
                  text=f"error: {args.job_id} is {job['status']}, not approved. Only approved jobs can be confirmed.",
                  payload={"error": "not_approved", "job_id": args.job_id, "status": job["status"]})
            return 1
        job["status"] = "submitted"
        job["submitted_at"] = _now_iso()
        if args.submit_id:
            job["submit_id"] = args.submit_id
        elif not job.get("submit_id"):
            job["submit_id"] = f"CONFIRMED-{uuid.uuid4().hex[:8]}"
        if args.notes:
            job["submit_notes"] = args.notes
        save_state(state)
        _emit(args,
              text=f"{args.job_id} → submitted ({job['submit_id']})",
              payload={"id": args.job_id, "status": "submitted", "submit_id": job["submit_id"]})
        return 0


def cmd_delete(args: argparse.Namespace) -> int:
    """Remove a job from the state. Requires --force to actually mutate."""
    with _state_lock():
        state = load_state()
        job = next((j for j in state["jobs"] if j["id"] == args.job_id), None)
        if job is None:
            _emit(args, text=f"error: {args.job_id} not found",
                  payload={"error": "not_found", "job_id": args.job_id})
            return 1
        if not args.force:
            _emit(args,
                  text=(f"about to delete {args.job_id} ({job['company']} — {job['role']}, "
                        f"status: {job['status']}). Pass --force to confirm."),
                  payload={"error": "force_required", "job_id": args.job_id,
                           "company": job["company"], "role": job["role"],
                           "status": job["status"]})
            return 1
        before = len(state["jobs"])
        state["jobs"] = [j for j in state["jobs"] if j["id"] != args.job_id]
        save_state(state)
        _emit(args,
              text=f"{args.job_id} deleted ({before} → {len(state['jobs'])} jobs)",
              payload={"id": args.job_id, "deleted": True,
                       "remaining": len(state["jobs"])})
        return 0


def cmd_discover(args: argparse.Namespace) -> int:
    """Find candidate FDE jobs and persist them to discovery.json.

    The tool does the fetching; the calling Claude session (or user) does the
    triage by reading discovery.json, comparing against profile.json, and
    running `add` for the ones worth applying to.

    Sources:
      greenhouse: public JSON API. Fast, no auth. Use --board.
      linkedin:   agent-browser. Best-effort. Use --query + --location.
      file:       read pre-formatted entries from a local JSON file. Use --file.
    """
    keywords = [k.strip() for k in (args.keywords or "").split(",") if k.strip()]
    if not keywords:
        keywords = ["forward deploy", "forward deployed", "solutions engineer", "customer engineer", "tech lead", "fullstack"]

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
        # Use agent-browser to screenshot each JD page (proves the link is live
        # and gives a visual reference for the LLM session triaging results).
        if agent_browser_available() and entries:
            ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
            for j in entries:
                if not j.get("url"):
                    continue
                try:
                    agent_browser_open(j["url"])
                    shot_name = f"discovery-{j['board']}-{j.get('gh_id', len(entries))}.png"
                    shot = ARTIFACTS_DIR / shot_name
                    agent_browser_screenshot(shot)
                    j["screenshot"] = str(shot)
                except Exception as e:
                    j["screenshot_error"] = str(e)
        for i, j in enumerate(entries, 1):
            j["id"] = f"DISC-{i:03d}"

    elif args.source == "linkedin":
        if not agent_browser_available():
            _emit(args, text="error: agent-browser not on PATH (required for --source linkedin)",
                  payload={"error": "agent_browser_missing"})
            return 1
        try:
            result = fetch_linkedin_search(
                args.query or "Forward Deployed Engineer",
                args.location or "",
            )
        except Exception as e:
            _emit(args, text=f"error: linkedin fetch failed: {e}",
                  payload={"error": "linkedin_fetch_failed", "detail": str(e)})
            return 1
        entries = [{
            "id": "DISC-LINKEDIN-001",
            "source": "linkedin",
            "title": result["title"] or f"LinkedIn search: {args.query}",
            "company": "(see jd_text — Claude parses the raw markdown)",
            "location": args.location or "",
            "url": result["url"],
            "jd_text": result["raw"],
        }]

    elif args.source == "file":
        if not args.file:
            _emit(args, text="error: --file required for --source file",
                  payload={"error": "file_required"})
            return 1
        try:
            raw = json.loads(Path(args.file).read_text())
        except Exception as e:
            _emit(args, text=f"error: could not read file: {e}",
                  payload={"error": "file_read_failed", "detail": str(e)})
            return 1
        if not isinstance(raw, list):
            _emit(args, text="error: file must contain a JSON array of job entries",
                  payload={"error": "file_format_invalid"})
            return 1
        entries = raw
        for i, j in enumerate(entries, 1):
            j.setdefault("id", f"DISC-{i:03d}")
            j.setdefault("source", "file")

    if not entries:
        _emit(args, text=f"(no jobs matched keywords={keywords!r})",
              payload={"count": 0, "jobs": [], "source": args.source})
        return 0

    save_discovery(entries)

    if args.json:
        _emit(args, payload={"count": len(entries), "source": args.source, "jobs": entries})
    else:
        print(f"discovered {len(entries)} job(s) from {args.source} (keywords={keywords}):")
        for j in entries:
            print(f"  {j.get('id', '?'):18s}  {j.get('company', '?'):24s}  {j.get('title', '?')[:60]}")
            if j.get("location"):
                print(f"    location: {j['location']}")
        print(f"\nsaved to {DISCOVERY_PATH}")
        print("next: review the file, then run `add` for the ones you want to apply to")
    return 0


# -- Parser -------------------------------------------------------------------

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="job-search", description=__doc__)
    p.add_argument("--json", action="store_true",
                   help="Output JSON to stdout for programmatic consumption")
    sub = p.add_subparsers(dest="command", required=True)

    p_add = sub.add_parser("add", help="Append a new job to the queue")
    p_add.add_argument("--company", required=True, type=_arg_non_empty("--company"))
    p_add.add_argument("--role", required=True, type=_arg_non_empty("--role"))
    p_add.add_argument("--jd-url", required=True, type=_arg_url)
    p_add.add_argument("--jd-text", required=True, type=_arg_non_empty("--jd-text"),
                       help="Full JD text")
    p_add.add_argument(
        "--resume-variant",
        choices=_profile_variants(),
        default=_profile_variants()[0],
        help="Resume variant (choices come from profile.json)",
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
    p_submit.add_argument("--dry-run", action="store_true",
                          help="Preview only; never mutates state")
    p_submit.set_defaults(func=cmd_submit)

    p_confirm = sub.add_parser("confirm", help="Mark an approved job as submitted")
    p_confirm.add_argument("job_id", help="e.g. JOB-2026-08-11-001")
    p_confirm.add_argument("--submit-id", help="External ID from the ATS confirmation page")
    p_confirm.add_argument("--notes", help="Free-form notes (e.g. confirmation email subject)")
    p_confirm.set_defaults(func=cmd_confirm)

    p_delete = sub.add_parser("delete", help="Delete a job (requires --force)")
    p_delete.add_argument("job_id", help="e.g. JOB-2026-08-11-001")
    p_delete.add_argument("--force", action="store_true", help="Actually delete (no dry-run)")
    p_delete.set_defaults(func=cmd_delete)

    p_discover = sub.add_parser("discover", help="Find FDE jobs and save to discovery.json")
    p_discover.add_argument(
        "--source", choices=["greenhouse", "linkedin", "file"], default="greenhouse",
        help="Where to search (default: greenhouse)",
    )
    p_discover.add_argument("--board", help="Greenhouse board slug (e.g. anthropic, palantir)")
    p_discover.add_argument("--query", help="LinkedIn search query (e.g. 'Forward Deployed Engineer')")
    p_discover.add_argument("--location", help="LinkedIn location filter (e.g. 'Remote', 'San Francisco')")
    p_discover.add_argument(
        "--keywords", default="",
        help="Comma-separated title keywords to filter (default: forward deploy, solutions engineer, ...)",
    )
    p_discover.add_argument("--limit", type=int, default=10, help="Max jobs to return (default 10)")
    p_discover.add_argument("--file", help="For --source file: path to a JSON array of job entries")
    p_discover.set_defaults(func=cmd_discover)

    return p


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
