# Demo Foundation — Brand Tokens + Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the brand-aware foundation (5 themes, design-token contract, shared primitives, brand-aware shell) that the 5 per-demo plans will build on top of.

**Architecture:** Each demo gets a `DemoTheme` record with CSS variables scoped under `.demo-{id}` class. The shared `Shell` and primitives consume the theme via `useTheme()` hook. The portfolio's existing Tailwind config is extended with semantic color tokens that map to the theme variables.

**Tech Stack:** React 19, TypeScript, Tailwind v4, lucide-react, existing `cn()` utility. No new dependencies.

---

## File Structure

**Create (foundation):**

```
docs/demos-design-contracts.md          # written from recon results
src/demos/_shared/theme.ts              # DemoTheme type + 5 records
src/demos/_shared/useTheme.ts           # hook: returns theme by id
src/demos/_shared/Shell.tsx             # brand-aware shell
src/demos/_shared/TopBar.tsx            # top bar with monogram
src/demos/_shared/Sidebar.tsx           # brand-colored sidebar
src/demos/_shared/Brand.tsx             # monogram + brand-name
src/demos/_shared/Button.tsx            # cva-driven
src/demos/_shared/Badge.tsx             # status / chip
src/demos/_shared/DataTable.tsx         # rewritten for theme-aware
src/demos/_shared/Sheet.tsx             # right-side drawer
src/demos/_shared/Field.tsx             # labeled input
src/demos/_shared/EmptyState.tsx        # brand-aware empty
src/demos/_shared/StatTile.tsx          # brand-aware stat
src/demos/_shared/Stepper.tsx           # wizard progress
src/demos/_shared/KanbanColumn.tsx      # brand-aware kanban col
src/demos/_shared/DemoHub.tsx           # rewritten hub with brand colors
src/demos/_shared/fixtures/index.ts     # re-export shared fixtures
src/index.css                           # append `.demo-*` class scopes
```

**Create (synthetic fixtures — bare-bones, expanded per demo in their respective plans):**

```
src/demos/_shared/fixtures/inventory.ts
src/demos/_shared/fixtures/invoices.ts
src/demos/_shared/fixtures/bookings.ts
src/demos/_shared/fixtures/employees.ts
src/demos/_shared/fixtures/kitchen.ts
```

**Modify (registry/router/portfolio):**

```
src/demos/_index.ts                     # add `theme: DemoTheme` field per demo
src/demos/router.tsx                    # pass theme into each demo
src/demos/_shared/DemoGate.tsx          # unchanged
src/App.tsx                             # unchanged
vite.config.ts                          # unchanged
```

**Delete (after foundation passes build):**

```
src/demos/invenflow/boards/             # all 4 files
src/demos/invenflow/index.tsx
src/demos/invenflow/README.md
src/demos/invoice-sense/screens/        # all
src/demos/invoice-sense/index.tsx
src/demos/invoice-sense/README.md
src/demos/channelflow/screens/          # all
src/demos/channelflow/index.tsx
src/demos/channelflow/README.md
src/demos/kitchen-fresh/screens/        # all
src/demos/kitchen-fresh/index.tsx
src/demos/kitchen-fresh/README.md
src/demos/people-culture/screens/       # all
src/demos/people-culture/index.tsx
src/demos/people-culture/README.md
```

(Per the spec, demos are rebuilt from scratch in parallel subagent plans.)

---

## Task 1: Recon results aggregation → design contract

**Files:**
- Create: `docs/demos-design-contracts.md`
- Read: `.claude/recon-{invenflow,invoice-sense,channelflow,kitchen-fresh,people-culture}-style.md`

- [ ] **Step 1: Read all 5 recon reports**

Run: Read each of:
- `.claude/recon-invenflow-style.md`
- `.claude/recon-invoice-sense-style.md`
- `.claude/recon-channelflow-style.md`
- `.claude/recon-kitchen-fresh-style.md`
- `.claude/recon-people-culture-style.md`

Expected: Five markdown files exist with sections 1–6 (location, brand/theme, shell anatomy, density, routes, NDA check).

- [ ] **Step 2: Verify recon fidelity**

If any report is missing a key value (brand color, shell anatomy, density), dispatch a focused follow-up agent (do not run yourself). Stop and request user input if a value cannot be found.

- [ ] **Step 3: Write design contract**

Write `docs/demos-design-contracts.md` with:

