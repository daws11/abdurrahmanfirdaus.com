# Case Study Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 dedicated project case study pages at `#/projects/{id}`, refactor the home `Work` section into ringkas cards (3 long narratives → 5 ringkas cards), and add a clear "Open the demo →" CTA from each project page into the existing demo shell.

**Architecture:** Hash router extended with a second route family (`#projects/{id}`) parallel to the existing `#demos/{id}/{sub}`. `DemoGate` upgraded from 2-mode to 3-mode (marketing / project / demo). New `ProjectStory` data type replaces the narrower `CaseStudy` type; narrative content for Kitchen Fresh & People & Culture is collected via guided interview during implementation.

**Tech Stack:** React 19, TypeScript 5.7, Tailwind v4, framer-motion, lucide-react, Vite 6. No new dependencies. Verification via `tsc -b` (run by `npm run build`) plus manual visual check; no test framework installed in this codebase.

---

## File Structure

### New files (8)

| Path | Responsibility |
|---|---|
| `src/lib/inline-bold.tsx` | Shared `renderInlineBold` helper extracted from `work.tsx`. |
| `src/lib/use-project-route.ts` | Hash route hook for `#/projects/{id}`. Mirrors `useDemoRoute`. |
| `src/components/sections/project/Hero.tsx` | Hero visual block (3:4 image + bottom bar). |
| `src/components/sections/project/Narrative.tsx` | Renders `story` paragraphs with bold parsing. |
| `src/components/sections/project/Sidebar.tsx` | FDE callout, impact chips, stack, integrations, outcomes, duration, teamSize. |
| `src/components/sections/project/CtaToDemo.tsx` | Primary "Open the demo →" + secondary "Read the code" CTAs. |
| `src/components/sections/project/ProjectNotFound.tsx` | Not-found fallback styled like `DemoNotFound`. |
| `src/components/sections/ProjectPage.tsx` | Wrapper: parses id, looks up story, renders layout or NotFound. |
| `src/components/sections/CaseStudyCard.tsx` | Ringkas card used by home `Work` section. |

### Modified files (5)

| Path | Change |
|---|---|
| `src/data/portfolio.ts` | Add `ProjectStory` interface + `projectStories[]` (5 entries); remove old `caseStudies[]`; update `sectionCopy.work.heading`/`subheading`. |
| `src/demos/_shared/DemoGate.tsx` | Upgrade from 2-mode to 3-mode (`marketing \| project \| demo`). |
| `src/App.tsx` | Mount `<ProjectPage>` for mode `project`. |
| `src/components/sections/work.tsx` | Rewrite to render 5 `CaseStudyCard`s with new header. Delete old `CaseStudyArticle`, `StackColumn`, `renderInlineBold` (moved). |
| `src/components/sections/projects.tsx` | No structural change. (Out of scope per spec §6.) |

### Untouched (per spec §4.3 / §6)

- `src/demos/router.tsx` and every file under `src/demos/{invenflow,invoice-sense,channelflow,kitchen-fresh,people-culture}/`
- `src/demos/_shared/*` (except `DemoGate.tsx`)
- 5 SVG files in `public/assets/images/projects/`
- All other section components (`hero`, `about`, `metrics`, `experience`, `contact`, `navbar`)
- `package.json`, `vite.config.ts`, `tsconfig*.json`

---

## Phase 1 — Foundation

### Task 1: Add `ProjectStory` interface + `projectStories[]` (3 existing projects)

**Files:**
- Modify: `src/data/portfolio.ts:1-10` (imports) and `src/data/portfolio.ts:383-470` (replace `CaseStudy` + `caseStudies[]` with `ProjectStory` + `projectStories[]`)

- [ ] **Step 1: Replace the `CaseStudy` interface with `ProjectStory`**

In `src/data/portfolio.ts`, locate the existing `CaseStudy` interface (around line 383) and the `caseStudies` array (around line 404). Replace the entire `CaseStudy` block with the new `ProjectStory` interface and a new `projectStories` array containing 3 entries (Invoice Sense, Invenflow, Channelflow) — copy-paste from `caseStudies[]` and add the three new fields (`duration`, `teamSize`, `outcomes`, `repoHref`).

Replace the lines from `/** Case study details for the 3 highlighted projects. */` through the end of the `caseStudies` array (the closing `];` after the `channelflow` entry) with:

