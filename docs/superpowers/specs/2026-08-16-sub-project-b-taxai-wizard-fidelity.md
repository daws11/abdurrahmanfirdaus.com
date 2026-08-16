---
title: Sub-project B — TaxAI Wizard 99% production fidelity
date: 2026-08-16
status: draft
owner: Abdurrahman Firdaus
source-task: Iteration 3 / Sub-project B — re-implement tax-ai-wizard-web-70 production UI in the portfolio's TaxAI Wizard prototype
parent-iteration: iteration 3 visual fidelity push
---

# Sub-project B — TaxAI Wizard 99% production fidelity

## 1. Konteks & masalah

Iteration 1 + iteration 2 added `taxai-wizard` demo at `src/demos/taxai-wizard/` with 7 generic screens (Email, OTP, PersonalInfo, Plans, Checkout, Success, Dashboard). User-flagged: prototype "masih sangat tidak mirip dan terlalu generic". Want 99% production fidelity.

Production source: `tax-ai-wizard-web-70` cloned to `/tmp/taxai-prod/wizard/` for reference. Read-only — no production code is copied. Per project rules (`.claude/CLAUDE.md`): "Re-implementing components, layouts, and fixtures in fresh TypeScript code."

**Production structure (verified by reading production source):**

```
src/
├── components/registration/
│   ├── EmailInputStep.tsx          (62 lines) — Card + Mail icon + email input
│   ├── EmailVerificationStep.tsx   (255 lines) — Card + email-polling + 60s resend cooldown
│   ├── PersonalInfoStep.tsx        (310 lines) — First/Last + Role Select + Password × 2 + 2 Checkboxes + Validation Summary
│   ├── PlanSelectionStep.tsx       (160 lines) — 3-col grid of 4 plans (Trial/Monthly/Quarterly/Yearly)
│   └── SuccessStep.tsx             (186 lines) — CheckCircle + Account Details box + "Continue to Chat"
├── pages/RegistrationFlow.tsx      (137 lines) — Navbar + main with AnimatePresence + Footer
├── components/Navbar.tsx           — chrome
├── components/Footer.tsx           — chrome
├── components/PaymentForm.tsx      — Stripe Elements payment (not in registration components)
├── hooks/useRegistrationFlow.ts    — state machine
├── services/api.ts                 — Plan/User interfaces
└── i18n/{en,ar}.json               — translation strings
```

**Production flow has 6 steps, not 7** (Email input → Email verification → Personal info → Plan selection → Payment → Success). The current portfolio's "Dashboard" step is a synthetic invention — production redirects to chat.taxai after success.

## 2. Decisions made during exploration (locked)

1. **Match production flow** — 6 steps: email-input → email-verification → personal-info → plan-selection → payment → success. Drop the synthetic "dashboard" step.
2. **Drop the 6-digit OTP input** — production uses email-link verification (auto-send link on mount, poll `/auth/check-verification` every 2s, "Resend in {n}s" with 60s cooldown). Portfolio re-implements the visual UI of this flow without the actual backend polling.
3. **Production Personal Info has 5 fields** — First Name + Last Name (2-col grid) + Role Select (5 options) + Password + Confirm Password (with Eye/EyeOff toggle). Current portfolio has 4 fields (name + email + password + jobTitle). Add `confirmPassword`, split `name` into `firstName` + `lastName`, replace `jobTitle` free-text with `role` Select.
4. **Production has 2 checkboxes** — Disclaimer ("I acknowledge that Tax-AI provides AI-generated insights and does not offer certified tax or legal advice") + Privacy Policy. Add both.
5. **Production has Validation Summary** below the form — a small grid with red ✗ / green ✓ indicator per required field. Add this UI.
6. **Production Plan grid is 3-col** (sm:grid-cols-2, lg:grid-cols-3), not 4-col. Trial is FREE ($0).
7. **Production payment uses Stripe Elements** — re-implement with realistic Stripe Elements look (4242 card, MM/YY, CVC, "Powered by Stripe" subtitle, lock icon). Not a real Stripe integration.
8. **Production Success redirects to chat.taxai** — portfolio button shows "Continue to Chat" but stays in the demo (no real cross-app redirect).
9. **Production background** is `bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800`. Re-implement with theme tokens.
10. **Production cards** use `backdrop-blur-md bg-white/20 border shadow-sm` — re-implement with equivalent theme tokens (`var(--surface)` with opacity, `var(--border)`).
11. **Production i18n** (en.json + ar.json) — Portuguese/Arabic out of scope. Keep English labels matching production copy verbatim where reasonable.
12. **Production has Navbar + Footer chrome** — for portfolio prototype, keep the existing sidebar nav (Shell) and skip Navbar/Footer. Demo must look like an app, not a marketing landing.

