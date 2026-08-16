# TaxAI Wizard

Six-screen onboarding funnel mirroring production `tax-ai-wizard-web-70`:

**Email → Verification → Personal info → Plans → Checkout → Welcome.**

- **Email**: work email input; advances to verification with a synthetic 300ms "Checking..." delay.
- **Verification**: production-style email-link verification UI — 60s resend cooldown timer, blue instruction box, "I've verified — continue" CTA. No real backend polling.
- **Personal info**: First/Last name grid, Role Select (5 options: Tax Consultant, Business Owner, Lawyer, Auditor, Accountant), Password × 2 with Eye toggle, Disclaimer + Privacy checkboxes, Validation Summary with red ✗ / green ✓ per required field.
- **Plans**: 3-col grid of 4 plans (Trial $0, Monthly $99, Quarterly $250 Most Popular, Yearly $899). Selecting Trial skips Checkout.
- **Checkout**: Stripe Elements-style payment form with card 4242 default, VAT 5% UAE breakdown, order summary.
- **Welcome**: CheckCircle + Account Details box (Email/Name/Plan/Valid Until) + 2s spinner + "Continue to Demo Hub" button.

All data is synthetic; no backend, no real Stripe, no real email verification.
