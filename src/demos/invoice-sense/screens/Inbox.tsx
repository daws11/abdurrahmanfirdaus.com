// src/demos/invoice-sense/screens/Inbox.tsx
//
// The Inbox is the canonical Invoice Sense screen — a single full-height
// 3-column surface:
//   [ invoice list 25% ][ document preview 45% ][ data panel 30% ]
//
// Production layout reference (read for anatomy, not transcribed):
//   - Column 1: status filter pills (All / Matched / Mismatch / Pending),
//     payment type switcher (ALL / PCC / PCO / TF), search, filter row,
//     virtualized list rows with tag dot + checkbox + supplier + status
//     + total + date + invoice number + source.
//   - Column 2: header with title + page nav + zoom + rotate + download,
//     canvas area showing a PDF-like invoice mock.
//   - Column 3: tab switch (Data / Status), edited field grid, line items
//     table, subtotal/tax/total, line items sheet.

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeftRight,
  Banknote,
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
  Package,
  RefreshCw,
  RotateCw,
  Save,
  Search,
  ShoppingCart,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/demos/_shared/Button";
import { StatTile } from "@/demos/_shared/StatTile";
import { EmptyState } from "@/demos/_shared/EmptyState";
import { Sheet } from "@/demos/_shared/Sheet";
import { findOutlet } from "@/demos/_shared/fixtures/inventory";
import {
  INVOICES,
  STOCK_ENTRIES,
  invoiceTotal,
  fmtCurrency,
  mismatchLabel,
  sourceLabel,
  paymentTypeLabel,
  paymentTypeShort,
  tagLabel,
  tagDotClass,
  type Invoice,
  type InvoiceStatus,
} from "../mocks";

// ---------------------------------------------------------------------------
// Status filter pills (All / Matched / Mismatch / Pending) with counts
// ---------------------------------------------------------------------------

type StatusFilter = "all" | InvoiceStatus;

const STATUS_FILTERS: { id: StatusFilter; label: string; tone: "neutral" | "ok" | "bad" | "warn" }[] = [
  { id: "all", label: "All", tone: "neutral" },
  { id: "matched", label: "Matched", tone: "ok" },
  { id: "mismatch", label: "Mismatch", tone: "bad" },
  { id: "pending", label: "Pending", tone: "warn" },
];

// ---------------------------------------------------------------------------
// Payment type switcher (mirrors production's PCC / PCO / TF segmented control)
// ---------------------------------------------------------------------------

type PaymentFilter = "all" | "cash_central" | "cash_outlet" | "transfer";

const PAYMENT_FILTERS: { id: PaymentFilter; label: string; icon?: any }[] = [
  { id: "all", label: "ALL" },
  { id: "cash_central", label: "PCC", icon: Banknote },
  { id: "cash_outlet", label: "PCO", icon: Banknote },
  { id: "transfer", label: "TF", icon: ArrowLeftRight },
];

// ---------------------------------------------------------------------------
// Status / source helpers
// ---------------------------------------------------------------------------

function StatusBadge({ status, size = "sm" }: { status: InvoiceStatus; size?: "sm" | "md" }) {
  // Production uses `bg-chart-2/10 text-chart-2 border-chart-2/20` (green)
  // and `bg-chart-4/10 text-chart-4 border-chart-4/20` (orange). We map
  // these to our existing theme tokens (--ok and --warn).
  const Icon =
    status === "matched" ? CheckCircle2 : status === "mismatch" ? AlertCircle : Loader2;
  const tone =
    status === "matched" ? "ok" : status === "mismatch" ? "bad" : "warn";
  const label = status === "matched" ? "Scanned" : status === "mismatch" ? "Review" : "Processing";
  const cls =
    size === "md"
      ? "gap-1.5 px-2 py-0.5 text-xs font-medium"
      : "gap-1 px-1.5 py-0.5 text-[10px] font-medium";
  return (
    <span
      className={`inline-flex items-center rounded-md border ${cls}`}
      style={{
        borderColor:
          tone === "ok"
            ? "color-mix(in oklab, var(--ok) 30%, transparent)"
            : tone === "bad"
              ? "color-mix(in oklab, var(--bad) 30%, transparent)"
              : "color-mix(in oklab, var(--warn) 30%, transparent)",
        backgroundColor:
          tone === "ok"
            ? "color-mix(in oklab, var(--ok) 10%, transparent)"
            : tone === "bad"
              ? "color-mix(in oklab, var(--bad) 10%, transparent)"
              : "color-mix(in oklab, var(--warn) 10%, transparent)",
        color:
          tone === "ok"
            ? "var(--ok)"
            : tone === "bad"
              ? "var(--bad)"
              : "var(--warn)",
      }}
    >
      <Icon className={`h-3 w-3 ${status === "pending" ? "animate-spin" : ""}`} />
      {label}
    </span>
  );
}