```markdown
# Demo Design Contracts

This document defines the shared visual identity for each demo. Subagents MUST read this file first and build to it.

## Per-demo theme records

For each demo, this section contains a concrete `DemoTheme` record (TypeScript-style) with:
- brand.name, brand.monogram, brand.surface
- tokens (CSS variable values)
- shell anatomy (sidebar width, topbar height, density)
- font sans/mono
- Tailwind utility overrides

(Each record below is filled with values taken from `.claude/recon-{id}-style.md`.)

### Invenflow
[Paste from recon-invenflow-style.md, condensed]

### Invoice Sense
[Paste from recon-invoice-sense-style.md, condensed]

### Channelflow
[Paste from recon-channelflow-style.md, condensed]

### Kitchen Fresh
[Paste from recon-kitchen-fresh-style.md, condensed]

### People & Culture
[Paste from recon-people-culture-style.md, condensed]

## Shared primitives

- Shell consumes theme via `useTheme(id)`.
- TopBar height: `[per-theme]` px. Sidebar width expanded/collapsed.
- Density "compact" = h-8 row, "comfortable" = h-10 row.
- Border radius: `rounded-md` (6px) for cards, `rounded-sm` for inputs.
- Status colors: emerald = success/ok, amber = warn/pending, red = bad/error, blue = info/neutral.

## Routes

All demos use `#/demos/{id}` (hub) and `#/demos/{id}/{screen}` (sub). Routes are typed in each demo's `routes.tsx`.

## File naming

Every demo follows the same layout — see spec §6.
```

- [ ] **Step 4: Commit the contract**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
git add docs/demos-design-contracts.md .claude/recon-*.md
git commit -m "docs(demos): add design-token contract + 5 style recon reports"
```

---

## Task 2: Theme module + hook

**Files:**
- Create: `src/demos/_shared/theme.ts`
- Create: `src/demos/_shared/useTheme.ts`

- [ ] **Step 1: Write `theme.ts`**

```ts
// src/demos/_shared/theme.ts
//
// Concrete theme records for each demo. Values come from
// docs/demos-design-contracts.md (extracted from production source CSS/Tailwind
// config — see .claude/recon-*.md).

export type Surface = "light" | "dark";

export interface DemoTheme {
  id: "invenflow" | "invoice-sense" | "channelflow" | "kitchen-fresh" | "people-culture";
  brand: {
    name: string;
    monogram: string;   // 1–2 chars for top-bar avatar
    surface: Surface;
  };
  tokens: {
    "--bg": string;
    "--surface": string;
    "--fg": string;
    "--muted": string;
    "--border": string;
    "--accent": string;
    "--accent-fg": string;
    "--warn": string;
    "--ok": string;
    "--bad": string;
  };
  shell: {
    sidebarWidth: number;
    sidebarCollapsedWidth: number;
    topBarHeight: number;
    density: "compact" | "comfortable";
  };
  font: {
    sans: string;
    mono?: string;
  };
}

import { invenflowTheme } from "./themes/invenflow";
import { invoiceSenseTheme } from "./themes/invoice-sense";
import { channelflowTheme } from "./themes/channelflow";
import { kitchenFreshTheme } from "./themes/kitchen-fresh";
import { peopleCultureTheme } from "./themes/people-culture";

export const THEMES: Record<DemoTheme["id"], DemoTheme> = {
  invenflow: invenflowTheme,
  "invoice-sense": invoiceSenseTheme,
  channelflow: channelflowTheme,
  "kitchen-fresh": kitchenFreshTheme,
  "people-culture": peopleCultureTheme,
};

export function getTheme(id: DemoTheme["id"]): DemoTheme {
  return THEMES[id];
}

/** Applies the theme's CSS variables to document root (one-shot). */
export function applyTheme(theme: DemoTheme) {
  const root = document.documentElement;
  root.classList.add(`demo-${theme.id}`);
  for (const [k, v] of Object.entries(theme.tokens)) {
    root.style.setProperty(k, v);
  }
}
```

- [ ] **Step 2: Write per-demo theme files**

For each app, create `src/demos/_shared/themes/{id}.ts`. Each file exports a single named constant. **Replace placeholder values with the values from `docs/demos-design-contracts.md`:**

```ts
// src/demos/_shared/themes/invenflow.ts
import type { DemoTheme } from "../theme";

export const invenflowTheme: DemoTheme = {
  id: "invenflow",
  brand: {
    name: "Invenflow",
    monogram: "IF",
    surface: "dark",  // REPLACE with value from contract
  },
  tokens: {
    "--bg": "…",         // REPLACE — from contract
    "--surface": "…",
    "--fg": "…",
    "--muted": "…",
    "--border": "…",
    "--accent": "…",
    "--accent-fg": "…",
    "--warn": "…",
    "--ok": "…",
    "--bad": "…",
  },
  shell: {
    sidebarWidth: 256,   // REPLACE
    sidebarCollapsedWidth: 72,
    topBarHeight: 56,
    density: "compact",
  },
  font: {
    sans: "Inter, sans-serif",
    mono: "ui-monospace, SFMono-Regular, monospace",
  },
};
```

