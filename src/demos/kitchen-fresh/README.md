# Kitchen Fresh

Kitchen Fresh is a **staff-facing kitchen operations dashboard** for a
multi-outlet food & beverage business. The demo exposes four screens:
**Outlets** (pick an outlet from a grid of five outlet cards), **Daily Ops**
(per-outlet prep timer grid with status cycling and reset), **Stock Check**
(per-outlet stocktake grouped by category with +/- adjust), and **Shift
Handoff** (outgoing + incoming notes with editable checklists).

Clicking a card on the Outlets screen sets the active outlet that every
other screen reads from. Every fixture is synthetic (Outlet 1–Outlet 5,
generic prep names like "Acai Base", "Matcha Paste", "Banana Puree") and
no backend is wired.

The Daily Ops screen mirrors the production `FoodGrid` layout — a dense
CSS-grid of prep tiles with status-colored backgrounds
(good/alert/check/empty/replace), live time-remaining countdowns, and
per-tile reset.