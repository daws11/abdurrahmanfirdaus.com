// src/demos/invoice-sense/screens/PaymentRequest.tsx
// @ts-nocheck
//
// Production page (client/src/pages/payment-request.tsx) is a 3-column surface
// identical to the Inbox tab but filtered to `tag = "payment_request"` and
// `archived = true`. The right panel header reads "Payment Request" and has a
// "Checklist → Send to Invoices" CTA that toggles the row back into Inbox.
//
// We render the production anatomy with synthetic data drawn from the same
// fixtures — a payment-request source, archived flag, and "payment_request"
// custom tag form the filter criteria.

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Download,
  FileText,
  Filter,
  Link2,
  Loader2,
  MessageSquare,
  MoreVertical,
  RotateCw,
  Search,
  Send,
  ShoppingCart,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { findOutlet } from "@/demos/_shared/fixtures/inventory";
import {
  INVOICES,
  STOCK_ENTRIES,
  invoiceTotal,
  fmtCurrency,
  sourceLabel,
  paymentTypeShort,
  statusLabel,
  tagDotClass,
  type Invoice,
  type InvoiceStatus,
} from "../mocks";

const QUEUE = INVOICES.filter(
  (i) => i.customTag === "payment_request" && i.archived === true,
);

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const Icon =
    status === "verified"
      ? CheckCircle2
      : status === "processing"
        ? Loader2
        : AlertCircle;
  const tone =
    status === "verified"
      ? "ok"
      : status === "error"
        ? "bad"
        : status === "needs_review"
          ? "warn"
          : "info";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium"
      style={{
        borderColor: `color-mix(in oklab, var(--${tone}) 30%, transparent)`,
        backgroundColor: `color-mix(in oklab, var(--${tone}) 10%, transparent)`,
        color: `var(--${tone})`,
      }}
    >
      <Icon className={`h-3 w-3 ${status === "processing" ? "animate-spin" : ""}`} />
      {statusLabel(status)}
    </span>
  );
}

function SourceIcon({ source }: { source: Invoice["source"] }) {
  const Icon =
    source === "whatsapp"
      ? MessageSquare
      : source === "inventory_webhook"
        ? Link2
        : source === "google_drive"
          ? Cloud
          : source === "ecommerce"
            ? ShoppingCart
            : Upload;
  return <Icon className="h-3 w-3" />;
}