## 3. Arsitektur

### 3.1 Production flow as portfolio routes

Current routes: `email | otp | register | plans | checkout | success | dashboard`.

New routes (matching production): `email | verification | personal-info | plans | checkout | success`.

- Remove `otp` (production uses email link verification, re-implemented as a visual UI showing the verification state + resend timer).
- Rename `register` → `personal-info` (production step name).
- Remove `dashboard` (production redirects to chat.taxai after success; no synthetic dashboard).

Total screens: **6** (down from 7).

### 3.2 Step 1 — EmailInputStep

Mirror `src/components/registration/EmailInputStep.tsx:31-62`:

```tsx
<Card className="w-full max-w-md mx-auto">
  <CardHeader className="text-center">
    <div className="flex justify-center mb-4">
      <Mail className="w-12 h-12" style={{ color: "var(--accent)" }} />
    </div>
    <CardTitle className="text-2xl font-bold">Enter Your Work Email</CardTitle>
    <p className="text-sm" style={{ color: "var(--muted)" }}>
      We'll send a verification link to your work email address.
    </p>
  </CardHeader>
  <CardContent>
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field
        label="Work Email Address"
        type="email"
        placeholder="your.email@company.com"
        value={email}
        onChange={onEmailChange}
      />
      <Button type="submit" variant="primary" className="w-full">
        Continue
      </Button>
    </form>
  </CardContent>
</Card>
```

**Differences from current impl:** Production uses shadcn `Card`/`CardHeader`/`CardContent`/`CardTitle` components. Portfolio maps to theme tokens via a local `Card`/`CardHeader`/`CardContent`/`CardTitle` shim inside the Wizard demo (or use existing shared primitives). Centered Mail icon at `w-12 h-12 text-blue-600` — portfolio maps to `color: var(--accent)`.

### 3.3 Step 2 — EmailVerificationStep (replaces OTP)

Mirror `src/components/registration/EmailVerificationStep.tsx:223-255` (the visual part; skip the API calls).

Production UI:
- Card with centered Mail icon (`w-12 h-12 text-blue-600`)
- Title "Verify Your Email" + description "We've sent a verification link to {email}"
- **Blue instruction box** (`bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg`) with copy "Please check your email and click the verification link to continue."
- Resend button (`variant="outline"`) — disabled when `cooldown > 0`. When disabled, button text becomes "Resend in {seconds}s".

Portfolio re-implementation (no backend polling):
- On mount, immediately set "Email sent" state + start a 60s cooldown timer (useState + setInterval).
- Display blue instruction box.
- Show resend button with countdown.
- Add a "Simulate verification" button (debug-only, hidden in production look) that advances to next step. Or: auto-advance after 3 seconds with a "Open Chat" CTA. **Decision:** show a primary "I've verified — continue →" button BELOW the resend button. This simulates the user clicking the link.

### 3.4 Step 3 — PersonalInfoStep

Mirror `src/components/registration/PersonalInfoStep.tsx:99-310`. Major sections:

**Header:** User icon (`w-12 h-12`) + title "Complete Your Profile" + description "Please provide your personal information to complete registration."

**Form fields (top to bottom):**
1. **First Name + Last Name** — 2-column grid, each with Label + Input.
2. **Role** — Select with 5 options: Tax Consultant, Business Owner, Lawyer, Auditor, Accountant. Default placeholder "Select your role".
3. **Password** — Input with type toggle (Eye/EyeOff icon button on right).
4. **Confirm Password** — Same pattern.
5. **Disclaimer Checkbox** — Label "Terms & Conditions" + body text "By registering, you acknowledge and agree to our [Disclaimer] and [Privacy Policy]." (links open in new tab).
6. **Privacy Checkbox** — Label "Privacy Policy" + body "I agree to the processing of my personal data in accordance with the Privacy Policy."