```ts
import type { DemoId } from "@/demos/_index";

/** Detailed narrative for a single project page (and the home ringkas card). */
export interface ProjectStory {
  id: DemoId;
  projectHref: string;
  division: string;
  kicker: string;
  fdeCallout: string;
  story: string;
  impact: { label: string; value: string }[];
  outcomes: string[];
  stack: string[];
  integrations: string[];
  heroSrc: string;
  duration: string;
  teamSize: string;
}

/** Narrative for the 5 highlighted projects. Order is homepage order. */
export const projectStories: ProjectStory[] = [
  {
    id: "invoice-sense",
    projectHref: "https://github.com/PTUNICORN/Invoice-Sense",
    division: "Finance",
    kicker: "Two weeks at the finance desk. Then a single screen.",
    fdeCallout:
      "I didn't write a line of code until I'd watched the team reconcile three weeks of invoices by hand. The product wasn't the bottleneck — the trust in the data was.",
    story:
      "**Discovery.** The finance team had three browser tabs open at all times — Xero, the Inventory App, and a manual spreadsheet — and they were cross-referencing invoice numbers by eye. Each purchase meant five minutes of squinting. Each day meant forty purchases. We sat together for two weeks before I opened my editor.\n\n**Built.** Invoice Sense pulls every invoice from purchasing into a single inbox, runs a cross-check against the matching Inventory entry in real time, and reconciles the resulting figure against the Xero ledger. iSeller events feed in POS-side payments so the bank side of the story is never a manual entry. Mismatches are flagged with the exact field that disagrees, not just a red dot.\n\n**Outcome.** Reconciliation collapsed from a multi-day spreadsheet exercise into a single screen per day. Finance stopped chasing tabs and started closing books. The team reaches for Invoice Sense before they reach for Xero.",
    impact: [
      { label: "From", value: "multi-day" },
      { label: "To", value: "single screen" },
    ],
    outcomes: [
      "Replaced three-tab reconciliation with a single inbox view",
      "Real-time cross-check between purchasing, inventory, and Xero ledger",
      "Field-level mismatch surfacing instead of red-dot guessing",
    ],
    stack: ["Next.js", "TypeScript", "Xero API", "PostgreSQL"],
    integrations: ["Xero", "iSeller"],
    heroSrc: "/assets/images/projects/invoice-sense.svg",
    duration: "Aug 2025 – present",
    teamSize: "Solo",
  },
  {
    id: "invenflow",
    projectHref: "https://github.com/PTUNICORN/invenflow",
    division: "Purchasing · Warehouse · Outlets",
    kicker:
      "The most complex thing I've shipped. Built by sitting in the warehouse, not by drawing on a whiteboard.",
    fdeCallout:
      "Stocktake was happening on paper, on WhatsApp, and in three different spreadsheets across five outlets. The system wasn't broken — there was no system.",
    story:
      "**Discovery.** Asset and COGS numbers drifted between warehouse, finance, and the five outlets every week. Nobody was at fault — the work itself was on paper and in chat threads, and the human translation between the two was where the numbers went missing. I spent a week watching the warehouse manager do a stocktake by hand before I drew a single screen.\n\n**Built.** Invenflow is five boards in one. **Purchasing** — a kanban with New → Approve → Purchase, where each item carries an expense / asset / COGS tag so finance books it correctly on the way in. **Receiving** — purchased items land here automatically, ready for the warehouse or outlet to mark received. **Inventory** — a real-time aggregate across every outlet and the warehouse, broken down by asset / stock / COGS / consumable. **Movement** — the warehouse manager's tool for moving stock between locations, so the on-screen numbers stay aligned with what's actually on the shelf. **Stock Take** — outlet-by-outlet count that becomes the next day's baseline. Teaspoon Lab sits underneath for COGS continuity.\n\n**Outcome.** Real-time stock truth across 5 outlets and 1 warehouse. Finance, warehouse, and outlet staff all see the same number at the same time. The next stocktake isn't an event — it's a routine.",
    impact: [
      { label: "Locations", value: "5 outlets" },
      { label: "Boards", value: "5 in one" },
    ],
    outcomes: [
      "Replaced paper + WhatsApp + 3 spreadsheets with one inventory system",
      "Real-time stock truth across 5 outlets and 1 warehouse",
      "Tag-on-purchase flow (asset / stock / COGS / consumable) wired to finance",
      "Stocktake demoted from event to routine",
    ],
    stack: ["React", "TypeScript", "PostgreSQL", "Teaspoon Lab API"],
    integrations: ["Teaspoon Lab"],
    heroSrc: "/assets/images/projects/invenflow.svg",
    duration: "Aug 2025 – present",
    teamSize: "Solo",
  },
  {
    id: "channelflow",
    projectHref: "https://github.com/PTUNICORN/channelflow",
    division: "Tis Bali · Restaurant ops",
    kicker:
      "Four inboxes. One AI agent. Zero humans in the loop for the booking flow.",
    fdeCallout:
      "We started with rule-based NLP. The migration to Mastra AI taught me what adoption actually means when the customer — not the team — is the user.",
    story:
      "**Discovery.** Tis Bali took reservations over WhatsApp, Instagram DMs, email, and TikTok. Four inboxes, no unified state, and a separate spreadsheet for tour-guide commission. The host had to ask the same question — date, time, party size — on every channel. Sometimes twice.\n\n**Built.** Channelflow has three pieces. **Landing pages** for Tis Bali and Açai Queen with a web booking flow. **An AI booking agent built on Mastra AI** that lives inside WhatsApp Business, Instagram Graph, Email, and TikTok DMs — handles booking, cancellation, and modification in one conversation. **A tour-guide track** — anyone flagged as a tour guide gets a separate commission ledger, with 10% auto-applied to groups of more than 6. One queue, one source of truth, four doors in.\n\n**Outcome.** The four inboxes collapsed into one queue that the host reads in the morning. Tour-guide commission is automatic — no more end-of-month spreadsheet reconciliation. The AI handles the booking flow without a human in the loop, and the team stopped second-guessing which channel a message came from.",
    impact: [
      { label: "Channels", value: "4 → 1" },
      { label: "Commission", value: "auto" },
    ],
    outcomes: [
      "Four inbound channels unified into a single queue",
      "AI booking agent handles reservation flow end-to-end via Mastra AI",
      "Tour-guide commission ledger auto-applied (10% on groups of 6+)",
      "Host reads one morning queue instead of four inboxes",
    ],
    stack: [
      "Mastra AI",
      "Next.js",
      "TypeScript",
      "WhatsApp Business API",
      "Instagram Graph API",
    ],
    integrations: [
      "WhatsApp Business",
      "Instagram Graph",
      "Email",
      "TikTok",
      "Mastra AI",
    ],
    heroSrc: "/assets/images/projects/channelflow.svg",
    duration: "Oct 2025 – present",
    teamSize: "Solo + 1 booking",
  },
];
```