export function PaymentRequest() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(QUEUE[0]?.id ?? INVOICES[0].id);
  const [zoom, setZoom] = useState(100);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return QUEUE;
    return QUEUE.filter(
      (inv) =>
        inv.id.toLowerCase().includes(q) ||
        inv.vendor.toLowerCase().includes(q) ||
        (inv.invoiceNumber ?? "").toLowerCase().includes(q),
    );
  }, [query]);

  const selected = useMemo(
    () =>
      QUEUE.find((i) => i.id === selectedId) ??
      INVOICES.find((i) => i.id === selectedId) ??
      INVOICES[0],
    [selectedId],
  );

  const selectedStock = useMemo(
    () => STOCK_ENTRIES.filter((s) => selected.lines.some((l) => l.sku === s.sku)).slice(0, 4),
    [selected],
  );
  const receiverOutlet = useMemo(() => {
    const first = selectedStock[0];
    return first ? findOutlet(first.outlet) : null;
  }, [selectedStock]);

  const totalAmount = useMemo(
    () => QUEUE.reduce((s, i) => s + invoiceTotal(i), 0),
    [],
  );

  return (
    <div className="flex h-full w-full flex-col">
      {/* Page header — production: "Payment Request" + checklist banner */}
      <div
        className="flex flex-shrink-0 items-center justify-between border-b px-4 py-3"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
      >
        <div>
          <h1 className="text-[14px] font-semibold">Payment Request</h1>
          <p className="text-[11px]" style={{ color: "var(--muted)" }}>
            {QUEUE.length} archived invoices · {fmtCurrency(totalAmount)} pending transfer to inbox
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
            style={{
              borderColor: "color-mix(in oklab, var(--accent) 30%, transparent)",
              backgroundColor: "color-mix(in oklab, var(--accent) 10%, transparent)",
              color: "var(--accent)",
            }}
          >
            archived = on
          </span>
          <Button size="sm" variant="primary">
            <Send className="h-3.5 w-3.5" />
            Send all to Invoices
          </Button>
        </div>
      </div>

      <div
        className="grid flex-1 min-h-0 overflow-hidden"
        style={{ gridTemplateColumns: "25% 1fr 30%", backgroundColor: "var(--bg)" }}
      >
        {/* ---------- Column 1: Request queue ---------- */}
        <aside
          className="flex min-w-0 flex-col border-r"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
        >
          <div className="flex flex-col gap-3 border-b p-4" style={{ borderColor: "var(--border)" }}>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
                style={{ color: "var(--muted)" }}
              />
              <input
                type="search"
                placeholder="Search payment requests..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-8 w-full rounded-md border pl-8 pr-3 text-[12px] focus:outline-none focus:ring-1"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg)",
                  color: "var(--fg)",
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]" style={{ color: "var(--muted)" }}>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="h-3.5 w-3.5 cursor-pointer accent-[var(--accent)]" />
                <span>{filtered.length} Requests</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-[var(--surface)]"
                style={{ color: "var(--muted)" }}
              >
                <Filter className="h-3 w-3" />
                Filter
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="block h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                Tagged "Payment Request"
              </span>
            </div>
          </div>

          <ul className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="p-4 text-center text-[12px]" style={{ color: "var(--muted)" }}>
                No payment requests match.
              </li>
            ) : (
              filtered.map((inv) => {
                const isSelected = inv.id === selectedId;
                return (
                  <li
                    key={inv.id}
                    onClick={() => setSelectedId(inv.id)}
                    className="cursor-pointer border-b px-4 py-3"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: isSelected
                        ? "color-mix(in oklab, var(--accent) 6%, transparent)"
                        : "transparent",
                      borderLeft: isSelected ? "2px solid var(--accent)" : "2px solid transparent",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-2 pt-0.5">
                        <span className={`block h-3 w-3 rounded-full ${tagDotClass(inv.customTag)}`} />
                        <input
                          type="checkbox"
                          onClick={(e) => e.stopPropagation()}
                          className="h-3.5 w-3.5 cursor-pointer accent-[var(--accent)]"
                          aria-label={`Select ${inv.id}`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <h4
                            className="truncate text-[13px] font-semibold"
                            style={{ color: isSelected ? "var(--accent)" : "var(--fg)" }}
                          >
                            {inv.vendor}
                          </h4>
                          <StatusBadge status={inv.status} />
                        </div>
                        <div className="space-y-1 text-[11px]" style={{ color: "var(--muted)" }}>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            <span>{inv.date}</span>
                            {!!inv.invoiceNumber && (
                              <>
                                <span style={{ opacity: 0.4 }}>·</span>
                                <span className="truncate font-mono" title={`#${inv.invoiceNumber}`}>
                                  #{inv.invoiceNumber}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <SourceIcon source={inv.source} />
                            <span className="max-w-[140px] truncate">{sourceLabel(inv.source)}</span>
                          </div>
                        </div>
                        <div className="mt-1 flex items-end justify-between">
                          <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                            {paymentTypeShort(inv.paymentType)}
                          </div>
                          <div className="font-mono text-[12px] font-bold tabular-nums" style={{ color: "var(--fg)" }}>
                            {fmtCurrency(invoiceTotal(inv), inv.currency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </aside>

        {/* ---------- Column 2: Document preview (reuses Inbox style) ---------- */}
        <section
          className="flex min-w-0 flex-col border-r"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
        >
          <header
            className="flex h-12 flex-shrink-0 items-center gap-2 border-b px-4"
            style={{ borderColor: "var(--border)" }}
          >
            <h2 className="truncate text-[13px] font-semibold">{selected.vendor || "Invoice"}</h2>
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>
              · 1 page
            </span>
            <div className="ml-auto flex items-center gap-1">
              <button type="button" aria-label="Previous" className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]" style={{ color: "var(--muted)" }}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="w-16 text-center font-mono text-[11px]" style={{ color: "var(--muted)" }}>1 / 1</span>
              <button type="button" aria-label="Next" className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]" style={{ color: "var(--muted)" }}>
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="mx-1 h-4 w-px" style={{ backgroundColor: "var(--border)" }} />
              <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(z - 25, 50))} className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]" style={{ color: "var(--muted)" }}>
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-mono text-[11px]" style={{ color: "var(--muted)" }}>{zoom}%</span>
              <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(z + 25, 200))} className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]" style={{ color: "var(--muted)" }}>
                <ZoomIn className="h-4 w-4" />
              </button>
              <div className="mx-1 h-4 w-px" style={{ backgroundColor: "var(--border)" }} />
              <button type="button" aria-label="Rotate" className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]" style={{ color: "var(--muted)" }}>
                <RotateCw className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Download" className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]" style={{ color: "var(--muted)" }}>
                <Download className="h-4 w-4" />
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            <DocumentMock invoice={selected} />
          </div>
        </section>

        {/* ---------- Column 3: Data panel + "Send to Invoices" CTA ---------- */}
        <aside className="flex min-w-0 flex-col">
          <header
            className="flex h-12 flex-shrink-0 items-center gap-2 border-b px-4"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", height: 28 }}
            >
              <FileText className="h-3 w-3" /> Data
            </button>
            <button type="button" className="px-2 py-1 text-[11px] font-medium" style={{ color: "var(--muted)", height: 28 }}>
              Status
            </button>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="primary">
                <Send className="h-3.5 w-3.5" />
                Send to Invoices
              </Button>
              <button type="button" aria-label="Actions" className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]" style={{ color: "var(--muted)" }}>
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            {/* Checklist banner */}
            <div
              className="m-4 rounded-md border p-3"
              style={{
                borderColor: "color-mix(in oklab, var(--accent) 30%, transparent)",
                backgroundColor: "color-mix(in oklab, var(--accent) 8%, transparent)",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                  Payment request checklist
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px]" style={{ color: "var(--fg)" }}>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" style={{ color: "var(--ok)" }} /> Receipt attached
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" style={{ color: "var(--ok)" }} /> Vendor verified
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" style={{ color: "var(--ok)" }} /> Amount matches PO
                </li>
              </ul>
            </div>

            <div className="mt-1 grid grid-cols-2 gap-3 px-4">
              <Cell label="Supplier" value={`${selected.vendor} (${selected.vendorCode})`} />
              <Cell
                label="Receiver"
                value={receiverOutlet ? `${receiverOutlet.name} · ${receiverOutlet.code}` : selected.receiver ?? "—"}
              />
              <Cell label="Invoice #" value={selected.invoiceNumber ?? selected.id} mono />
              <Cell label="Generated #" value={selected.generatedInvoiceNumber ?? "—"} mono />
              <Cell label="Currency" value={selected.currency} />
              <Cell label="Date" value={selected.date} />
              <Cell label="Due date" value={selected.dueDate} />
              <Cell label="Source" value={sourceLabel(selected.source)} />
            </div>

            <div className="mt-5 px-4">
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                Line items
              </h3>
              <div className="overflow-hidden rounded-md border" style={{ borderColor: "var(--border)" }}>
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
                      <th className="px-2 py-1.5 text-left font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Desc</th>
                      <th className="px-2 py-1.5 text-right font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Qty</th>
                      <th className="px-2 py-1.5 text-right font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Price</th>
                      <th className="px-2 py-1.5 text-right font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.lines.map((l, i) => (
                      <tr key={i} className="border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
                        <td className="px-2 py-1.5" style={{ color: "var(--fg)" }}>
                          <div className="font-medium">{l.desc}</div>
                          <div className="font-mono text-[10px]" style={{ color: "var(--muted)" }}>{l.sku}</div>
                        </td>
                        <td className="px-2 py-1.5 text-right font-mono tabular-nums" style={{ color: "var(--fg)" }}>{l.qty}</td>
                        <td className="px-2 py-1.5 text-right font-mono tabular-nums" style={{ color: "var(--fg)" }}>{l.unitPrice.toFixed(2)}</td>
                        <td className="px-2 py-1.5 text-right font-mono font-semibold tabular-nums" style={{ color: "var(--fg)" }}>{l.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-3 space-y-2 border-t px-4 py-3" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between text-[12px]">
                <span style={{ color: "var(--muted)" }}>Subtotal</span>
                <span className="font-mono" style={{ color: "var(--fg)" }}>{fmtCurrency(selected.subtotal, selected.currency)}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span style={{ color: "var(--muted)" }}>Tax</span>
                <span className="font-mono" style={{ color: "var(--fg)" }}>{fmtCurrency(selected.tax, selected.currency)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-[14px] font-bold" style={{ borderColor: "var(--border)" }}>
                <span>Total</span>
                <span className="font-mono" style={{ color: "var(--fg)" }}>{fmtCurrency(invoiceTotal(selected), selected.currency)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Cell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className={`text-[12px] ${mono ? "font-mono tabular-nums" : ""}`} style={{ color: "var(--fg)" }}>
        {value}
      </div>
    </div>
  );
}

function DocumentMock({ invoice }: { invoice: Invoice }) {
  return (
    <div className="mx-auto max-w-[640px] rounded-lg border bg-white p-8 shadow-sm" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-start gap-3 border-b pb-4" style={{ borderColor: "var(--border)" }}>
        <div className="flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold" style={{ backgroundColor: "#f1f5f9", color: "#0f172a" }}>
          {invoice.vendor.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold" style={{ color: "var(--fg)" }}>{invoice.vendor}</div>
          <div className="text-[11px]" style={{ color: "var(--muted)" }}>
            Invoice {invoice.invoiceNumber ?? invoice.id} · Issued {invoice.date}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Total</div>
          <div className="font-mono text-lg font-semibold tabular-nums" style={{ color: "var(--fg)" }}>
            {fmtCurrency(invoiceTotal(invoice), invoice.currency)}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-[12px] md:grid-cols-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Bill to</div>
          <div className="mt-1" style={{ color: "var(--fg)" }}>Demo Company<br />1 Demo Street<br />Demo City</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Due</div>
          <div className="mt-1 font-mono tabular-nums" style={{ color: "var(--fg)" }}>{invoice.dueDate}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Currency</div>
          <div className="mt-1 font-mono tabular-nums" style={{ color: "var(--fg)" }}>{invoice.currency}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Payment type</div>
          <div className="mt-1" style={{ color: "var(--fg)" }}>{paymentTypeShort(invoice.paymentType)}</div>
        </div>
      </div>

      <table className="mt-6 w-full text-[12px]">
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--border)" }}>
            <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Description</th>
            <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Qty</th>
            <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Unit price</th>
            <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lines.map((l, i) => (
            <tr key={i} className="border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
              <td className="py-2">
                <div style={{ color: "var(--fg)" }}>{l.desc}</div>
                <div className="font-mono text-[10px]" style={{ color: "var(--muted)" }}>{l.sku}</div>
              </td>
              <td className="py-2 text-right font-mono tabular-nums" style={{ color: "var(--fg)" }}>{l.qty} {l.unit}</td>
              <td className="py-2 text-right font-mono tabular-nums" style={{ color: "var(--fg)" }}>{l.unitPrice.toFixed(2)}</td>
              <td className="py-2 text-right font-mono font-semibold tabular-nums" style={{ color: "var(--fg)" }}>{l.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t" style={{ borderColor: "var(--border)" }}>
            <td colSpan={3} className="pt-3 text-right text-[12px] font-bold uppercase tracking-widest">Total</td>
            <td className="border-t pt-3 text-right font-mono text-[14px] font-bold tabular-nums" style={{ color: "var(--fg)" }}>
              {fmtCurrency(invoiceTotal(invoice), invoice.currency)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