**Validation Summary** (below checkboxes):
- Small section with "Required fields:" header.
- 2-col grid listing each field with red ✗ (when missing) or green ✓ (when filled).
- Fields: First Name, Last Name, Role, Password, Confirm Password, Terms & Conditions, Privacy Policy.

**Submit button** — Disabled until `isFormValid` (all fields filled + both checkboxes ticked). On click, advance to plans.

### 3.5 Step 4 — PlanSelectionStep

Mirror `src/components/registration/PlanSelectionStep.tsx:70-159`.

**Layout:**
- Centered title "Choose Your Plan" + subtitle "Choose your plan and start chatting with our AI tax assistant immediately".
- 3-column responsive grid (`sm:grid-cols-2 lg:grid-cols-3`) — 4 plans on 2 rows.
- Loading state: CreditCard icon (`w-12 h-12 text-blue-600`) + "Loading Plans..." title.
- Footer note: "All plans include our comprehensive AI tax assistant and guidance. No credit card required for free trial. Start chatting immediately."

**4 Plans (synthetic, matches production's 4 plan model — fetch from API in prod, hardcoded in portfolio):**

| Plan | Price | Features |
|---|---|---|
| **Free Trial** | $0 | "Try all features for 14 days", "Up to 10 messages", "No credit card required", "1 user", "1 device", "Bilingual support" (EN/AR) |
| **Monthly Plan** | $99 | "100 AI-powered messages per month", "UAE Tax Coverage (VAT/Corporate/Excise)", "Priority email support", "1 user", "1 device", "Bilingual support" |
| **Quarterly Plan** | $250 (Most Popular badge) | "300 messages total over 3 months", "Standard support", "1-2 users", "2 devices", "Monthly tax digest", "Step-by-step guidance" |
| **Yearly Plan** | $899 | "1,200 messages per year (averaging 100/month)", "Priority email support", "Early access to new features", "Onboarding session included", "3+ users", "3 devices" |

Each card has:
- `backdrop-blur-md bg-white/20 border shadow-sm hover:shadow-md` styling (mapped to theme tokens).
- Hover: `hover:scale-105 transition-all`.
- Selected: `ring-2 ring-blue-500 scale-105` (production) → portfolio maps to `var(--accent)` ring.
- "Most Popular" Badge ribbon (only on Quarterly) at top-left of card.
- Plan name (h3), price ($X /month), description (60px min-height).
- Feature list with green Check icons.
- Footer button: "Start Chatting Now" (or "Get Started" for non-selected state).

**Trial shortcut:** Per production flow, selecting Trial skips Payment → goes directly to Success. Production logic at `useRegistrationFlow.ts:handlePlanSelect`. Portfolio re-implements: if `plan.name === "Trial"`, advance to `success`; otherwise advance to `checkout`.

### 3.6 Step 5 — Checkout (PaymentForm)

Mirror `src/components/PaymentForm.tsx`. Re-implement Stripe Elements-style UI (no real Stripe):

**Layout:**
- 2-column grid: payment form left, order summary right.
- Payment form: Card number (defaultValue "4242 4242 4242 4242"), Expiry + CVC row, Name on card (defaultValue "Sara Al-Mansouri"), "Pay $X" button with Lock icon.
- Order summary: Plan name, price line, VAT (5%, UAE), total (with border-top divider), renewal copy.
- "Powered by Stripe. Your card is encrypted on submit." subtitle.

**Submit:** advance to `success`.

### 3.7 Step 6 — SuccessStep

Mirror `src/components/registration/SuccessStep.tsx:146-186`.

**Layout:**
- Card with centered `CheckCircle` icon (`w-12 h-12 text-green-600`).
- Title "Account Created Successfully!".
- Description "Your account has been created and activated. You can now start using our AI chat service."
- **Green Account Details box** (`bg-green-50 dark:bg-green-900/20 p-4 rounded-lg`):
  - "Account Details" subheader
  - 4 lines: Email, Name (First Last), Plan, Valid Until (computed end date based on plan)
- Loading spinner ("Finalizing your account...") while `isProcessing` (synthetic: 2 second timeout).
- Primary button: "Continue to Chat" — in portfolio, navigates back to DemoHub `#/demos` instead of `chat.taxai`.

### 3.8 Visual styling

Production uses a distinct visual language:
- **Background**: `bg-gradient-to-br from-blue-50 to-indigo-100` (light mode) / `dark:from-gray-900 dark:to-gray-800` (dark mode).
- **Cards**: `backdrop-blur-md bg-white/20 dark:bg-gray-800/20 dark:border-gray-700/30 border shadow-sm`.
- **Icons**: production uses `text-blue-600` (12x12), `text-green-500`/`text-green-600` (5x5 / 12x12), `text-gray-400` (4x4 inside inputs).
- **Inputs**: shadcn `<Input>` with `mt-2`.
- **Labels**: shadcn `<Label>` (uppercase, muted).

Portfolio approach: keep the existing `src/demos/_shared/Shell` + `Field` + `Button` primitives, but **match production's visual feel** by:
- Re-styling the main content area background to a gradient.
- Adding a thin backdrop-blur effect to step cards (CSS-only, no shadcn Card).
- Mapping production's `text-blue-600` → `var(--accent)`, `text-green-600` → `var(--ok)`, `text-gray-400` → `var(--muted)`.
- Using shared `<Stepper>` from `src/demos/_shared/Stepper.tsx` for the sidebar (already wired in iteration 2).

### 3.9 Stepper wiring

Update `src/demos/taxai-wizard/routes.tsx`:
- Replace `TaxaiWizardScreen` union: `"email" | "verification" | "personal-info" | "plans" | "checkout" | "success"`.
- Update `TAXAI_WIZARD_SCREENS` array with 6 entries: Email, Verification, Personal info, Plans, Checkout, Welcome.
- Update `getScreenLabel` fallback from `"email"` to `"email"`.

Update `src/demos/taxai-wizard/index.tsx`:
- Update screen switch cases.
- Trial plan selection should skip Checkout → go to Success (handled inside Plans screen via `setDemoHash("taxai-wizard", "success")`).

## 4. File structure

### Files to delete

- `src/demos/taxai-wizard/screens/EmailStep.tsx` (replaced by new EmailInputStep.tsx)
- `src/demos/taxai-wizard/screens/OtpStep.tsx` (replaced by EmailVerificationStep)
- `src/demos/taxai-wizard/screens/PersonalInfo.tsx` (replaced by new PersonalInfoStep)
- `src/demos/taxai-wizard/screens/Dashboard.tsx` (production redirects to chat, no synthetic dashboard)
- `src/demos/taxai-wizard/screens/Plans.tsx`, `Checkout.tsx`, `SuccessStep.tsx` — replaced by new files below.

### Files to create

- `src/demos/taxai-wizard/screens/EmailInputStep.tsx`
- `src/demos/taxai-wizard/screens/EmailVerificationStep.tsx`
- `src/demos/taxai-wizard/screens/PersonalInfoStep.tsx`
- `src/demos/taxai-wizard/screens/PlanSelectionStep.tsx`
- `src/demos/taxai-wizard/screens/SuccessStep.tsx`
- `src/demos/taxai-wizard/screens/CheckoutStep.tsx` (rename to keep stepper-aligned naming; was Checkout.tsx)
- `src/demos/taxai-wizard/screens/StepCard.tsx` — local shim mirroring shadcn Card layout (since portfolio doesn't use shadcn Card primitives). Header + Content children.

### Files to modify

- `src/demos/taxai-wizard/routes.tsx` — 6-screen union, new label "Verification" + "Personal info".
- `src/demos/taxai-wizard/index.tsx` — switch covers 6 cases.
- `src/demos/taxai-wizard/mocks.ts` — update `PLANS` array with 4 plans (Trial/Monthly/Quarterly/Yearly), updated feature lists, `mostPopular: true` on Quarterly.

### Files NOT changed

- `src/demos/taxai-wizard/README.md` — update in a follow-up commit (Task B.1) after implementation lands.
- `vite.config.ts` — manual chunk rule for `taxai-wizard/` already added in iteration 2.
- Other demos.

## 5. Implementation order

1. **Create StepCard shim** — `src/demos/taxai-wizard/screens/StepCard.tsx` — local Card/Header/Content wrapper matching shadcn visual.
2. **Create EmailInputStep** — Card + Mail icon + email input + submit.
3. **Create EmailVerificationStep** — Card + email state + blue instruction box + resend cooldown timer + "I've verified — continue" CTA.
4. **Create PersonalInfoStep** — Card + 2-col First/Last grid + Role Select + Password × 2 (with Eye toggle) + 2 Checkboxes + Validation Summary + submit.
5. **Update mocks.ts** — 4 plans (Trial/Monthly/Quarterly/Yearly) with feature lists.
6. **Create PlanSelectionStep** — 3-col grid + 4 cards + hover/selected states + Trial shortcut.
7. **Create CheckoutStep** (rename Checkout.tsx) — Stripe Elements look + order summary.
8. **Create SuccessStep** — CheckCircle + Account Details box + spinner + Continue to Chat (→ `#/demos`).
9. **Update routes.tsx** — 6-screen union.
10. **Update index.tsx** — switch covers 6 cases.
11. **Delete obsolete screens** — EmailStep/OtpStep/PersonalInfo/Plans/Checkout/SuccessStep/Dashboard.
12. **Typecheck + smoke test** — navigate through 6 steps in dev server.

## 6. Yang TIDAK dilakukan

- Tidak clone production code ke portfolio (read-only reference)
- Tidak setup real Stripe / MongoDB / email verification backend
- Tidak add i18n (English only — Arabic translation out of scope)
- Tidak port production's Navbar/Footer chrome (portfolio uses Shell sidebar)
- Tidak setup localStorage persistence (production uses it for resume flow; portfolio is single-session)
- Tidak implement framer-motion AnimatePresence (portfolio keeps instant transitions)
- Tidak add "Continue to Dashboard" synthetic step (production redirects to chat.taxai)

## 7. Verifikasi

- `npx tsc --noEmit -p tsconfig.app.json` clean
- `npm run build` clean (no chunk-graph regressions)
- Dev server at port 3001: navigate `#/demos/taxai-wizard/email` through all 6 steps
  - Step 1: work email input + Continue
  - Step 2: verification card with 60s resend countdown + "I've verified" CTA
  - Step 3: 2-col First/Last + Role Select (5 options) + Password × 2 (with Eye toggle) + 2 Checkboxes + Validation Summary with red ✗ / green ✓
  - Step 4: 3-col plan grid with 4 cards, Trial $0, Monthly $99, Quarterly $250 (Most Popular), Yearly $899. Selecting Trial → step 6. Selecting other → step 5.
  - Step 5: Stripe Elements look with 4242 card, $X + 5% VAT + total
  - Step 6: CheckCircle + Account Details box + Continue to Chat → returns to `#/demos`
- Sidebar stepper shows correct active/completed states for the 6 steps

## 8. Commit strategy

Single feature commit at the end (consistent with iteration 2's batch-at-end convention):
- `feat(taxai-wizard): rewrite 6-step funnel to 99% match production tax-ai-wizard-web-70`

Commit includes:
- 6 new screen files
- 1 StepCard shim
- Updated routes.tsx + index.tsx + mocks.ts
- 7 deleted obsolete screens

## 9. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Stripe Elements re-implementation looks generic | Medium | Add subtle visual cues: lock icon, "Powered by Stripe" subtitle, monospace card number font |
| Resend countdown drift between runs (server time vs client time) | Low | Use `Date.now()` for cooldown math; persist `cooldownEndAt` in component state |
| Role Select doesn't match production look | Low | Use existing `Field` primitive (renders as `<input>`); if Select primitive is missing, add a simple native `<select>` styled with theme tokens |
| Production uses framer-motion AnimatePresence — visual change | Already mitigated | Portfolio keeps instant transitions; specify in §6 |
| Plan copy in production is long (60-100 chars per feature) | High | Trim to 2-4 features per plan to keep cards readable; mark full production copy as in `i18n/en.json` for reference |
| User wants 99% match — some elements will be approximated | Medium | Plan to discuss in next review after implementation |