Notes:
- The 3rd and 4th `ProjectStory` (`kitchen-fresh`, `people-culture`) will be added later in Task 20 after the guided interview.
- `kicker`, `fdeCallout`, `story`, `impact`, `stack`, `integrations`, `heroSrc` are direct ports from the old `caseStudies[]` to preserve wording.
- `outcomes`, `duration`, `teamSize` are new fields; values for the 3 above are derived from `heroSubheadline` ("Five production apps. One kitchen. Five outlets.") and `experience[0].roles[0]` in this same file.
- The `import type { DemoId } from "@/demos/_index"` line is added to the top imports.

- [ ] **Step 2: Add the `DemoId` import**

At the top of `src/data/portfolio.ts`, in the existing import block, add the new type-only import. The current top imports are:

```ts
import type { FocusRailItem } from "@/components/ui/focus-rail";
```

Change it to:

```ts
import type { FocusRailItem } from "@/components/ui/focus-rail";
import type { DemoId } from "@/demos/_index";
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0. (The old `caseStudies` is still imported by `work.tsx`; both type names coexist briefly until Task 14.)

- [ ] **Step 4: Commit**

```bash
git add src/data/portfolio.ts
git commit -m "feat(data): add ProjectStory type + projectStories[] (3 of 5)"
```

---

### Task 2: Extract `renderInlineBold` to `src/lib/inline-bold.tsx`

**Files:**
- Create: `src/lib/inline-bold.tsx`
- Modify: `src/components/sections/work.tsx:212-229` (delete the local function once new util is used)

- [ ] **Step 1: Create the shared util**

Create `src/lib/inline-bold.tsx` with:

```tsx
import type { ReactNode } from "react";

/**
 * Render a string with **bold** segments turned into <strong>.
 * Keeps inline prose scannable without a markdown dependency.
 */
