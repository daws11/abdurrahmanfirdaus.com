# TaxAI Talk

This demo re-implements **talk.taxai.ae** as a synthetic prototype, **refit
to a UAE tax voice Q&A context** per spec. (The production repo is a
generic voice assistant, but for portfolio narrative coherence the demo
shows tax-themed sample conversations.) Three screens are wired:
**Voice** (default — centered waveform animation with 24 staggered pulsing
bars, three controls: mute / mic (large accent button) / end-call, footer
crediting ElevenLabs + GPT-4o), **Transcript** (bilingual sample
conversation alternating EN/AR with `dir="rtl"` on Arabic turns — covering
VAT rate, excise tax, and corporate tax registration), **Settings** (4
ElevenLabs voice cards: Aria / River / Sarah / George, with the selected
voice highlighted, plus language preference pills).

All voices are public knowledge of ElevenLabs's catalog. The transcript
content is synthetic and intentionally topical to UAE tax. Brand identity
follows shadcn new-york with a dark surface (`#0b0b14` bg) and violet
accent (`#7c3aed`) — no production code, schemas, or fixtures committed
here.
