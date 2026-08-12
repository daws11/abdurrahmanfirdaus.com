---
description: Find Forward Deployed Engineer jobs that match the user's profile, present the best fits, and drive the apply pipeline (add → review → submit → confirm).
---

# /fde-apply — Find and apply to FDE jobs

You are the orchestrator for the `job-search/` tool. The tool handles state
management and form fill via agent-browser; **you** make the judgment calls
about which jobs to apply to and walk the user through each step.

## Step 1 — Ask for scope

Ask the user (in chat) which boards to scan and any constraints:

- **Default boards** (FDE-heavy): `anthropic`, `palantir`, `openai`, `scale`, `ramp`, `brex`, `stripe`
- The user can override: "just ramp" or "all the defaults plus cloudflare"

If the user gave no instructions, use the default list and proceed.

## Step 2 — Discover

Run discover for each requested board. Each call writes to
`job-search/discovery.json` (the latest run wins).

```bash
python3 job-search/job-search.py --json discover \
  --source greenhouse --board <slug> --limit 10
```

For broader coverage (slower, flakier), also try:

```bash
python3 job-search/job-search.py --json discover \
  --source linkedin --query "Forward Deployed Engineer" --location "Remote"
```

## Step 3 — Triage

Read `job-search/discovery.json`. For each entry:

1. Read the `jd_text` (the full JD)
2. Read `job-search/profile.json` to know the user's three resume variants:
   - `ai-startup` — AI-native companies (Anthropic, OpenAI, Scale)
   - `enterprise-ops` — ops-heavy businesses (Palantir, Anduril)
   - `general-fde` — generic FDE / customer-facing engineer roles
3. Decide a fit score: **strong** / **maybe** / **skip**
4. Pick the best resume variant

## Step 4 — Present

Show the user a short table with the **top 3–5 strong fits**. For each:
title, company, location, suggested variant, and a one-line "why" tied to
the user's actual project history (e.g. "Matches Channelflow's AI-agent-
into-customer-flow pattern").

Then ask: **"Add these to the apply queue? (y / n / list specific #s)"**

Wait for the user's response. Do not proceed without confirmation.

## Step 5 — Add (only after user confirms)

For each approved job:

```bash
python3 job-search/job-search.py --json add \
  --company "<from discovery>" \
  --role "<title>" \
  --jd-url "<url>" \
  --jd-text "<jd_text from discovery>" \
  --resume-variant "<chosen variant>"
```

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

For each queued job, present a short summary and ask the user to approve
or reject (with a reason for rejection):

- "JOB-2026-08-11-001: Forward Deployed Engineer @ Anthropic, San Francisco.
  Why: AI-agent customer deployment matches Channelflow. Variant: ai-startup.
  Approve? (y / reject with reason)"

On approval:

```bash
python3 job-search/job-search.py --json review <JOB-ID> approve
```

On rejection:

```bash
python3 job-search/job-search.py --json review <JOB-ID> reject --reason "<reason>"
```

## Step 7 — Submit (open in agent-browser)

For each approved job:

```bash
python3 job-search/job-search.py --json submit <JOB-ID>
```

The tool opens the JD URL in agent-browser, takes a screenshot, and saves
the form fields to `artifacts/<JOB-ID>-*`. Tell the user:

> "Drafts saved. Open the form at <jd-url>, paste the drafts into the matching
>  fields, and submit. Need help with any specific essay question?"

If the user wants automatic fill:

1. `agent_browser_snapshot` → parse refs
2. `agent_browser_fill @eN "<value>"` for each form field from the job's
   `form_fields`
3. `agent_browser_screenshot final.png` → show the user
4. Ask: "Looks right? Submit? (y / adjust X)"

## Step 8 — Confirm

After the form is actually submitted in the browser (manual or automatic):

```bash
python3 job-search/job-search.py --json confirm <JOB-ID> \
  --submit-id "<confirmation ID from ATS>" \
  --notes "<e.g. 'Application Received email subject'>"
```

## Step 9 — Report

End with a summary:

| Stage | Count |
|---|---|
| Boards scanned | N |
| Jobs discovered | M |
| Added to queue | K |
| Approved | A |
| Submitted | S |
| Rejected | R (with reasons) |

## Boundaries

- **Never** auto-submit. Every approve / submit / confirm step needs the
  user's explicit go-ahead.
- **Never** invent JD content. Use exactly what `discover` returned.
- **Never** delete a job without showing the user the preview first.
- If `discover` returns 0 jobs, ask the user to broaden the search
  (different boards, broader keywords, drop the location filter).
- If agent-browser is missing or fails, fall back to having the user
  open the URL manually and paste the JD text into the next `add` call.