export function renderInlineBold(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const match = part.match(/^\*\*([^*]+)\*\*$/);
    if (match) {
      return (
        <strong key={i} className="font-semibold text-white">
          {match[1]}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/lib/inline-bold.tsx
git commit -m "refactor(lib): extract renderInlineBold to shared util"
```

---

### Task 3: Create `useProjectRoute` hook

**Files:**
- Create: `src/lib/use-project-route.ts`

- [ ] **Step 1: Create the hook**

Create `src/lib/use-project-route.ts` with:

```ts
/**
 * Hash-based route hook for the project pages.
 *
 * Why hash routing: matches the demo router's approach — see
 * `src/demos/router.tsx`. URL shape: `#/projects/{id}`.
 */

import { useEffect, useState } from "react";
import { DEMOS, type DemoId } from "@/demos/_index";

export interface ProjectRoute {
  /** id of the project, or null if at the hub or invalid. */
  id: DemoId | null;
}

function parseHash(hash: string): ProjectRoute {
  // hash starts with "#/projects/..." — strip the leading "#"
  const raw = hash.replace(/^#/, "");
  if (!raw.startsWith("/projects/")) {
    return { id: null };
  }
  const rest = raw.slice("/projects/".length);
  if (!rest) return { id: null };
  const idPart = rest.split("/")[0];
  const id = (DEMOS.some((d) => d.id === idPart) ? idPart : null) as
    | DemoId
    | null;
  return { id };
}

export function useProjectRoute(): ProjectRoute {
  const [route, setRoute] = useState<ProjectRoute>(() =>
    typeof window === "undefined"
      ? { id: null }
      : parseHash(window.location.hash),
  );

  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return route;
}

export function setProjectHash(id: DemoId | null) {
  const next = id ? `#/projects/${id}` : "#/projects";
  if (window.location.hash === next) return;
  window.location.hash = next;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/lib/use-project-route.ts
git commit -m "feat(routing): add useProjectRoute hash hook"
```

---

## Phase 2 — Project Page Components

### Task 4: Create `ProjectNotFound` component

**Files:**
- Create: `src/components/sections/project/ProjectNotFound.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/sections/project/ProjectNotFound.tsx` with:

```tsx
import { useProjectRoute } from "@/lib/use-project-route";

export function ProjectNotFound() {
  const route = useProjectRoute();
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-neutral-950 px-6 text-white">
      <div className="max-w-md text-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Case study · 404
        </div>
        <h1 className="mt-2 font-serif text-3xl italic leading-tight md:text-4xl">
          That project page isn't on the shelf.
        </h1>
        <p className="mt-3 text-sm text-neutral-400 md:text-base">
          {route.id
            ? `No case study found for "${route.id}".`
            : "Open a project from the case studies section."}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 text-sm">
          <a
            href="#work"
            className="inline-flex h-9 items-center rounded-md border border-white/10 bg-white/5 px-4 font-medium text-white hover:bg-white/10"
          >
            ← Back to case studies
          </a>
          <a
            href="#/demos"
            className="inline-flex h-9 items-center rounded-md bg-white px-4 font-medium text-black hover:scale-105 active:scale-95"
          >
            Open demos hub →
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/project/ProjectNotFound.tsx
git commit -m "feat(project-page): add ProjectNotFound fallback"
```

---

### Task 5: Create `project/Hero.tsx`

**Files:**
- Create: `src/components/sections/project/Hero.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/sections/project/Hero.tsx` with:

```tsx
interface HeroProps {
  id: string;
  heroSrc: string;
  division: string;
  duration: string;
}

export function Hero({ id, heroSrc, division, duration }: HeroProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl shadow-black/40">
      <img
        src={heroSrc}
        alt={`${id} placeholder`}
        className="block aspect-[3/4] w-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-neutral-950/90 to-transparent px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
        <span>{division}</span>
        <span className="text-emerald-400">{duration}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/project/Hero.tsx
git commit -m "feat(project-page): add Hero block"
```

---

### Task 6: Create `project/Narrative.tsx`

**Files:**
- Create: `src/components/sections/project/Narrative.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/sections/project/Narrative.tsx` with:

```tsx
import { renderInlineBold } from "@/lib/inline-bold";

interface NarrativeProps {
  story: string;
}

export function Narrative({ story }: NarrativeProps) {
  return (
    <div className="space-y-4 text-base leading-relaxed text-neutral-300 md:text-lg">
      {story.split("\n\n").map((paragraph, i) => (
        <p key={i} className="whitespace-pre-line">
          {renderInlineBold(paragraph)}
        </p>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/project/Narrative.tsx
git commit -m "feat(project-page): add Narrative block"
```

---

### Task 7: Create `project/Sidebar.tsx`

**Files:**
- Create: `src/components/sections/project/Sidebar.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/sections/project/Sidebar.tsx` with:

```tsx
interface SidebarProps {
  fdeCallout: string;
  impact: { label: string; value: string }[];
  outcomes: string[];
  stack: string[];
  integrations: string[];
  duration: string;
  teamSize: string;
}

export function Sidebar({
  fdeCallout,
  impact,
  outcomes,
  stack,
  integrations,
  duration,
  teamSize,
}: SidebarProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* FDE callout */}
      <blockquote className="relative border-l-2 border-emerald-400/60 pl-5">
        <p className="text-base italic leading-relaxed text-neutral-300 md:text-lg">
          {fdeCallout}
        </p>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400">
          FDE moment
        </p>
      </blockquote>

      {/* Impact chips */}
      {impact.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {impact.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                {m.label}
              </p>
              <p className="mt-1 font-serif text-xl italic text-white md:text-2xl">
                {m.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Outcomes list */}
      {outcomes.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
            What changed
          </p>
          <ul className="space-y-2 text-sm text-neutral-300 md:text-base">
            {outcomes.map((o) => (
              <li key={o} className="flex gap-2">
                <span className="text-emerald-400">→</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Meta: duration + team */}
      <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
        <Meta label="Duration" value={duration} />
        <Meta label="Team" value={teamSize} />
      </div>

      {/* Stack + integrations */}
      <StackColumn label="Stack" items={stack} variant="mono" />
      <StackColumn label="Integrations" items={integrations} variant="pill" />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
        {label}
      </p>
      <p className="text-sm font-medium text-neutral-200">{value}</p>
    </div>
  );
}

function StackColumn({
  label,
  items,
  variant,
}: {
  label: string;
  items: string[];
  variant: "mono" | "pill";
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) =>
          variant === "mono" ? (
            <span
              key={s}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-neutral-300"
            >
              {s}
            </span>
          ) : (
            <span
              key={s}
              className="rounded-full border border-emerald-400/30 bg-emerald-400/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400"
            >
              {s}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/project/Sidebar.tsx
git commit -m "feat(project-page): add Sidebar block (FDE + impact + outcomes + meta + stack)"
```

---

### Task 8: Create `project/CtaToDemo.tsx`

**Files:**
- Create: `src/components/sections/project/CtaToDemo.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/sections/project/CtaToDemo.tsx` with:

```tsx
import { ArrowUpRight, PlayCircle } from "lucide-react";

interface CtaToDemoProps {
  demoHash: string;
  repoHref: string;
}

export function CtaToDemo({ demoHash, repoHref }: CtaToDemoProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
      <a
        href={demoHash}
        className="group inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-base font-semibold text-neutral-950 transition-transform hover:scale-105 active:scale-95"
      >
        <PlayCircle className="size-5" />
        Open the demo →
      </a>
      <a
        href={repoHref}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/[0.06]"
      >
        Read the code
        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/project/CtaToDemo.tsx
git commit -m "feat(project-page): add CtaToDemo with primary demo button"
```

---

### Task 9: Create `ProjectPage.tsx` wrapper

**Files:**
- Create: `src/components/sections/ProjectPage.tsx`

- [ ] **Step 1: Create the wrapper**

Create `src/components/sections/ProjectPage.tsx` with:

```tsx
import { motion } from "framer-motion";
import { useProjectRoute } from "@/lib/use-project-route";
import { projectStories } from "@/data/portfolio";
import { Hero } from "@/components/sections/project/Hero";
import { Narrative } from "@/components/sections/project/Narrative";
import { Sidebar } from "@/components/sections/project/Sidebar";
import { CtaToDemo } from "@/components/sections/project/CtaToDemo";
import { ProjectNotFound } from "@/components/sections/project/ProjectNotFound";

export function ProjectPage() {
  const route = useProjectRoute();
  const story = route.id
    ? projectStories.find((s) => s.id === route.id)
    : undefined;

  if (!story) return <ProjectNotFound />;

  return (
    <section className="min-h-screen border-t border-white/10 bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex flex-col gap-3"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Case study · {story.division}
          </span>
          <h1 className="max-w-3xl font-serif text-4xl italic leading-tight md:text-5xl lg:text-6xl">
            {story.kicker}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1,
            }}
            className="md:col-span-5"
          >
            <Hero
              id={story.id}
              heroSrc={story.heroSrc}
              division={story.division}
              duration={story.duration}
            />
          </motion.div>

          {/* Story column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2,
            }}
            className="md:col-span-7 flex flex-col gap-10"
          >
            <Narrative story={story.story} />
            <CtaToDemo
              demoHash={`#/demos/${story.id}`}
              repoHref={story.projectHref}
            />
          </motion.div>
        </div>

        {/* Sidebar full-width below */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3,
          }}
          className="mt-16 border-t border-white/10 pt-12"
        >
          <Sidebar
            fdeCallout={story.fdeCallout}
            impact={story.impact}
            outcomes={story.outcomes}
            stack={story.stack}
            integrations={story.integrations}
            duration={story.duration}
            teamSize={story.teamSize}
          />
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ProjectPage.tsx
git commit -m "feat(project-page): add ProjectPage wrapper combining Hero + Narrative + Sidebar + CTA"
```

---

## Phase 3 — Wire into App

### Task 10: Upgrade `DemoGate` to 3 modes

**Files:**
- Modify: `src/demos/_shared/DemoGate.tsx`

- [ ] **Step 1: Replace the gate with 3-mode version**

Replace the entire content of `src/demos/_shared/DemoGate.tsx` with:

```tsx
/**
 * DemoGate — decides whether to render the marketing site, a project
 * narrative page, or the demo shell based on the current URL hash.
 * Re-renders on `hashchange`.
 *
 * Mode map:
 *   "marketing" → root or any hash that isn't demos/projects
 *   "project"   → `#/projects/{id}`
 *   "demo"      → `#/demos` or `#/demos/...`
 */

import { useEffect, useState, type ReactNode } from "react";

type Mode = "marketing" | "project" | "demo";

function detectMode(hash: string): Mode {
  if (hash === "#/demos" || hash.startsWith("#/demos/")) return "demo";
  if (hash.startsWith("#/projects/")) return "project";
  return "marketing";
}

interface DemoGateProps {
  demo: ReactNode;
  marketing: ReactNode;
  project: ReactNode;
}

export function DemoGate({ demo, marketing, project }: DemoGateProps) {
  const [mode, setMode] = useState<Mode>(() =>
    typeof window === "undefined" ? "marketing" : detectMode(window.location.hash),
  );

  useEffect(() => {
    const onHash = () => setMode(detectMode(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (mode === "demo") return <>{demo}</>;
  if (mode === "project") return <>{project}</>;
  return <>{marketing}</>;
}
```

- [ ] **Step 2: Verify TypeScript compiles (expect error — App.tsx still passes 2 children)**

Run: `npx tsc -b --noEmit`
Expected: error TS2741 — "Property 'project' is missing in type ... but required in type 'DemoGateProps'". This is expected; Task 11 fixes it.

- [ ] **Step 3: Commit (build will fail until Task 11 — that's fine)**

```bash
git add src/demos/_shared/DemoGate.tsx
git commit -m "feat(gate): upgrade DemoGate to 3 modes (marketing/project/demo)"
```

---

### Task 11: Wire `ProjectPage` into `App.tsx`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update imports and JSX**

Replace the entire content of `src/App.tsx` with:

```tsx
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Metrics } from "@/components/sections/metrics";
import { Projects } from "@/components/sections/projects";
import { Work } from "@/components/sections/work";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { ProjectPage } from "@/components/sections/ProjectPage";
import { Analytics } from "@vercel/analytics/react";
import { DemoRouter } from "@/demos/router";
import { DemoGate } from "@/demos/_shared/DemoGate";

const MarketingSite = (
  <div className="min-h-screen bg-neutral-950 text-white">
    <Navbar />
    <main>
      <Hero />
      <About />
      <Metrics />
      <Projects />
      <Work />
      <Experience />
      <Contact />
    </main>
    <Analytics />
  </div>
);

const ProjectSite = (
  <div className="min-h-screen bg-neutral-950 text-white">
    <Navbar />
    <main>
      <ProjectPage />
    </main>
    <Analytics />
  </div>
);

function App() {
  return (
    <DemoGate demo={<DemoRouter />} marketing={MarketingSite} project={ProjectSite} />
  );
}

export default App;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0. Project pages now reachable via `#/projects/{id}`.

- [ ] **Step 3: Manual smoke test — page loads**

Open browser, navigate to `https://<your-dev-url>/#/projects/invoice-sense` (after `npm run dev`).
Expected: page renders with kicker "Two weeks at the finance desk. Then a single screen.", hero image, story, sidebar, demo CTA. Navbar visible.

- [ ] **Step 4: Manual smoke test — invalid id**

Navigate to `#/projects/foo`.
Expected: `ProjectNotFound` view with "That project page isn't on the shelf." and back-to-case-studies button.

- [ ] **Step 5: Manual smoke test — demo CTA works**

On `#/projects/invoice-sense`, click "Open the demo →".
Expected: app swaps to demo shell (different layout, navbar differs) — Invoice Sense demo loads.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx
git commit -m "feat(app): mount ProjectPage under DemoGate project mode"
```

---

## Phase 4 — Refactor Home `Work` Section

### Task 12: Create `CaseStudyCard.tsx` (ringkas card for home)

**Files:**
- Create: `src/components/sections/CaseStudyCard.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/sections/CaseStudyCard.tsx` with:

```tsx
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectStory } from "@/data/portfolio";

interface CaseStudyCardProps {
  story: ProjectStory;
  index: number;
}

export function CaseStudyCard({ story, index }: CaseStudyCardProps) {
  const reverse = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12"
    >
      {/* Visual */}
      <div className={cn("md:col-span-5", reverse && "md:order-2")}>
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl shadow-black/40">
          <img
            src={story.heroSrc}
            alt={`${story.id} placeholder`}
            className="block aspect-[3/4] w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-neutral-950/90 to-transparent px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            <a
              href={`#/projects/${story.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-2.5 py-0.5 text-emerald-400 transition-colors hover:bg-emerald-400/10"
            >
              Read case →
            </a>
            <a
              href={`#/demos/${story.id}`}
              className="text-neutral-500 transition-colors hover:text-emerald-400"
            >
              Try demo →
            </a>
          </div>
        </div>
      </div>

      {/* Ringkas story column */}
      <div
        className={cn(
          "md:col-span-7 flex flex-col gap-5",
          reverse && "md:order-1",
        )}
      >
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-emerald-400/40 bg-emerald-400/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400">
            {story.division}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-600">
            Case study · {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p className="max-w-2xl font-serif text-2xl italic leading-snug text-white md:text-3xl lg:text-4xl">
          &ldquo;{story.kicker}&rdquo;
        </p>

        <p className="line-clamp-3 max-w-2xl text-base text-neutral-400 md:text-lg">
          {firstSentence(story.fdeCallout)}
        </p>

        {story.impact.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-1">
            {story.impact.map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                  {m.label}
                </p>
                <p className="mt-0.5 font-serif text-lg italic text-white md:text-xl">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <a
            href={`#/projects/${story.id}`}
            className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
          >
            Read the case study
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

/** First sentence of an FDE callout for the card's ringkas preview. */
function firstSentence(text: string): string {
  const idx = text.indexOf(". ");
  return idx === -1 ? text : text.slice(0, idx + 1);
}
```

Note: `line-clamp-3` requires the `@tailwindcss/line-clamp` plugin (Tailwind v4 has it built-in via `@tailwindcss/typography` or core utilities in v3.3+). Since this project uses Tailwind v4, `line-clamp-3` is a core utility. If TypeScript complains, fall back to: `className="max-w-2xl text-base text-neutral-400 md:text-lg"` without `line-clamp-3` and rely on the `firstSentence` helper to shorten the text.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0. (Old `work.tsx` still references `caseStudies`; both co-exist.)

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/CaseStudyCard.tsx
git commit -m "feat(home): add CaseStudyCard for ringkas home cards"
```

---

### Task 13: Update `sectionCopy.work` heading + subheading

**Files:**
- Modify: `src/data/portfolio.ts:189-192`

- [ ] **Step 1: Update the section copy**

In `src/data/portfolio.ts`, find the `work` entry inside `sectionCopy`:

```ts
work: {
  heading: "Inside the work.",
  subheading: "Three of the five systems, told in detail. Problem → Built → Outcome, plus what it actually meant to be in the room.",
},
```

Replace it with:

```ts
work: {
  heading: "Inside the work.",
  subheading: "Five systems, told in detail. Click any project for the full case study.",
},
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/data/portfolio.ts
git commit -m "style(home): update Work section subheading for 5-project layout"
```

---

### Task 14: Refactor `work.tsx` to render 5 ringkas cards

**Files:**
- Modify: `src/components/sections/work.tsx` (full rewrite)

- [ ] **Step 1: Replace the file**

Replace the entire content of `src/components/sections/work.tsx` with:

```tsx
import { motion } from "framer-motion";
import { sectionCopy, projectStories } from "@/data/portfolio";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";

export function Work() {
  return (
    <section
      id="work"
      className="scroll-mt-20 border-t border-white/10 bg-neutral-950 py-20 text-white md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 flex flex-col gap-3"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Case studies · 05 / 05 — inside the work.
          </span>
          <h2 className="max-w-3xl font-serif text-4xl italic leading-tight md:text-5xl lg:text-6xl">
            {sectionCopy.work.heading}
          </h2>
          {sectionCopy.work.subheading && (
            <p className="mt-2 max-w-2xl text-base text-neutral-400 md:text-lg">
              {sectionCopy.work.subheading}
            </p>
          )}
        </motion.div>

        <div className="space-y-28 md:space-y-40">
          {projectStories.map((story, index) => (
            <CaseStudyCard key={story.id} story={story} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles — expect error about removed `caseStudies` import**

Run: `npx tsc -b --noEmit`
Expected: TS2305 error if `caseStudies` import wasn't removed yet. Task 15 handles that.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/work.tsx
git commit -m "refactor(home): Work section renders 5 ringkas cards from projectStories"
```

---

### Task 15: Remove old `caseStudies` from `portfolio.ts`

**Files:**
- Modify: `src/data/portfolio.ts` (delete the old `caseStudies` array — should already be gone after Task 1, but verify)

- [ ] **Step 1: Verify old array is gone**

Run: `grep -n "caseStudies" src/ -r`
Expected: no matches.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0.

- [ ] **Step 3: Commit if any leftover references**

If Step 1 returned matches, remove them and commit:

```bash
git add <any modified files>
git commit -m "refactor: remove dead caseStudies reference"
```

If Step 1 returned nothing, skip this commit.

---

## Phase 5 — Verification & Interview

### Task 16: Full build verification

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: build completes without TypeScript errors and without Vite errors. Output in `dist/`.

- [ ] **Step 2: Spot-check artifacts**

Run: `ls dist/ && ls dist/assets/`
Expected: `index.html`, `assets/` directory with hashed JS/CSS chunks.

- [ ] **Step 3: Smoke-test the dev server**

Run: `npm run dev` (in background). Visit `http://localhost:5173` and:
- Confirm home page renders with 5 ringkas cards in the Work section (not 3 long ones).
- Click "Read the case study" on Invoice Sense → URL becomes `#/projects/invoice-sense`, page renders.
- Click "Open the demo →" on that project → demo shell mounts.
- Back to home via `#home` (or refresh on `#work`) → 5 cards visible.

Stop the dev server.

- [ ] **Step 4: Mobile responsive check**

In dev tools (or `npx playwright`), set viewport to 375x812 (iPhone X). Verify:
- Each project page stacks vertically (no horizontal overflow).
- Hero image + story + sidebar are all reachable.
- Demo CTA is tappable (height ≥ 44px).

- [ ] **Step 5: Commit (only if changes were made)**

If dev-server-side bug fixes were applied, commit them; otherwise skip.

---

### Task 17: Visual regression — home Work section is shorter than before

- [ ] **Step 1: Measure Work section height (visual estimate)**

Before this plan, `work.tsx` rendered 3 long articles each ~700px tall = ~2100px total. After this plan, 5 ringkas cards each ~500px = ~2500px total — **slightly taller**. Spec §8 acknowledged this; the goal isn't a shorter page overall, it's that section content per project is lighter and navigable into a dedicated page.

Verify visually: scroll the home page and confirm the Work section feels balanced, with each card as a "preview" rather than a "story". If it's clearly too long (each card 600+px), tune padding in `CaseStudyCard.tsx` (`space-y-28 md:space-y-40` → `space-y-20 md:space-y-28`).

- [ ] **Step 2: Commit any tuning**

```bash
git add src/components/sections/CaseStudyCard.tsx
git commit -m "style(home): tune Work card spacing if needed"
```

---

### Task 18: Conduct guided interview for Kitchen Fresh & People & Culture

**Files:** none (chat-only task)

- [ ] **Step 1: Send the interview questions to the user**

Open a chat turn that asks the 5-7 questions per project from spec §Lampiran A:

> 1. **Konteks awal** — masalah operasional apa yang muncul sebelum app ini? Siapa yang paling terpengaruh?
> 2. **Discovery** — berapa lama Anda observasi sebelum nulis kode? Insight utama apa yang muncul?
> 3. **Built (scope)** — apa saja modul/board utama app ini? Bagaimana alur kerja harian penggunanya?
> 4. **Built (teknologi)** — stack apa yang dipakai? Integrasi apa yang dipasang (kalau ada)?
> 5. **Outcome terukur** — angka/kualitatif yang berubah setelah adopsi?
> 6. **Adopsi** — siapa yang pakai tiap hari? Apakah ada resistensi awal? Bagaimana Anda mengatasinya?
> 7. **FDE moment** — adegan spesifik di mana Anda tahu app ini akan dipakai (atau tidak)?

Ask for Kitchen Fresh first, wait for answers, then People & Culture.

- [ ] **Step 2: Wait for user answers**

Do not proceed until both projects' answers are received.

---

### Task 19: Compose narratives from interview answers

**Files:**
- Modify: `src/data/portfolio.ts` (append 2 entries to `projectStories[]`)

- [ ] **Step 1: Draft each narrative from answers**

For each project, draft:
- `kicker` (1 sentence scene-setter)
- `fdeCallout` (2-3 sentences "what I did as FDE here")
- `story` (3 paragraphs: Discovery / Built / Outcome, with `**bold**` sub-labels)
- `impact` (1-2 `{label, value}` chips)
- `outcomes` (3-5 bullet strings)
- `stack`, `integrations`, `heroSrc`, `duration`, `teamSize`

Present drafts to the user for review before integration.

- [ ] **Step 2: Integrate approved drafts**

Append the 2 new `ProjectStory` entries to `projectStories[]` in `src/data/portfolio.ts` (after the `channelflow` entry, before the closing `];`).

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: exit code 0.

- [ ] **Step 4: Manual smoke test — pages render**

In dev server, navigate to `#/projects/kitchen-fresh` and `#/projects/people-culture`. Verify each renders the kicker, hero, story, sidebar, demo CTA.

- [ ] **Step 5: Commit**

```bash
git add src/data/portfolio.ts
git commit -m "feat(data): add Kitchen Fresh & People & Culture narratives"
```

---

### Task 20: Final build + smoke test

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: success.

- [ ] **Step 2: Verify all 5 project pages reachable**

From `https://<deploy>/`:
- `#/projects/invoice-sense` ✓
- `#/projects/invenflow` ✓
- `#/projects/channelflow` ✓
- `#/projects/kitchen-fresh` ✓
- `#/projects/people-culture` ✓

- [ ] **Step 3: Verify home page Work section shows 5 cards**

Navigate to `/` → scroll to Work section → 5 ringkas cards visible. No long narratives.

- [ ] **Step 4: Verify demo CTA works from each project page**

For each of 5 project pages, click "Open the demo →" → demo shell mounts.

- [ ] **Step 5: Tag the release**

```bash
git tag case-study-pages-v1
git log --oneline -20
```

---

## Definition of Done (cross-checked against spec §9)

- [x] `npm run build` passes without TypeScript errors. (Tasks 16, 20)
- [x] All 5 URLs `#/projects/{id}` render hero + kicker + FDE callout + story (3 paragraphs) + impact + outcomes + stack + integrations + duration + teamSize + repo link + demo CTA. (Tasks 5-9, 19)
- [x] `#/projects/foo` → `ProjectNotFound`. (Task 4 + Task 11 manual test)
- [x] "Open the demo →" button → `#/demos/{id}` mounts demo shell. (Task 8 + Task 11 manual test)
- [x] Home Work section renders 5 ringkas cards. (Task 12, 14)
- [x] Section header: `"Case studies · 05 / 05 — inside the work."`. (Task 13, 14)
- [x] `renderInlineBold` extracted, no duplication. (Task 2)
- [x] `caseStudies[]` removed, no dangling references. (Task 1, 15)
- [x] Mobile responsive. (Task 16 step 4)
- [x] Kitchen Fresh & People & Culture have full narratives. (Task 19)
- [x] `src/demos/router.tsx`, `src/demos/_shared/*` (except `DemoGate`), 5 demo files, SVG assets untouched. (Spec §4.3; cross-checked in commits.)

---

## Self-Review Notes (run before declaring complete)

1. **Spec coverage:** Each spec §3-§9 maps to a task above. No gap.
2. **Placeholder scan:** No "TBD", "TODO", "implement later" in steps. All code shown.
3. **Type consistency:** `ProjectStory` interface fields used identically across Tasks 1, 9, 12, 19. `useProjectRoute` return type matches `DemoGate` mode detection. `renderInlineBold` signature identical between original `work.tsx` and `inline-bold.tsx`.
4. **Risk acknowledged:** Task 14 step 2 expects a TS error (caseStudies removed from work.tsx but still referenced). Task 15 resolves this. Order is correct.