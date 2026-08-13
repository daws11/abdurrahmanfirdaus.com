# TaxAI Wizard

This demo re-implements the **tax-ai-wizard-web-70** subscription onboarding
flow as a synthetic prototype. A 7-screen flow is wired with a left stepper
sidebar (numbered steps that flip to checkmarks on completion) showing the
user's progress: **Email** (default — work email capture), **OTP** (6-digit
verification code), **Personal info** (name, password, job title), **Plans**
(four tier cards — Free Trial $0, Monthly $99, Quarterly $250 highlighted,
Yearly $899), **Checkout** (mock Stripe Elements with a live-looking card
form and order summary with 5% UAE VAT), **Welcome** (success splash), and
**Dashboard** (quota widget with usage bar, subscription status, renew date,
and "next steps" linking to the sibling TaxAI demos).

All names, emails, prices, and quota numbers are synthetic placeholders
(`Sara Al-Mansouri`, `sara.mansouri@example.ae`). UAE-specific touches:
5% VAT line, AED/USD pricing, `.ae` email domain. Brand identity and layout
follow shadcn new-york with teal accent (`#0ea5a4`) — no production code,
schemas, or fixtures committed here.
