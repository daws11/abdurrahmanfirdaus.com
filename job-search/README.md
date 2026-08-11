# job-search

Local CLI for managing Forward Deploy Engineer job applications. Driven
from a Claude Code session — user approves each application via chat
before submit.

## Storage

- `state.json` — single source of truth, gitignored. Created on first `add`.
- `state.json.bak`, `state.json.bak.1`, `state.json.bak.2` — rolling backup chain, gitignored. Auto-rotated on every save; load falls back through the chain if `state.json` is corrupt.
- `state.lock` — exclusive `flock` for the read-modify-save critical section, gitignored. Prevents concurrent `add` from colliding on the same JOB-ID.
- `discovery.json` — results of `discover`. Separate from `state.json` so they don't pollute the apply pipeline. Gitignored. Each `discover` run overwrites it.
- `profile.json` — resume variants. Committed. Adding a new variant here automatically extends `--resume-variant` choices.
- `artifacts/` — pre-submit screenshots + accessibility snapshots from real submits and discovery runs. Gitignored.

Override `state.json` (and `artifacts/`) location via `JOB_SEARCH_STATE_DIR` env var
(used by tests + when relocating the tool).

## Submit flow

`submit` and `confirm` are two separate steps. Neither mutates state on the
other's behalf.

| Step | Command | What it does | State change |
|---|---|---|---|
| Preview | `submit --dry-run` | Prints what would happen | **none** |
| Open in browser | `submit` (default) | Opens JD URL in [agent-browser](https://github.com/vercel-labs/agent-browser), saves screenshot + a11y snapshot to `artifacts/<id>-*`, prints form_fields to fill | **none** |
| Mark submitted | `confirm <id>` | Sets `status=submitted`, stamps `submitted_at` + `submit_id` | draft/approved → submitted |

This split exists so the human (or Claude session) drives the form fill via
agent-browser (CLI, MCP, or `agent-browser chat`) while the Python tool
tracks state and persists pre-submission artifacts.

## Programmatic output (`--json`)

Add `--json` before the subcommand to get a single-line JSON payload on stdout
instead of the human-readable format. Designed for shell scripts and tests:

```bash
# Add a job and capture the id
JOB_ID=$(job-search --json add --company "Anthropic" --role "FDE" \
  --jd-url "https://anthropic.com/careers/123" --jd-text "<paste>" \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])")

# Machine-readable queue
job-search --json queue --status approved

# Dry-run that returns JSON instead of formatted text
job-search --json submit --dry-run
```

`--json` applies to every subcommand. Stderr still carries errors and warnings
in plain text either way.

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

# Submit — preview (read-only)
python3 job-search.py submit --dry-run
python3 job-search.py submit --dry-run JOB-2026-08-11-001

# Submit — open in agent-browser, save artifacts, print form_fields
# (requires `brew install agent-browser && agent-browser install`)
python3 job-search.py submit JOB-2026-08-11-001

# Mark as submitted (after actually filling the form via agent-browser)
python3 job-search.py confirm JOB-2026-08-11-001
python3 job-search.py confirm JOB-2026-08-11-001 --submit-id ATS-987654 --notes "conf email: Application Received"

# Delete a job (requires --force to actually mutate)
python3 job-search.py delete JOB-2026-08-11-001            # prints what would be deleted; returns 1
python3 job-search.py delete JOB-2026-08-11-001 --force   # actually removes from state.json

# Find FDE jobs (results go to discovery.json, NOT state.json)
python3 job-search.py --json discover --source greenhouse --board anthropic --limit 10
python3 job-search.py --json discover --source greenhouse --board stripe --keywords "forward deploy,solutions engineer"
python3 job-search.py --json discover --source linkedin --query "Forward Deployed Engineer" --location "Remote"
```

## Finding jobs

`discover` is the read-only counterpart to `add` — it fetches candidate jobs
and writes them to `discovery.json` for the calling Claude session (or you)
to triage. The tool does **not** rank or filter by fit; that's the LLM's job.

| Source | Mechanism | Auth | When to use |
|---|---|---|---|
| `greenhouse` | Public JSON API | none | Most tech companies (anthropic, stripe, ramp, brex, palantir, openai, scale, ...) |
| `linkedin` | agent-browser (best-effort) | none (may hit login wall) | Broad coverage across roles/companies not on Greenhouse |
| `file` | Local JSON fixture | n/a | Testing, offline, or curated lists you maintain |

```bash
# Find FDE-flavored roles at a Greenhouse-hosted company
python3 job-search.py --json discover --source greenhouse \
  --board anthropic --limit 10

# Same, but only with "forward deploy" or "solutions engineer" in the title
python3 job-search.py --json discover --source greenhouse \
  --board stripe --keywords "forward deploy,solutions engineer"

# LinkedIn (slower, may hit login wall, raw markdown is dumped for parsing)
python3 job-search.py --json discover --source linkedin \
  --query "Forward Deployed Engineer" --location "Remote"
```

Output is persisted to `discovery.json`. Each entry includes the full JD
text so the calling session can evaluate fit without re-fetching. For
Greenhouse sources, each JD page is also opened in agent-browser and a
screenshot saved to `artifacts/discovery-<board>-<id>.png` as visual
reference.

**This is the only step that uses agent-browser for *finding* jobs; the
rest of the flow uses it for *filling* application forms.**

## The `/fde-apply` slash command

A Claude Code slash command at `.claude/commands/fde-apply.md` orchestrates
the full loop:

1. **Discover** across default FDE boards (anthropic, palantir, openai,
   scale, ramp, brex, stripe) — or whatever the user specifies.
2. **Triage** by reading `discovery.json` + `profile.json` and scoring
   fit against the user's three resume variants.
3. **Present** the top 3–5 fits and ask which to apply to.
4. **Add** the chosen jobs via `add`, with the right resume variant.
5. **Drive** the existing review → submit → confirm flow.

Type `/fde-apply` in a Claude Code session to invoke. The slash command is a
markdown prompt for Claude to follow — the Python tool stays dumb, the
session does the judgment.

## Concurrency

All write operations (`add`, `review approve/reject`, `confirm`, `delete`)
hold an exclusive `flock` on `state.lock` for the duration of their
read-modify-save cycle. Two `add` calls in parallel cannot compute the same
`JOB-YYYY-MM-DD-NNN` sequence.

## Input validation

- `--company`, `--role`, `--jd-text` must be non-empty after trimming.
- `--jd-url` must parse as `http://` or `https://` with a non-empty host.
- `--resume-variant` must be a key declared in `profile.json`. Add a new
  variant there and it becomes available to the CLI on the next run.

## Tests

```bash
python3 test_smoke.py
```

Exercises the full lifecycle via `subprocess.run`. **14 tests**, including a
real agent-browser integration test (auto-skipped if the binary is not on PATH),
backup recovery, input validation, --json output, delete, dynamic variant
choices, and discover (file source + real Greenhouse API).

## Design

See `~/Documents/daws/daily-worker-hub-web/docs/superpowers/specs/2026-08-11-forward-deploy-job-search-automation-design.md`.
