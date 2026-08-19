---
description: Find Forward Deployed Engineer jobs that match the user's profile, present the best fits, then help fill the form on the user's behalf.
---

# /fde-apply — find FDE job URLs + help fill forms

You are the orchestrator. No Python tool, no state file. Just **find → present → fill**.

Autofill data lives in memory: `[[user-profile]]` (name, email, phone, links, 3 resume variants). Read it before Step 2.

## Step 1 — Ask scope

Default boards (FDE-heavy, no auth needed):
- Greenhouse: `anthropic`, `palantir`, `openai`, `scale`, `ramp`, `brex`, `stripe`
- Ashby public APIs: same set (Anthropic + OpenAI list some FDE roles on Ashby, not Greenhouse)

Logged-in boards (use `mcp__playwright-extension__*` — user's Chrome profile is connected):
- LinkedIn, Indeed, Wellfound, Glassdoor

User can override: "just linkedin", "all defaults + cloudflare", "ashby + linkedin only".

## Step 2 — Find

For each requested board, pick the cheapest path:

| Board type | Tool | Why |
|---|---|---|
| Greenhouse board | `WebFetch` against `https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true` | Public JSON, no browser needed |
| Ashby board | `WebFetch` against `https://api.ashbyhq.com/posting-api/job-board/{slug}?includeCompensation=true` | Public JSON, no browser needed |
| LinkedIn / Indeed / Wellfound / Glassdoor | `mcp__playwright-extension__browser_navigate(search URL)` then `browser_snapshot` + `browser_evaluate` to extract job cards | Logged-in Chrome profile required |
| Custom career page (React/Vue) | `mcp__playwright__browser_navigate` + `browser_snapshot` | Default profile, no auth needed |

Extract per job: `title`, `company`, `location`, `url`, `jd_text` (snippet is fine — full text only when picking).

## Step 3 — Triage + present

Read `[[user-profile]]` and pick the matching variant per job (`ai-startup` / `enterprise-ops` / `general-fde`). Score each as **strong** / **maybe** / **skip** based on highlights overlap.

Show the user the top 3–5 strong fits:

```
#1  Forward Deployed Engineer @ Anthropic (San Francisco / Remote)
    https://jobs.ashbyhq.com/anthropic/...
    Why: AI-agent customer deployment matches Channelflow. Variant: ai-startup.
```

Ask: **"Pick which to apply to (e.g. '1, 3' or 'all')."**

Wait for the user's response. Do not proceed without confirmation.

## Step 4 — Help fill (per picked URL)

For each picked job:

1. `mcp__playwright-extension__browser_navigate(jd_url)` (or default profile if not logged-in board).
2. `mcp__playwright-extension__browser_snapshot()` to read the form structure.
3. If the form is JS-rendered and snapshot is empty, fall back to `mcp__playwright-extension__browser_evaluate("Array.from(document.querySelectorAll('input,textarea,select')).map(el => ({name: el.name, type: el.type, required: el.required}))")`.
4. Map each field to `[[user-profile]]` data. Show the user the mapping table:
   ```
   First name  → Abdurrahman          (auto)
   Last name   → Firdaus              (auto)
   Email       → hello@abdurrahmanfirdaus.com  (auto)
   Phone       → +6285603520775       (auto)
   LinkedIn    → https://...          (auto)
   Why this role? → [blank — needs you]
   ```
5. Wait for user OK on the auto fields, then `mcp__playwright-extension__browser_type` each one.
6. For essay / free-text fields, draft a short answer (150–250 words) tied to the picked variant's highlights. Show the draft, wait for OK, then type.
7. **Never click the final Submit button.** User reviews the filled form and submits themselves. Optionally take a final screenshot for the user's records.

## Boundaries

- **Never auto-submit.** Every form fill step needs the user's explicit go-ahead.
- **Never invent JD content.** Use exactly what the page renders.
- **If a logged-in board shows the user isn't logged in** (e.g. LinkedIn redirects to /login), stop and tell the user to log in via the extension's Chrome window first, then retry.
- **If the form has unusual fields** (dropdowns, file upload, captcha), ask the user to handle that field manually.
- **If `discover` returns 0 jobs**, ask the user to broaden (different boards, broader keywords, drop the location filter).
- **No persistent state** — each `/fde-apply` run is independent. If the user wants to come back to a URL, they keep the URL themselves.