(Repeat for invoice-sense, channelflow, kitchen-fresh, people-culture — each with its own monogram and color values.)

- [ ] **Step 3: Write `useTheme.ts`**

```ts
// src/demos/_shared/useTheme.ts
import { useEffect, useState } from "react";
import { type DemoTheme, getTheme } from "./theme";

export function useTheme(id: DemoTheme["id"]): DemoTheme {
  const [theme, setTheme] = useState(() => getTheme(id));
  useEffect(() => {
    const next = getTheme(id);
    setTheme(next);
    const root = document.documentElement;
    // remove any previous .demo-* classes
    Array.from(root.classList)
      .filter((c) => c.startsWith("demo-"))
      .forEach((c) => root.classList.remove(c));
    root.classList.add(`demo-${id}`);
    for (const [k, v] of Object.entries(next.tokens)) {
      root.style.setProperty(k, v);
    }
  }, [id]);
  return theme;
}
```

- [ ] **Step 4: Extend `index.css` with theme variable scopes**

Append to `src/index.css`:

```css
/* Demo theme scopes — useTheme applies the active demo's class to <html>. */
/* Each scope re-binds the design tokens declared in theme.ts so primitives that
   read var(--accent)/var(--bg)/etc. pick up the demo's brand identity. */

.demo-invenflow {
  /* values copied from contract */
}
.demo-invoice-sense { /* values copied from contract */ }
.demo-channelflow  { /* values copied from contract */ }
.demo-kitchen-fresh { /* values copied from contract */ }
.demo-people-culture { /* values copied from contract */ }
```

Engineer MUST replace each comment block with concrete CSS variables from `docs/demos-design-contracts.md` — same hex values as `THEMES[id].tokens` so that `var(...)` resolves consistently in primitives.