function SourceIcon({ source, className }: { source: Invoice["source"]; className?: string }) {
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
  return <Icon className={className ?? "h-3 w-3"} />;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Inbox() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(INVOICES[0].id);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [zoom, setZoom] = useState(100);
  // Below md, the 3-pane surface shows one pane at a time instead of
  // squeezing list/document/data into fixed-percentage columns.
  const [mobilePane, setMobilePane] = useState<"list" | "document" | "data">("list");

  function selectInvoice(id: string) {
    setSelectedId(id);
    setMobilePane("document");
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INVOICES.filter((inv) => {
      if (statusFilter !== "all" && inv.status !== statusFilter) return false;
      if (paymentFilter !== "all" && inv.paymentType !== paymentFilter) return false;
      if (!q) return true;
      return (
        inv.id.toLowerCase().includes(q) ||
        inv.vendor.toLowerCase().includes(q) ||
        inv.vendorCode.toLowerCase().includes(q) ||
        inv.lines.some((l) => l.sku.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q))
      );
    });
  }, [statusFilter, paymentFilter, query]);

  const counts = useMemo(() => {
    const within = INVOICES.filter(
      (inv) => paymentFilter === "all" || inv.paymentType === paymentFilter,
    );
    const total = within.reduce((s, inv) => s + invoiceTotal(inv), 0);
    return {
      all: within.length,
      matched: within.filter((i) => i.status === "matched").length,
      mismatch: within.filter((i) => i.status === "mismatch").length,
      pending: within.filter((i) => i.status === "pending").length,
      total,
    };
  }, [paymentFilter]);

  const selected = INVOICES.find((i) => i.id === selectedId) ?? INVOICES[0];
  const selectedStock = useMemo(
    () => STOCK_ENTRIES.filter((s) => selected.lines.some((l) => l.sku === s.sku)),
    [selected],
  );

  // For the right panel "Receiver" field, derive from the stock entry's outlet
  // (whichever outlet received the first line item on this invoice).
  const receiverOutlet = useMemo(() => {
    const first = selectedStock[0];
    return first ? findOutlet(first.outlet) : null;
  }, [selectedStock]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Optional top stat strip — light summary, mimics production's
          "X Documents" treatment without becoming data-heavy. */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-4 md:grid-cols-4 md:px-6 md:pt-6">
        <StatTile
          label="Invoices"
          value={counts.all}
          detail="this period"
          tone="info"
          icon={<FileText className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Scanned"
          value={counts.matched}
          detail={`${Math.round((counts.matched / Math.max(counts.all, 1)) * 100)}% auto`}
          tone="ok"
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
        />
        <StatTile
          label="Mismatch"
          value={counts.mismatch}
          detail="needs review"
          tone="bad"
        />
        <StatTile
          label="Pending"
          value={counts.pending}
          detail="in queue"
          tone="warn"
        />
      </div>

      {/* Mobile-only pane switcher — back to list + document/data tabs.
          Desktop shows all 3 panes side by side, so this stays hidden there. */}
      {mobilePane !== "list" && (
        <div
          className="mt-4 flex items-center gap-2 border-t px-4 py-2 md:hidden"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            type="button"
            onClick={() => setMobilePane("list")}
            className="flex items-center gap-1 text-[12px] font-medium"
            style={{ color: "var(--muted)" }}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <div
            className="ml-auto flex gap-1 rounded-md p-0.5"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <button
              type="button"
              onClick={() => setMobilePane("document")}
              className="rounded px-2 py-1 text-[11px] font-medium"
              style={{
                backgroundColor: mobilePane === "document" ? "var(--bg)" : "transparent",
                color: mobilePane === "document" ? "var(--fg)" : "var(--muted)",
              }}
            >
              Document
            </button>
            <button
              type="button"
              onClick={() => setMobilePane("data")}
              className="rounded px-2 py-1 text-[11px] font-medium"
              style={{
                backgroundColor: mobilePane === "data" ? "var(--bg)" : "transparent",
                color: mobilePane === "data" ? "var(--fg)" : "var(--muted)",
              }}
            >
              Data
            </button>
          </div>
        </div>
      )}

      {/* 3-column surface — fills the remaining height. Below md, only the
          active mobilePane is shown; at md+ all 3 columns render side by side. */}
      <div
        className={cn(
          "grid flex-1 min-h-0 overflow-hidden md:grid-cols-[25%_1fr_30%]",
          mobilePane === "list" && "mt-4 border-t",
        )}
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg)",
        }}
      >
        {/* ---------- Column 1: Invoice list ---------- */}
        <aside
          className={cn(
            mobilePane === "list" ? "flex" : "hidden",
            "min-w-0 flex-col md:flex md:border-r",
          )}
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
        >
          {/* List header: payment type switcher + search + filter */}
          <div
            className="flex flex-col gap-3 border-b p-4"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Status filter pills — All / Matched / Mismatch / Pending with counts */}
            <div className="flex flex-wrap items-center gap-1.5">
              {STATUS_FILTERS.map((s) => {
                const active = statusFilter === s.id;
                const count = counts[s.id];
                const dotColor =
                  s.tone === "ok"
                    ? "var(--ok)"
                    : s.tone === "bad"
                      ? "var(--bad)"
                      : s.tone === "warn"
                        ? "var(--warn)"
                        : "var(--muted)";
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStatusFilter(s.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors"
                    style={{
                      borderColor: active ? "var(--accent)" : "var(--border)",
                      backgroundColor: active
                        ? "color-mix(in oklab, var(--accent) 10%, transparent)"
                        : "var(--bg)",
                      color: active ? "var(--accent)" : "var(--fg)",
                    }}
                  >
                    <span
                      className="block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: dotColor }}
                    />
                    {s.label}
                    <span
                      className="rounded-full px-1.5 text-[10px] tabular-nums"
                      style={{
                        backgroundColor: active
                          ? "color-mix(in oklab, var(--accent) 18%, transparent)"
                          : "var(--surface)",
                        color: active ? "var(--accent)" : "var(--muted)",
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Payment type segmented control */}
            <div className="flex flex-wrap gap-1 rounded-md p-1"
              style={{ backgroundColor: "var(--surface)" }}
            >
              {PAYMENT_FILTERS.map((p) => {
                const active = paymentFilter === p.id;
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentFilter(p.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-[4px] px-2 text-[10px] font-medium uppercase transition-colors"
                    style={{
                      height: 28,
                      backgroundColor: active ? "var(--bg)" : "transparent",
                      color: active ? "var(--fg)" : "var(--muted)",
                      border: active ? "1px solid var(--border)" : "1px solid transparent",
                      boxShadow: active ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
                    }}
                  >
                    {Icon && <Icon className="h-3 w-3" />}
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Search input (production: `pl-9` with magnifying glass) */}
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
                style={{ color: "var(--muted)" }}
              />
              <input
                type="search"
                placeholder="Search invoices..."
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

            {/* Count + filter button */}
            <div
              className="flex items-center justify-between text-[11px]"
              style={{ color: "var(--muted)" }}
            >
              <span>{filtered.length} documents</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-[var(--surface)]"
                style={{ color: "var(--muted)" }}
              >
                <Filter className="h-3 w-3" />
                Filter
              </button>
            </div>
          </div>

          {/* List items */}
          <ul className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="p-4">
                <EmptyState
                  title="No invoices found"
                  description="Upload invoices or clear filters."
                  icon={<FileText className="h-7 w-7" />}
                />
              </li>
            ) : (
              filtered.map((inv) => {
                const isSelected = inv.id === selectedId;
                const tag = inv.customTag;
                return (
                  <li
                    key={inv.id}
                    onClick={() => selectInvoice(inv.id)}
                    className="cursor-pointer border-b px-4 py-3 transition-colors"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: isSelected
                        ? "color-mix(in oklab, var(--accent) 6%, transparent)"
                        : "transparent",
                      borderLeft: isSelected ? "2px solid var(--accent)" : "2px solid transparent",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Tag indicator dot + selection checkbox column */}
                      <div className="flex flex-col items-center gap-2 pt-0.5">
                        <span
                          className={`block h-3 w-3 rounded-full ${tagDotClass(tag)}`}
                          title={tagLabel(tag)}
                        />
                        <input
                          type="checkbox"
                          checked={selectedIds.has(inv.id)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleSelect(inv.id)}
                          className="h-3.5 w-3.5 cursor-pointer accent-[var(--accent)]"
                          aria-label={`Select ${inv.id}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <h4
                            className="truncate text-[13px] font-semibold"
                            style={{
                              color: isSelected ? "var(--accent)" : "var(--fg)",
                            }}
                          >
                            {inv.vendor}
                          </h4>
                          <div className="flex flex-shrink-0 items-center gap-1">
                            <StatusBadge status={inv.status} />
                          </div>
                        </div>

                        <div className="flex items-end justify-between">
                          <div
                            className="space-y-1 text-[11px]"
                            style={{ color: "var(--muted)" }}
                          >
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" />
                              <span>{inv.date}</span>
                              <span style={{ opacity: 0.4 }}>·</span>
                              <span
                                className="truncate font-mono"
                                title={`#${inv.id}`}
                                style={{ opacity: 0.85 }}
                              >
                                #{inv.id}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <SourceIcon source={inv.source} className="h-3 w-3" />
                              <span className="max-w-[140px] truncate">
                                {sourceLabel(inv.source)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className="font-mono text-[12px] font-bold tabular-nums"
                              style={{ color: "var(--fg)" }}
                            >
                              {fmtCurrency(invoiceTotal(inv), inv.currency)}
                            </div>
                            <div
                              className="mt-0.5 text-[10px] uppercase tracking-wider"
                              style={{ color: "var(--muted)" }}
                            >
                              {paymentTypeShort(inv.paymentType)}
                            </div>
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

        {/* ---------- Column 2: Document preview ---------- */}
        <section
          className={cn(
            mobilePane === "document" ? "flex" : "hidden",
            "min-w-0 flex-col md:flex md:border-r",
          )}
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
        >
          <header
            className="flex h-12 flex-shrink-0 items-center gap-2 border-b px-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
          >
            <h2
              className="truncate text-[13px] font-semibold"
              style={{ color: "var(--fg)" }}
            >
              {selected.vendor || "Invoice"}
            </h2>
            <span
              className="text-[11px]"
              style={{ color: "var(--muted)" }}
            >
              · 1 page
            </span>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]"
                style={{ color: "var(--muted)" }}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span
                className="w-16 text-center font-mono text-[11px]"
                style={{ color: "var(--muted)" }}
              >
                1 / 1
              </span>
              <button
                type="button"
                aria-label="Next page"
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]"
                style={{ color: "var(--muted)" }}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div
                className="mx-1 h-4 w-px"
                style={{ backgroundColor: "var(--border)" }}
              />
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => setZoom((z) => Math.max(z - 25, 50))}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]"
                style={{ color: "var(--muted)" }}
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span
                className="w-12 text-center font-mono text-[11px]"
                style={{ color: "var(--muted)" }}
              >
                {zoom}%
              </span>
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => setZoom((z) => Math.min(z + 25, 200))}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]"
                style={{ color: "var(--muted)" }}
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <div
                className="mx-1 h-4 w-px"
                style={{ backgroundColor: "var(--border)" }}
              />
              <button
                type="button"
                aria-label="Rotate"
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]"
                style={{ color: "var(--muted)" }}
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Download"
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]"
                style={{ color: "var(--muted)" }}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6">
            <DocumentMock invoice={selected} />
          </div>
        </section>

        {/* ---------- Column 3: Data panel ---------- */}
        <aside
          className={cn(mobilePane === "data" ? "flex" : "hidden", "min-w-0 flex-col md:flex")}
          style={{ backgroundColor: "var(--bg)" }}
        >
          <header
            className="flex h-12 flex-shrink-0 items-center gap-2 border-b px-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--fg)",
                border: "1px solid var(--border)",
                height: 28,
              }}
            >
              <FileText className="h-3 w-3" />
              Data
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium"
              style={{ color: "var(--muted)", height: 28 }}
            >
              Status
            </button>
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setDetailOpen(true)}
              >
                Line items
              </Button>
              <button
                type="button"
                aria-label="Actions"
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[var(--surface)]"
                style={{ color: "var(--muted)" }}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              <Button size="sm" variant="primary">
                <Save className="h-3.5 w-3.5" />
                {selected.status === "matched" ? "Save" : "Approve"}
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            {/* Confidence + status header */}
            <div
              className="flex items-center gap-2 rounded-md border p-3"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
                margin: 16,
              }}
            >
              <span
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold"
                style={{
                  backgroundColor:
                    selected.confidence >= 90
                      ? "color-mix(in oklab, var(--ok) 12%, transparent)"
                      : "color-mix(in oklab, var(--warn) 12%, transparent)",
                  color:
                    selected.confidence >= 90 ? "var(--ok)" : "var(--warn)",
                }}
              >
                {selected.confidence >= 90 ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5" />
                )}
                {selected.confidence}%
              </span>
              <span
                className="text-[11px] font-medium"
                style={{ color: "var(--muted)" }}
              >
                {selected.confidence >= 90
                  ? "High confidence"
                  : "Review recommended"}
              </span>
              <div
                className="ml-auto h-4 w-px"
                style={{ backgroundColor: "var(--border)" }}
              />
              <span
                className="text-[10px] uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                Reconcile with
              </span>
              <select
                className="h-7 rounded-md border px-1.5 text-[11px]"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg)",
                  color: "var(--fg)",
                }}
                defaultValue={selected.reconcile ? "inventory_app" : "internal_map"}
              >
                <option value="inventory_app">Inventory App</option>
                <option value="internal_map">Internal Map (auto-mapping)</option>
              </select>
            </div>

            {/* Field pairs — milestone receipts (sent / received / matched) */}
            <div
              className="mx-4 mt-1 grid grid-cols-3 gap-2 rounded-md border p-3 text-[11px]"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg)",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "color-mix(in oklab, var(--ok) 14%, transparent)",
                    color: "var(--ok)",
                  }}
                >
                  <Cloud className="h-3 w-3" />
                </span>
                <div className="flex flex-col">
                  <span style={{ color: "var(--muted)" }}>Sent</span>
                  <span
                    className="font-mono tabular-nums"
                    style={{ color: "var(--fg)" }}
                  >
                    {selected.date}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "color-mix(in oklab, var(--accent) 14%, transparent)",
                    color: "var(--accent)",
                  }}
                >
                  <FileText className="h-3 w-3" />
                </span>
                <div className="flex flex-col">
                  <span style={{ color: "var(--muted)" }}>Scanned</span>
                  <span
                    className="font-mono tabular-nums"
                    style={{ color: "var(--fg)" }}
                  >
                    {selected.date}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      selected.status === "matched"
                        ? "color-mix(in oklab, var(--ok) 14%, transparent)"
                        : selected.status === "mismatch"
                          ? "color-mix(in oklab, var(--bad) 14%, transparent)"
                          : "color-mix(in oklab, var(--warn) 14%, transparent)",
                    color:
                      selected.status === "matched"
                        ? "var(--ok)"
                        : selected.status === "mismatch"
                          ? "var(--bad)"
                          : "var(--warn)",
                  }}
                >
                  {selected.status === "matched" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : selected.status === "mismatch" ? (
                    <AlertCircle className="h-3 w-3" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                </span>
                <div className="flex flex-col">
                  <span style={{ color: "var(--muted)" }}>Matched</span>
                  <span
                    className="font-mono tabular-nums"
                    style={{ color: "var(--fg)" }}
                  >
                    {selected.status === "pending" ? "—" : selected.date}
                  </span>
                </div>
              </div>
            </div>

            {/* Field grid */}
            <div className="grid grid-cols-2 gap-3 px-4">
              <FieldCell
                label="Supplier"
                value={`${selected.vendor} (${selected.vendorCode})`}
                icon={<FileText className="h-3 w-3" />}
              />
              <FieldCell
                label="Receiver"
                value={receiverOutlet ? `${receiverOutlet.name} · ${receiverOutlet.code}` : "—"}
                icon={<Package className="h-3 w-3" />}
              />
              <FieldCell label="Invoice #" value={selected.id} mono />
              <FieldCell label="Generated #" value={tagLabel(selected.customTag) === "Matching" ? `IS-${selected.id.slice(-3)}` : "—"} mono />
              <FieldCell label="Currency" value={selected.currency} />
              <FieldCell label="Date" value={selected.date} />
              <FieldCell label="Due date" value={selected.dueDate} />
              <FieldCell label="Uploaded" value={selected.date} mono />
              <FieldCell label="Source" value={sourceLabel(selected.source)} icon={<SourceIcon source={selected.source} className="h-3 w-3" />} />
              <FieldCell label="Payment type" value={paymentTypeLabel(selected.paymentType)} />
            </div>

            {/* Mismatch banner */}
            {selected.status === "mismatch" && (
              <div
                className="mt-4 rounded-md border p-3"
                style={{
                  borderColor: "var(--bad)",
                  backgroundColor:
                    "color-mix(in oklab, var(--bad) 8%, transparent)",
                  margin: "0 16px",
                }}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle
                    className="h-3.5 w-3.5"
                    style={{ color: "var(--bad)" }}
                  />
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--bad)" }}
                  >
                    Mismatch detected
                  </span>
                </div>
                <p
                  className="mt-2 text-[12px] leading-snug"
                  style={{ color: "var(--fg)" }}
                >
                  {mismatchLabel(selected.mismatchField)} — compare the invoice
                  value with the receiving log below.
                </p>
              </div>
            )}

            {/* Line items */}
            <div className="mt-5 px-4">
              <div className="mb-2 flex items-center justify-between">
                <h3
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "var(--muted)" }}
                >
                  Line items
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="rounded-md px-1.5 py-0.5 text-[11px] hover:bg-[var(--surface)]"
                    style={{ color: "var(--muted)" }}
                  >
                    Account
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-1.5 py-0.5 text-[11px] hover:bg-[var(--surface)]"
                    style={{ color: "var(--muted)" }}
                  >
                    Remap
                  </button>
                </div>
              </div>
              <div
                className="overflow-hidden rounded-md border"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr
                      className="border-b"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                    >
                      <th
                        className="px-2 py-1.5 text-left font-medium uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Desc
                      </th>
                      <th
                        className="px-2 py-1.5 text-right font-medium uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Qty
                      </th>
                      <th
                        className="px-2 py-1.5 text-right font-medium uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Unit
                      </th>
                      <th
                        className="px-2 py-1.5 text-right font-medium uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Price
                      </th>
                      <th
                        className="px-2 py-1.5 text-right font-medium uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.lines.map((l, i) => {
                      const disagree =
                        selected.status === "mismatch" &&
                        i === 0 &&
                        selected.mismatchField !== "total";
                      return (
                        <tr
                          key={`${l.sku}-${i}`}
                          className="border-b last:border-b-0"
                          style={{
                            borderColor: "var(--border)",
                            backgroundColor: disagree
                              ? "color-mix(in oklab, var(--bad) 6%, transparent)"
                              : "transparent",
                          }}
                        >
                          <td className="px-2 py-1.5" style={{ color: "var(--fg)" }}>
                            <div className="font-medium">{l.desc}</div>
                            <div className="font-mono text-[10px]" style={{ color: "var(--muted)" }}>
                              {l.sku}
                            </div>
                          </td>
                          <td className="px-2 py-1.5 text-right font-mono tabular-nums" style={{ color: "var(--fg)" }}>
                            {l.qty}
                          </td>
                          <td className="px-2 py-1.5 text-right" style={{ color: "var(--muted)" }}>
                            {l.unit}
                          </td>
                          <td className="px-2 py-1.5 text-right font-mono tabular-nums" style={{ color: "var(--fg)" }}>
                            {l.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-2 py-1.5 text-right font-mono font-semibold tabular-nums" style={{ color: "var(--fg)" }}>
                            {l.total.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </div>
            </div>

            {/* Subtotal / tax / total */}
            <div
              className="mt-3 space-y-2 border-t px-4 py-3"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex justify-between text-[12px]">
                <span style={{ color: "var(--muted)" }}>Subtotal</span>
                <span className="font-mono" style={{ color: "var(--fg)" }}>
                  {fmtCurrency(selected.subtotal, selected.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span style={{ color: "var(--muted)" }}>Tax</span>
                <span className="font-mono" style={{ color: "var(--fg)" }}>
                  {fmtCurrency(selected.tax, selected.currency)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 text-[14px] font-bold" style={{ borderColor: "var(--border)" }}>
                <span>Total</span>
                <span className="font-mono" style={{ color: "var(--fg)" }}>
                  {fmtCurrency(invoiceTotal(selected), selected.currency)}
                </span>
              </div>
            </div>

            {/* Receiving log */}
            <div className="mt-3 px-4 pb-6">
              <h3
                className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted)" }}
              >
                Receiving log
              </h3>
              <ul
                className="overflow-hidden rounded-md border"
                style={{ borderColor: "var(--border)" }}
              >
                {selectedStock.map((s, idx) => {
                  const disagree = s.loggedQty !== s.invoicedQty;
                  return (
                    <li
                      key={`${s.sku}-${s.outlet}-${idx}`}
                      className="flex items-center gap-2 border-b px-3 py-2 text-[12px] last:border-b-0"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: disagree
                          ? "color-mix(in oklab, var(--bad) 8%, transparent)"
                          : "transparent",
                      }}
                    >
                      <span
                        className="font-mono text-[11px] tabular-nums"
                        style={{ color: "var(--muted)" }}
                      >
                        {s.sku}
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: "var(--fg)" }}
                      >
                        {s.outlet}
                      </span>
                      <span
                        className="ml-auto tabular-nums"
                        style={{
                          color: disagree ? "var(--bad)" : "var(--muted)",
                        }}
                      >
                        logged {s.loggedQty} · invoiced {s.invoicedQty}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Line items drawer */}
      <Sheet
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={`${selected.id} — line items`}
        width={460}
      >
        <ul
          className="overflow-hidden rounded-md border"
          style={{ borderColor: "var(--border)" }}
        >
          {selected.lines.map((l, i) => (
            <li
              key={`${l.sku}-${i}`}
              className="flex items-center gap-2 border-b px-3 py-2 text-[12px] last:border-b-0"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="font-mono text-[11px] tabular-nums"
                style={{ color: "var(--muted)" }}
              >
                {l.sku}
              </span>
              <span className="flex-1 truncate" style={{ color: "var(--fg)" }}>
                {l.desc}
              </span>
              <span
                className="ml-auto font-mono tabular-nums"
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
          ))}
        </ul>
        <div
          className="mt-3 flex items-center justify-between border-t pt-3"
          style={{ borderColor: "var(--border)" }}
        >
          <span
            className="text-[11px] uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Subtotal
          </span>
          <span
            className="font-mono text-[12px]"
            style={{ color: "var(--fg)" }}
          >
            {fmtCurrency(selected.subtotal, selected.currency)}
          </span>
        </div>
        <div
          className="mt-1 flex items-center justify-between"
        >
          <span
            className="text-[11px] uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Tax
          </span>
          <span
            className="font-mono text-[12px]"
            style={{ color: "var(--fg)" }}
          >
            {fmtCurrency(selected.tax, selected.currency)}
          </span>
        </div>
        <div
          className="mt-2 flex items-center justify-between border-t pt-3"
          style={{ borderColor: "var(--border)" }}
        >
          <span
            className="text-[11px] uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Total
          </span>
          <span
            className="font-mono text-[14px] font-semibold"
            style={{ color: "var(--fg)" }}
          >
            {fmtCurrency(invoiceTotal(selected), selected.currency)}
          </span>
        </div>
      </Sheet>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FieldCell({
  label,
  value,
  mono,
  icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div
        className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        {icon}
        {label}
      </div>
      <div
        className={`text-[12px] ${mono ? "font-mono tabular-nums" : ""}`}
        style={{ color: "var(--fg)" }}
      >
        {value}
      </div>
    </div>
  );
}

function DocumentMock({ invoice }: { invoice: Invoice }) {
  return (
    <div
      className="mx-auto max-w-[640px] rounded-lg border bg-white p-8 shadow-sm"
      style={{
        borderColor: "var(--border)",
        color: "var(--fg)",
      }}
    >
      <div
        className="flex items-start gap-3 border-b pb-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--accent-fg)",
          }}
        >
          {invoice.vendor.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold" style={{ color: "var(--fg)" }}>
            {invoice.vendor}
          </div>
          <div className="text-[11px]" style={{ color: "var(--muted)" }}>
            Invoice {invoice.id} · Issued {invoice.date}
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Total
          </div>
          <div
            className="font-mono text-lg font-semibold tabular-nums"
            style={{ color: "var(--fg)" }}
          >
            {fmtCurrency(invoiceTotal(invoice), invoice.currency)}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-[12px]">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Bill to
          </div>
          <div className="mt-1" style={{ color: "var(--fg)" }}>
            Demo Company
            <br />
            1 Demo Street
            <br />
            Demo City
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Due
          </div>
          <div className="mt-1 font-mono tabular-nums" style={{ color: "var(--fg)" }}>
            {invoice.dueDate}
          </div>
        </div>
      </div>

      <table className="mt-6 w-full text-[12px]">
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--border)" }}>
            <th
              className="pb-2 text-left text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              SKU
            </th>
            <th
              className="pb-2 text-right text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              Qty
            </th>
            <th
              className="pb-2 text-right text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              Unit
            </th>
            <th
              className="pb-2 text-right text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              Price
            </th>
            <th
              className="pb-2 text-right text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.lines.map((l, i) => (
            <tr
              key={`${l.sku}-${i}`}
              className="border-b last:border-b-0"
              style={{ borderColor: "var(--border)" }}
            >
              <td className="py-2" style={{ color: "var(--fg)" }}>
                <div className="font-mono text-[11px] tabular-nums">{l.sku}</div>
                <div className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {l.desc}
                </div>
              </td>
              <td className="py-2 text-right font-mono tabular-nums" style={{ color: "var(--fg)" }}>
                {l.qty}
              </td>
              <td className="py-2 text-right" style={{ color: "var(--muted)" }}>
                {l.unit}
              </td>
              <td className="py-2 text-right font-mono tabular-nums" style={{ color: "var(--fg)" }}>
                {l.unitPrice.toFixed(2)}
              </td>
              <td className="py-2 text-right font-mono font-semibold tabular-nums" style={{ color: "var(--fg)" }}>
                {l.total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className="mt-6 flex items-center justify-between border-t pt-4 text-[12px]"
        style={{ borderColor: "var(--border)" }}
      >
        <span style={{ color: "var(--muted)" }}>Currency</span>
        <span className="font-medium tabular-nums">{invoice.currency}</span>
      </div>
    </div>
  );
}
