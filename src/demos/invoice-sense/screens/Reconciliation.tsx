// src/demos/invoice-sense/screens/Reconciliation.tsx
//
// Reconciliation view — a 2-column diff: invoice lines vs receiving log
// entries. Disagreements (qty / total / sku) are highlighted with the
// mismatch color. A header strip shows the invoice being reconciled and
// toggles between invoices.

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeftRight,
  CheckCircle2,
  Minus,
} from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { EmptyState } from "@/demos/_shared/EmptyState";
import {
  INVOICES,
  STOCK_ENTRIES,
  invoiceTotal,
  fmtCurrency,
  statusLabel,
  statusTone,
  type Invoice,
  type StockEntry,
} from "../mocks";

function invoiceLinesForInvoice(inv: Invoice): StockEntry[] {
  return STOCK_ENTRIES.filter((s) =>
    inv.lines.some((l) => l.sku === s.sku),
  );
}

export function Reconciliation() {
  const [invoiceId, setInvoiceId] = useState<string>(
    INVOICES.find((i) => i.status === "mismatch")?.id ?? INVOICES[0].id,
  );
  const [hideMatched, setHideMatched] = useState(false);

  const invoice = INVOICES.find((i) => i.id === invoiceId) ?? INVOICES[0];
  const stockRows = useMemo(
    () => invoiceLinesForInvoice(invoice),
    [invoice],
  );

  const diffCount = useMemo(() => {
    let n = 0;
    for (const s of stockRows) {
      if (s.loggedQty !== s.invoicedQty) n++;
    }
    return n;
  }, [stockRows]);

  const visibleRows = useMemo(() => {
    if (!hideMatched) return stockRows;
    return stockRows.filter(
      (s) => s.loggedQty !== s.invoicedQty || invoice.status === "mismatch",
    );
  }, [stockRows, hideMatched, invoice]);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header strip */}
      <div
        className="mb-4 flex flex-wrap items-center gap-3 rounded-md border p-4"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <ArrowLeftRight
          className="h-4 w-4"
          style={{ color: "var(--accent)" }}
        />
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Reconciling
          </div>
          <div
            className="font-mono text-sm tabular-nums"
            style={{ color: "var(--fg)" }}
          >
            {invoice.id} · {invoice.vendor}
          </div>
        </div>
        <div className="ml-2 flex items-center gap-2">
          <Badge tone={statusTone(invoice.status)}>
            {statusLabel(invoice.status)}
          </Badge>
          <span
            className="text-[11px]"
            style={{ color: "var(--muted)" }}
          >
            {invoice.lines.length} lines · {diffCount} difference
            {diffCount === 1 ? "" : "s"}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <select
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            className="h-9 rounded-md border bg-transparent px-2 text-sm"
            style={{
              borderColor: "var(--border)",
              color: "var(--fg)",
            }}
          >
            {INVOICES.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id} — {i.vendor}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            variant={hideMatched ? "primary" : "secondary"}
            onClick={() => setHideMatched((h) => !h)}
          >
            {hideMatched ? "Showing only diffs" : "Show only diffs"}
          </Button>
        </div>
      </div>

      {/* Comparison grid */}
      <div
        className="grid overflow-hidden rounded-md border"
        style={{
          borderColor: "var(--border)",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {/* Invoice side */}
        <section
          className="border-r"
          style={{ borderColor: "var(--border)" }}
        >
          <header
            className="flex items-center gap-2 border-b px-4 py-2 text-[11px] font-semibold uppercase tracking-widest"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg)",
              color: "var(--muted)",
            }}
          >
            Invoice
            <span className="ml-auto tabular-nums">
              {fmtCurrency(invoiceTotal(invoice), invoice.currency)}
            </span>
          </header>
          <ul>
            {invoice.lines.map((l, i) => {
              const disagree =
                invoice.status === "mismatch" && i === 0 && invoice.mismatchField !== "total";
              return (
                <li
                  key={`${l.sku}-${i}`}
                  className="flex items-center gap-3 border-b px-4 py-2.5 text-[12px] last:border-b-0"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: disagree
                      ? "color-mix(in oklab, var(--bad) 8%, transparent)"
                      : "transparent",
                  }}
                >
                  {disagree ? (
                    <AlertCircle
                      className="h-3.5 w-3.5"
                      style={{ color: "var(--bad)" }}
                    />
                  ) : (
                    <CheckCircle2
                      className="h-3.5 w-3.5"
                      style={{ color: "var(--ok)" }}
                    />
                  )}
                  <span
                    className="font-mono tabular-nums"
                    style={{ color: "var(--fg)" }}
                  >
                    {l.sku}
                  </span>
                  <span
                    className="ml-auto tabular-nums"
                    style={{ color: "var(--muted)" }}
                  >
                    {l.qty} × {l.unitPrice.toFixed(2)}
                  </span>
                  <span
                    className="w-20 text-right font-semibold tabular-nums"
                    style={{ color: "var(--fg)" }}
                  >
                    {l.total.toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Stock side */}
        <section>
          <header
            className="flex items-center gap-2 border-b px-4 py-2 text-[11px] font-semibold uppercase tracking-widest"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg)",
              color: "var(--muted)",
            }}
          >
            Receiving log
            <span className="ml-auto">
              {visibleRows.length} entr{visibleRows.length === 1 ? "y" : "ies"}
            </span>
          </header>
          {visibleRows.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="Nothing to reconcile"
                description="No receiving entries for this invoice."
              />
            </div>
          ) : (
            <ul>
              {visibleRows.map((s, i) => {
                const disagree = s.loggedQty !== s.invoicedQty;
                return (
                  <li
                    key={`${s.sku}-${s.outlet}-${i}`}
                    className="flex items-center gap-3 border-b px-4 py-2.5 text-[12px] last:border-b-0"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: disagree
                        ? "color-mix(in oklab, var(--bad) 8%, transparent)"
                        : "transparent",
                    }}
                  >
                    {disagree ? (
                      <AlertCircle
                        className="h-3.5 w-3.5"
                        style={{ color: "var(--bad)" }}
                      />
                    ) : (
                      <CheckCircle2
                        className="h-3.5 w-3.5"
                        style={{ color: "var(--ok)" }}
                      />
                    )}
                    <span
                      className="font-mono tabular-nums"
                      style={{ color: "var(--fg)" }}
                    >
                      {s.sku}
                    </span>
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: "var(--bg)",
                        color: "var(--muted)",
                      }}
                    >
                      {s.outlet}
                    </span>
                    <span
                      className="ml-auto flex items-center gap-2 tabular-nums"
                      style={{
                        color: disagree ? "var(--bad)" : "var(--muted)",
                      }}
                    >
                      <span>logged {s.loggedQty}</span>
                      <Minus className="h-3 w-3" />
                      <span>invoiced {s.invoicedQty}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {invoice.status === "mismatch" && (
        <div
          className="mt-4 flex items-center gap-3 rounded-md border p-4 text-[12px]"
          style={{
            borderColor: "var(--bad)",
            backgroundColor:
              "color-mix(in oklab, var(--bad) 6%, transparent)",
            color: "var(--fg)",
          }}
        >
          <AlertCircle
            className="h-4 w-4 shrink-0"
            style={{ color: "var(--bad)" }}
          />
          <div>
            <span className="font-semibold" style={{ color: "var(--bad)" }}>
              {invoice.mismatchField === "qty" && "Quantity"}
              {invoice.mismatchField === "price" && "Unit price"}
              {invoice.mismatchField === "total" && "Subtotal"}
              {invoice.mismatchField === "sku" && "SKU code"}
            </span>{" "}
            disagrees with the receiving log. Confirm the source-of-truth before
            posting.
          </div>
        </div>
      )}
    </div>
  );
}