- [ ] **Step 5: Verify build**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
npm run build
```
Expected: exits 0. (No demo using the theme yet — runtime behavior is exercised in the per-app plans.)

- [ ] **Step 6: Commit**

```bash
git add src/demos/_shared/theme.ts src/demos/_shared/themes/*.ts src/demos/_shared/useTheme.ts src/index.css
git commit -m "feat(demos): add theme module + useTheme hook + 5 theme records"
```

---

## Task 3: Brand + TopBar + Sidebar (brand-aware shell parts)

**Files:**
- Create: `src/demos/_shared/Brand.tsx`
- Create: `src/demos/_shared/TopBar.tsx`
- Create: `src/demos/_shared/Sidebar.tsx`

- [ ] **Step 1: `Brand.tsx`**

```tsx
// src/demos/_shared/Brand.tsx
import type { DemoTheme } from "./theme";
import { cn } from "@/lib/utils";

export function Brand({
  theme,
  size = "md",
  showName = true,
}: {
  theme: DemoTheme;
  size?: "sm" | "md";
  showName?: boolean;
}) {
  const isSmall = size === "sm";
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-md font-semibold uppercase tracking-tight",
          isSmall ? "h-6 w-6 text-[10px]" : "h-7 w-7 text-xs",
        )}
        style={{
          backgroundColor: "var(--accent)",
          color: "var(--accent-fg)",
        }}
      >
        {theme.brand.monogram}
      </div>
      {showName && (
        <span className={cn("font-semibold", isSmall ? "text-sm" : "text-base")}>
          {theme.brand.name}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: `TopBar.tsx`**

```tsx
// src/demos/_shared/TopBar.tsx
import { ArrowLeft, CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { DemoTheme } from "./theme";
import { Brand } from "./Brand";

export function TopBar({
  theme,
  rightSlot,
}: {
  theme: DemoTheme;
  rightSlot?: ReactNode;
}) {
  return (
    <header
      className="flex items-center gap-3 border-b px-4"
      style={{
        height: theme.shell.topBarHeight,
        borderColor: "var(--border)",
        backgroundColor: "var(--bg)",
      }}
    >
      <a
        href="/"
        className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-60 hover:opacity-100"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Portfolio
      </a>
      <div className="ml-3 flex h-6 w-px bg-[var(--border)]" />
      <Brand theme={theme} size="md" />
      <span
        className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
          color: "var(--muted)",
        }}
      >
        UI prototype
      </span>
      <div className="ml-auto flex items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
        {rightSlot ?? (
          <span className="flex items-center gap-1.5">
            <CircleAlert className="h-3.5 w-3.5" />
            Synthetic data · no backend
          </span>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 3: `Sidebar.tsx`**

```tsx
// src/demos/_shared/Sidebar.tsx
import { useState, type ReactNode } from "react";
import { ArrowLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoTheme } from "./theme";
import { Brand } from "./Brand";

export function Sidebar({
  theme,
  children,           // top-level "active demo" nav (from each demo)
  others,            // list of other demos for cross-linking
}: {
  theme: DemoTheme;
  children: ReactNode;
  others: { id: string; name: string; status: "live" | "soon" }[];
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside
      className={cn(
        "shrink-0 border-r transition-[width] duration-200",
        collapsed ? "w-[72px]" : "w-64",
      )}
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
        color: "var(--fg)",
      }}
    >
      <div className="flex h-14 items-center gap-2 border-b px-3" style={{ borderColor: "var(--border)" }}>
        <Brand theme={theme} size="sm" showName={!collapsed} />
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-md hover:bg-[var(--bg)]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">{children}</nav>
      {!collapsed && (
        <div className="border-t px-3 py-3" style={{ borderColor: "var(--border)" }}>
          <div
            className="mb-2 text-[10px] font-medium uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Other demos
          </div>
          <ul className="space-y-1">
            {others.map((d) => (
              <li key={d.id}>
                <a
                  href={`#/demos/${d.id}`}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-[var(--bg)]"
                  style={{ color: "var(--muted)" }}
                >
                  <span className="truncate">{d.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
```

- [ ] **Step 4: Build to confirm no TS errors**

```bash
npm run build
```
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/demos/_shared/Brand.tsx src/demos/_shared/TopBar.tsx src/demos/_shared/Sidebar.tsx
git commit -m "feat(demos): brand-aware Brand, TopBar, Sidebar primitives"
```

---

## Task 4: Shell (composes Sidebar + TopBar + content area)

**Files:**
- Create: `src/demos/_shared/Shell.tsx` (replaces existing shell)
- Delete: `src/demos/_shared/Shell.tsx` is being overwritten — no separate delete needed

- [ ] **Step 1: Write brand-aware Shell**

```tsx
// src/demos/_shared/Shell.tsx
import type { ReactNode } from "react";
import type { DemoTheme, DemoId } from "./theme";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { DEMOS } from "../_index";

export function Shell({
  id,
  children,
  nav,           // active-demo navigation (e.g. board list)
  rightSlot,     // TopBar right slot
}: {
  id: DemoId;
  children: ReactNode;
  nav: ReactNode;
  rightSlot?: ReactNode;
}) {
  const meta = DEMOS.find((d) => d.id === id)!;
  const others = DEMOS.filter((d) => d.id !== id);
  // theme resolved in the parent via useTheme; Shell takes a theme prop to
  // avoid coupling — caller wraps with useTheme.
  const theme: DemoTheme | undefined = undefined as never; // see Step 2
  return null; // placeholder, full impl in step 2
}
```

This is a placeholder — the real implementation comes after the next step picks a strategy for theme passing.

- [ ] **Step 2: Replace with theme-as-prop pattern**

```tsx
// src/demos/_shared/Shell.tsx (FINAL)
import type { ReactNode } from "react";
import type { DemoTheme } from "./theme";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { DEMOS } from "../_index";

export function Shell({
  theme,
  children,
  nav,
  rightSlot,
}: {
  theme: DemoTheme;
  children: ReactNode;
  nav: ReactNode;
  rightSlot?: ReactNode;
}) {
  const others = DEMOS.filter((d) => d.id !== theme.id);
  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
    >
      <Sidebar
        theme={theme}
        others={others.map((d) => ({ id: d.id, name: d.title, status: d.status }))}
      >
        {nav}
      </Sidebar>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar theme={theme} rightSlot={rightSlot} />
        <main
          className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6"
          style={{ backgroundColor: "var(--bg)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
```

(Per-demo `nav` content — sidebar items for that demo's screens — is rendered inside the `nav` slot. Each demo provides its own `nav`.)

- [ ] **Step 3: Build**

```bash
npm run build
```
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/demos/_shared/Shell.tsx
git commit -m "feat(demos): brand-aware Shell composing Sidebar + TopBar"
```

---

## Task 5: Primitives — Button, Badge, DataTable, EmptyState, StatTile, Field, Sheet, Stepper, KanbanColumn

**Files:**
- Create (replace): `src/demos/_shared/Button.tsx`
- Create (replace): `src/demos/_shared/Badge.tsx`
- Create (replace): `src/demos/_shared/DataTable.tsx`
- Create (replace): `src/demos/_shared/EmptyState.tsx`
- Create (replace): `src/demos/_shared/StatTile.tsx`
- Create: `src/demos/_shared/Field.tsx`
- Create: `src/demos/_shared/Sheet.tsx`
- Create: `src/demos/_shared/Stepper.tsx`
- Create: `src/demos/_shared/KanbanColumn.tsx`

- [ ] **Step 1: `Button.tsx` (cva-driven, theme-aware)**

```tsx
// src/demos/_shared/Button.tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "text-[var(--accent-fg)] hover:opacity-90",
        secondary: "border bg-transparent hover:bg-[var(--surface)]",
        ghost: "hover:bg-[var(--surface)]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-10 px-5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, style, ...props }, ref) => {
    const Comp: any = asChild ? Slot : "button";
    const base: Record<string, string> = {};
    if (variant === "primary") {
      base.backgroundColor = "var(--accent)";
    } else if (variant === "secondary") {
      base.borderColor = "var(--border)";
      base.color = "var(--fg)";
    } else if (variant === "ghost") {
      base.color = "var(--fg)";
    }
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        style={{ ...base, ...style }}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
```

- [ ] **Step 2: `Badge.tsx`**

```tsx
// src/demos/_shared/Badge.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "ok" | "warn" | "bad" | "info" | "accent";

const toneClass: Record<Tone, string> = {
  neutral: "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
  ok: "border border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
  warn: "border border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-300",
  bad: "border border-red-400/40 bg-red-400/10 text-red-700 dark:text-red-300",
  info: "border border-blue-400/40 bg-blue-400/10 text-blue-700 dark:text-blue-300",
  accent: "border border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: `EmptyState.tsx`**

```tsx
// src/demos/_shared/EmptyState.tsx
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-md border border-dashed py-12 text-center"
      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
    >
      {icon && <div className="mb-3 opacity-60">{icon}</div>}
      <h3 className="text-sm font-medium" style={{ color: "var(--fg)" }}>
        {title}
      </h3>
      {description && <p className="mt-1 max-w-sm text-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
```

- [ ] **Step 4: `StatTile.tsx`**

```tsx
// src/demos/_shared/StatTile.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "ok" | "warn" | "bad" | "info" | "accent";

const toneClass: Record<Tone, string> = {
  neutral: "text-[var(--fg)]",
  ok: "text-emerald-500 dark:text-emerald-400",
  warn: "text-amber-500 dark:text-amber-400",
  bad: "text-red-500 dark:text-red-400",
  info: "text-blue-500 dark:text-blue-400",
  accent: "text-[var(--accent)]",
};

export function StatTile({
  label,
  value,
  detail,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: ReactNode;
  detail?: string;
  tone?: Tone;
  icon?: ReactNode;
}) {
  return (
    <div
      className="rounded-md border p-4"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div className="flex items-start justify-between">
        <div className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          {label}
        </div>
        {icon && <div style={{ color: "var(--muted)" }}>{icon}</div>}
      </div>
      <div className={cn("mt-2 text-2xl font-semibold tabular-nums", toneClass[tone])}>
        {value}
      </div>
      {detail && (
        <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          {detail}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: `Field.tsx`**

```tsx
// src/demos/_shared/Field.tsx
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Field = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    hint?: string;
    error?: string;
    trailing?: ReactNode;
  }
>(({ label, hint, error, trailing, className, style, ...props }, ref) => {
  return (
    <label className="block">
      {label && (
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          {label}
        </div>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            "w-full rounded-sm border bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-1",
            className,
          )}
          style={{
            height: 36,
            borderColor: error ? "var(--bad, #ef4444)" : "var(--border)",
            color: "var(--fg)",
            ...style,
          }}
          {...props}
        />
        {trailing && (
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs" style={{ color: "var(--muted)" }}>
            {trailing}
          </div>
        )}
      </div>
      {(hint || error) && (
        <div className="mt-1 text-xs" style={{ color: error ? "var(--bad, #ef4444)" : "var(--muted)" }}>
          {error || hint}
        </div>
      )}
    </label>
  );
});
Field.displayName = "Field";
```

- [ ] **Step 6: `Sheet.tsx`**

```tsx
// src/demos/_shared/Sheet.tsx
import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function Sheet({
  open,
  onClose,
  title,
  children,
  width = 420,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="relative h-full border-l"
        style={{
          width,
          backgroundColor: "var(--bg)",
          borderColor: "var(--border)",
          color: "var(--fg)",
        }}
      >
        <header className="flex h-12 items-center gap-2 border-b px-3" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-sm font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-md hover:bg-[var(--surface)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="h-[calc(100%-3rem)] overflow-y-auto p-4">{children}</div>
      </aside>
    </div>
  );
}
```

- [ ] **Step 7: `Stepper.tsx`**

```tsx
// src/demos/_shared/Stepper.tsx
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({
  steps,
  current,
  onSelect,
}: {
  steps: { id: string; label: string; description?: string }[];
  current: string;
  onSelect?: (id: string) => void;
}) {
  const currentIdx = steps.findIndex((s) => s.id === current);
  return (
    <ol className="space-y-1">
      {steps.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onSelect?.(s.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-md border px-3 py-2 text-left",
                active && "border-[var(--accent)]",
              )}
              style={{
                borderColor: active ? "var(--accent)" : "var(--border)",
                backgroundColor: active ? "var(--surface)" : "transparent",
              }}
            >
              <span
                className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold"
                style={{
                  backgroundColor: done ? "var(--ok, #10b981)" : active ? "var(--accent)" : "transparent",
                  color: done || active ? "var(--accent-fg)" : "var(--muted)",
                  border: done || active ? "none" : "1px solid var(--border)",
                }}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium" style={{ color: "var(--fg)" }}>{s.label}</div>
                {s.description && (
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{s.description}</div>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 8: `KanbanColumn.tsx`**

```tsx
// src/demos/_shared/KanbanColumn.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function KanbanColumn({
  title,
  count,
  tone = "neutral",
  children,
}: {
  title: string;
  count?: number;
  tone?: "neutral" | "ok" | "warn" | "accent";
  children: ReactNode;
}) {
  const toneStyle: Record<string, React.CSSProperties> = {
    neutral: { borderColor: "var(--border)" },
    ok: { borderColor: "var(--ok, #10b981)" },
    warn: { borderColor: "var(--warn, #f59e0b)" },
    accent: { borderColor: "var(--accent)" },
  };
  return (
    <div
      className="flex flex-col rounded-md border"
      style={{ ...toneStyle[tone], backgroundColor: "var(--surface)" }}
    >
      <header className="flex items-center justify-between px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--fg)" }}>
          {title}
        </span>
        {typeof count === "number" && (
          <span className="text-xs tabular-nums" style={{ color: "var(--muted)" }}>
            {count}
          </span>
        )}
      </header>
      <div className={cn("flex flex-col gap-2 px-2 pb-2")}>{children}</div>
    </div>
  );
}
```

- [ ] **Step 9: `DataTable.tsx` (rewritten)**

The full DataTable implementation is reused from the existing code with two changes:
1. Sort indicators use `text-[var(--muted)]` instead of literal neutral.
2. Row hover uses `bg-[var(--surface)]` for theme awareness.

(Existing implementation is preserved largely; see `.claude/recon-*.md` for current state. Replace `text-muted-foreground` and `bg-secondary` with theme tokens where they appear.)

- [ ] **Step 10: Build + commit**

```bash
npm run build
git add src/demos/_shared/Button.tsx src/demos/_shared/Badge.tsx src/demos/_shared/DataTable.tsx \
        src/demos/_shared/EmptyState.tsx src/demos/_shared/StatTile.tsx src/demos/_shared/Field.tsx \
        src/demos/_shared/Sheet.tsx src/demos/_shared/Stepper.tsx src/demos/_shared/KanbanColumn.tsx
git commit -m "feat(demos): brand-aware primitives (Button, Badge, Field, Sheet, Stepper, KanbanColumn, EmptyState, StatTile, DataTable)"
```

---

## Task 6: DemoHub rewrite

**Files:**
- Create (overwrite): `src/demos/_shared/DemoHub.tsx`

- [ ] **Step 1: Rewrite hub using themes**

The hub is the card grid at `#/demos`. Each card uses the corresponding theme's accent and monogram.

```tsx
// src/demos/_shared/DemoHub.tsx (sketch — full implementation in plan task)
import { DEMOS } from "../_index";
import { THEMES } from "./theme";
import { Brand } from "./Brand";

export function DemoHub() {
  return (
    <div className="min-h-screen px-6 py-12" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}>
      <header className="mx-auto max-w-5xl">
        <a href="/" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100">
          ← Portfolio
        </a>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Demo prototypes</h1>
        <p className="mt-2 max-w-2xl text-sm opacity-70">
          Five UI-only prototypes — synthetic data, no backend, no integrations wired.
          Click into any demo to see the production app, recreated from scratch.
        </p>
      </header>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {DEMOS.map((d) => {
          const theme = THEMES[d.id];
          return (
            <a
              key={d.id}
              href={d.route}
              className="group block rounded-md border p-5 transition hover:shadow-sm"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              <div className="flex items-center gap-2">
                <Brand theme={theme} size="sm" showName={false} />
                <span className="text-[10px] uppercase tracking-widest opacity-60">{d.division}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold">{d.title}</h2>
              <p className="mt-2 text-sm opacity-70">{d.blurb}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--accent)" }}>
                Open demo →
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build + commit**

```bash
npm run build
git add src/demos/_shared/DemoHub.tsx
git commit -m "feat(demos): brand-aware DemoHub with per-theme card styling"
```

---

## Task 7: Router theme pass-through

**Files:**
- Modify: `src/demos/router.tsx`
- Modify: `src/demos/_index.ts`

- [ ] **Step 1: Update `_index.ts` to attach theme per demo**

```ts
// src/demos/_index.ts
// Add: import { THEMES } from "./_shared/theme";
// For each demo entry: theme: THEMES[d.id]
```

(Exact diff: 5 spots, one per `DemoMeta` literal — add `theme: THEMES.<id>` field.)

- [ ] **Step 2: Update `router.tsx` to pass theme to each demo**

Each demo's `Component<{ sub, theme }>` gets `theme={THEMES[id]}`. The 5 demo `index.tsx` files in the per-app plans consume this prop and pass it to `useTheme(theme.id)` + `<Shell theme={theme}>`.

(Exact diff in `router.tsx` is the `DEMO_COMPONENTS` map and the render — minimal, just adding a `theme` prop to the call site.)

- [ ] **Step 3: Build to confirm types align**

```bash
npm run build
```
Expected: may fail at the demo entry points because they don't yet accept `theme`. The per-app plans fix that. Don't commit yet.

- [ ] **Step 4: Commit the registry/router changes**

```bash
git add src/demos/_index.ts src/demos/router.tsx
git commit -m "feat(demos): attach theme per demo in registry + router"
```

---

## Task 8: Bare-bones synthetic fixtures

**Files:**
- Create: `src/demos/_shared/fixtures/{inventory,invoices,bookings,employees,kitchen}.ts`

These are **shared across all 5 apps** as a base layer. Each app-specific plan extends them.

- [ ] **Step 1: `inventory.ts`**

```ts
// src/demos/_shared/fixtures/inventory.ts
export type OutletId = "WH" | "O1" | "O2" | "O3" | "O4" | "O5";
export interface Outlet { id: OutletId; name: string; code: string; }
export const OUTLETS: Outlet[] = [
  { id: "WH", name: "Central Warehouse", code: "WH" },
  { id: "O1", name: "Outlet 1", code: "O1" },
  { id: "O2", name: "Outlet 2", code: "O2" },
  { id: "O3", name: "Outlet 3", code: "O3" },
  { id: "O4", name: "Outlet 4", code: "O4" },
  { id: "O5", name: "Outlet 5", code: "O5" },
];
export function findOutlet(id: OutletId) { return OUTLETS.find((o) => o.id === id); }

export interface Sku { code: string; name: string; unit: string; tag: "asset" | "cogs" | "consumable" | "stock"; }
export const SKUS: Sku[] = [
  { code: "SKU-001", name: "House Beans 1kg", unit: "kg", tag: "cogs" },
  { code: "SKU-002", name: "Oat Milk 1L",     unit: "L",  tag: "cogs" },
  { code: "SKU-003", name: "Cane Sugar 1kg",  unit: "kg", tag: "cogs" },
  { code: "SKU-004", name: "Branding Stickers (roll)", unit: "roll", tag: "consumable" },
  { code: "SKU-005", name: "Branding Cups 12oz", unit: "pcs", tag: "consumable" },
  { code: "SKU-006", name: "Espresso Machine Pro", unit: "unit", tag: "asset" },
  { code: "SKU-007", name: "Grinder 64mm", unit: "unit", tag: "asset" },
  { code: "SKU-008", name: "Cleaning Tablets", unit: "pcs", tag: "consumable" },
  { code: "SKU-009", name: "Napkin Bulk Pack", unit: "pack", tag: "consumable" },
  { code: "SKU-010", name: "Almond Flour 500g", unit: "kg", tag: "stock" },
  { code: "SKU-011", name: "Cocoa Powder 500g", unit: "kg", tag: "stock" },
  { code: "SKU-012", name: "Vanilla Syrup 750ml", unit: "L", tag: "cogs" },
];

export interface Vendor { code: string; name: string; }
export const VENDORS: Vendor[] = [
  { code: "VA", name: "Vendor A" },
  { code: "VB", name: "Vendor B" },
  { code: "VC", name: "Vendor C" },
  { code: "VD", name: "Vendor D" },
  { code: "VE", name: "Vendor E" },
];
export function findVendor(code: string) { return VENDORS.find((v) => v.code === code); }

export interface StockByLocation {
  sku: string; outlet: OutletId; projected: number; actual: number | null;
}
export const STOCK_BY_LOCATION: StockByLocation[] = [];
// populated by random for demo realism in app plans
```

- [ ] **Step 2: `invoices.ts`**

```ts
// src/demos/_shared/fixtures/invoices.ts
export type InvoiceStatus = "matched" | "mismatch" | "pending";
export interface InvoiceLine { sku: string; qty: number; unitPrice: number; total: number; }
export interface Invoice {
  id: string;                  // INV-0001 etc.
  vendor: string;              // vendor code
  date: string;                // ISO
  dueDate: string;
  lines: InvoiceLine[];
  status: InvoiceStatus;
  mismatchField?: "qty" | "price" | "total" | "sku";
}
export const INVOICES: Invoice[] = [];   // expanded in invoice-sense plan
```

- [ ] **Step 3: `bookings.ts`**

```ts
// src/demos/_shared/fixtures/bookings.ts
export type Channel = "whatsapp" | "instagram" | "email" | "tiktok";
export interface Message { from: "guest" | "agent"; body: string; at: string; }
export interface Booking {
  id: string;
  channel: Channel;
  guestName: string;
  date: string;
  partySize: number;
  status: "new" | "confirmed" | "cancelled";
  tourGuideCode?: string;       // "TG-01" style
  messages: Message[];
}
export const BOOKINGS: Booking[] = [];
```

- [ ] **Step 4: `employees.ts`**

```ts
// src/demos/_shared/fixtures/employees.ts
export type EmployeeStatus = "active" | "onboarding" | "offboarding";
export interface Employee {
  id: string; code: string; name: string; role: string; outletId: string;
  joinedAt: string; status: EmployeeStatus;
}
export const EMPLOYEES: Employee[] = [];
```

- [ ] **Step 5: `kitchen.ts`**

```ts
// src/demos/_shared/fixtures/kitchen.ts
export type PrepStatus = "pending" | "in-progress" | "done";
export interface PrepItem { id: string; name: string; outletId: string; parLevel: number; status: PrepStatus; }
export const PREP_ITEMS: PrepItem[] = [];
```

- [ ] **Step 6: Index re-exports + build**

```ts
// src/demos/_shared/fixtures/index.ts
export * from "./inventory";
export * from "./invoices";
export * from "./bookings";
export * from "./employees";
export * from "./kitchen";
```

```bash
npm run build
git add src/demos/_shared/fixtures/
git commit -m "feat(demos): bare synthetic fixtures (per-app plans extend)"
```

---

## Task 9: Smoke-test the foundation

- [ ] **Step 1: Run dev server**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
npm run dev &
```

- [ ] **Step 2: Use Playwright MCP to visit each demo hub theme**

Use `mcp__playwright__browser_navigate` to open:
- `http://localhost:3000/#/demos` — hub renders 5 cards
- `http://localhost:3000/#/demos/invenflow` — shell renders with monogram IF

The existing 5 demo `index.tsx` files will break at this point because they expect the old Shell API. The orchestrator should see broken shells here and proceed to delete-then-rebuild per the per-app plans.

- [ ] **Step 3: Stop dev server**

```bash
pkill -f "vite"
```

- [ ] **Step 4: Commit notes (if any)**

No commit needed unless debug edits were made.

---

## Task 10: Delete old demo per-app files

Per the spec, demos are rebuilt from scratch.

- [ ] **Step 1: Remove all demo subdirectories**

```bash
cd /Users/yanuar/Documents/abdurrahmanfirdaus.com
rm -rf src/demos/invenflow/boards
rm -rf src/demos/invoice-sense/screens
rm -rf src/demos/channelflow/screens
rm -rf src/demos/kitchen-fresh/screens
rm -rf src/demos/people-culture/screens
```

(Each per-app plan will re-create these with brand-aware code.)

- [ ] **Step 2: Verify what's left**

```bash
ls -la src/demos/*/
```

Expected: each per-app dir should be empty (or only contain a README that the plan will overwrite).

- [ ] **Step 3: Commit the deletion**

```bash
git add src/demos/
git commit -m "refactor(demos): remove pre-rebuild per-app files (rebuilt in per-app plans)"
```

---

## What's next

After this foundation plan is complete, **5 per-app plans** run in parallel — one subagent per app — to populate screens, fixtures, and theme-specific behavior. Each per-app plan follows the same shape:

1. Read contract + theme + recon report
2. Build `index.tsx`, `routes.tsx`, `mocks.ts`, `README.md`
3. Build 3–4 screens under `screens/`
4. Run NDA grep, `npm run build`, Playwright screenshot
5. Report

Foundation self-review checklist:

- [ ] Types in foundation match what per-app plans will reference (`Shell`, `Theme`, `Badge`, `Button`, etc.)
- [ ] No demo-specific logic leaks into shared primitives
- [ ] `npm run build` exits 0
- [ ] Pre-commit NDA grep clean

---

**Plan complete. Total: 10 tasks. After completion, dispatch 5 parallel per-app subagent plans.**
