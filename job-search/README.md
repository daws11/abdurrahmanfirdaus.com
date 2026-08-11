# job-search

Local CLI for managing Forward Deploy Engineer job applications. Driven
from a Claude Code session — user approves each application via chat
before submit.

## Storage

- `state.json` — single source of truth, gitignored. Created on first `add`.
- `profile.json` — 3 resume variants. Committed.
- `artifacts/` — pre-submit screenshots from real (non-dry-run) submits. Gitignored.

Override `state.json` location via `JOB_SEARCH_STATE_DIR` env var (used by tests).

## Usage

```bash
# Add a job
python3 job-search.py add --company "Anthropic" --role "FDE" \
  --jd-url "https://anthropic.com/careers/123" \
  --jd-text "<paste full JD here>" \
  --resume-variant ai-startup

# List jobs by status
python3 job-search.py queue --status draft
python3 job-search.py queue --status approved

# Approve / reject a job (non-interactive)
python3 job-search.py review JOB-2026-08-11-001 approve
python3 job-search.py review JOB-2026-08-11-002 reject --reason "title mismatch"

# Submit (dry-run is the only safe option for now)
python3 job-search.py submit --dry-run
python3 job-search.py submit --dry-run JOB-2026-08-11-001
```

## Tests

```bash
python3 test_smoke.py
```

Exercises the full lifecycle via `subprocess.run`. No Playwright mocks —
real `--dry-run` path.

## Design

See `~/Documents/daws/daily-worker-hub-web/docs/superpowers/specs/2026-08-11-forward-deploy-job-search-automation-design.md`.
