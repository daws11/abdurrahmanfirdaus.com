# Invoice Sense

This demo showcases the Invoice Sense product surface — an invoice inbox that
auto-cross-checks uploaded PDFs against the receiving log and accounting codes.
It exposes four screens: **Inbox** (a 3-column surface with invoice list,
document preview, and extracted-data panel), **Reconciliation** (side-by-side
diff between invoice lines and receiving log), **Suppliers** (vendor → accounting
code mapping), and **Analytics** (weekly summary stats). The primary click flow
is: select a row in the inbox list, see the document update and the extracted
fields update on the right; on a `mismatch` row, click *View details* to open a
right-side drawer with the line items and approve/flag actions.

Everything is mocked. Vendor names are `Vendor A`–`Vendor E`, SKUs come from the
shared `inventory.ts` placeholders, invoice IDs are `INV-0001`–`INV-0008`, and
all monetary amounts are synthetic. No backend calls, no real accounting or
inventory integration. The three-column layout uses CSS grid sized at 25% / 1fr /
30% and matches the production app's `ResizablePanelGroup` anatomy.

## NDA

Synthetic data only. Brand identity, layout conventions, and component
vocabulary are derived from the production app's visual style — no production
code, schemas, integrations, or fixtures are committed to this repository.