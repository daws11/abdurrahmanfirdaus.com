# Invenflow

A five-screen walkthrough of the Invenflow workflow — purchasing kanban,
incoming deliveries, stocktake variance capture, location-level inventory,
and stock movement log. The sidebar is the chrome (navy gradient, no top bar).
Every screen runs locally: kanban transitions, bulk-confirm on receiving,
editable actual counts on stocktake, filter+sort on inventory, and a
per-SKU movement drawer.

## Surface area

- **Purchasing** — 4-column kanban (New Request → Approved → Purchased → Received).
  "Advance →" / "← Back" move cards. "New PO" opens a Sheet with vendor
  dropdown, line items editor, totals.
- **Receiving** — 30 rows of incoming deliveries. "Mark received" flips a row;
  "Receive now" opens a Sheet with tracking-code input. Bulk select surfaces
  an action bar with "Mark arrived" / "Mark received".
- **Stocktake** — outlet tabs (WH + 5 outlets), 100+ editable rows per tab.
  Live Δ + reason dropdown + free-text note. Save baseline pins counts.
- **Inventory** — 100+ rows across the 6 locations. Search, location filter,
  status segmented (All / Below par / Reorder / Over par). Row-level
  "Movement" button opens a Sheet with the SKU's recent transfer log.
- **Movement** — focused log of inbound, outbound, and transfer entries with
  direction/outlet filters.

All counts, vendor codes, SKUs, and PO numbers are synthetic placeholders
(Vendor A, SKU-001, PO-2026-101, Outlet 1, Central Warehouse). Brand identity
(navy gradient sidebar, monogram, status pill semantics, compact rows) and
layout conventions (256px sidebar, sidebar IS chrome, table density, kanban
column ordering) are derived from the production app's visual style.