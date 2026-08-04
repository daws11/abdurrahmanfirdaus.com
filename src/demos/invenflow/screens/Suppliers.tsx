// src/demos/invenflow/screens/Suppliers.tsx
// @ts-nocheck
//
// Suppliers master-data table. Production Supplier shape: name, contactPerson,
// phoneNumber, address, bankAccount, bankName, averageDeliveryDays. We render
// derived columns (PO count, on-time %, lead-time variance) so the table looks
// dense and operationally honest. No network calls.

import { useMemo, useState } from "react";
import { Plus, Search, Download, Upload, Pencil } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { DataTable, type Column } from "@/demos/_shared/DataTable";
import { StatTile } from "@/demos/_shared/StatTile";
import { Field } from "@/demos/_shared/Field";
import {
  VENDOR_META,
  PURCHASE_ORDERS,
  RECEIVING_ROWS,
  type VendorMeta,
} from "../mocks";

interface SupplierRow extends VendorMeta {
  poCount: number;
  inFlightValue: number;
  onTimePct: number;
}

function fmtIDR(n: number): string {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
  return `Rp ${n}`;
}

function buildRows(): SupplierRow[] {
  const out: SupplierRow[] = VENDOR_META.map((v) => {
    const poCount = PURCHASE_ORDERS.filter((p) => p.vendor === v.code).length;
    const recRows = RECEIVING_ROWS.filter((r) => r.vendor === v.code);
    const received = recRows.filter((r) => r.status === "received").length;
    const onTimePct = recRows.length
      ? Math.round((received / recRows.length) * 100)
      : 92;
    const inFlightValue = PURCHASE_ORDERS.filter(
      (p) =>
        p.vendor === v.code && (p.stage === "purchase" || p.stage === "approve"),
    ).reduce((s, p) => s + p.total, 0);
    return {
      ...v,
      poCount,
      inFlightValue,
      onTimePct: v.leadTimeDays <= 3 ? Math.max(80, onTimePct) : onTimePct,
    };
  });
  return out;
}

const SUPPLIERS = buildRows();

function onTimeBadge(pct: number) {
  if (pct >= 92) return <Badge tone="ok">On time</Badge>;
  if (pct >= 80) return <Badge tone="warn">Watch</Badge>;
  return <Badge tone="bad">At risk</Badge>;
}

function termsBadge(t: string) {
  if (t === "COD") return <Badge tone="info">COD</Badge>;
  if (t === "Net 14") return <Badge tone="warn">Net 14</Badge>;
  if (t === "Net 30") return <Badge tone="neutral">Net 30</Badge>;
  return <Badge tone="neutral">{t}</Badge>;
}

export default function Suppliers() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set(SUPPLIERS.map((s) => s.category));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SUPPLIERS.filter((s) => {
      if (category !== "All" && s.category !== category) return false;
      if (!q) return true;
      return (
        s.displayName.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.contact.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    });
  }, [search, category]);

  const totalPOs = SUPPLIERS.reduce((s, r) => s + r.poCount, 0);
  const totalInFlight = SUPPLIERS.reduce((s, r) => s + r.inFlightValue, 0);
  const avgLead =
    SUPPLIERS.length === 0
      ? 0
      : Math.round(
          SUPPLIERS.reduce((s, r) => s + r.leadTimeDays, 0) / SUPPLIERS.length,
        );
  const atRisk = SUPPLIERS.filter((s) => s.onTimePct < 80).length;

  const columns: Column<SupplierRow>[] = [
    {
      key: "code",
      header: "Code",
      cell: (r) => (
        <span className="font-semibold tabular-nums text-[var(--fg)]">
          {r.code}
        </span>
      ),
      sortBy: (r) => r.code,
    },
    {
      key: "name",
      header: "Supplier",
      cell: (r) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-[var(--fg)]">
            {r.displayName}
          </div>
          <div className="truncate text-[11px] text-[var(--muted)]">
            {r.category}
          </div>
        </div>
      ),
      sortBy: (r) => r.displayName,
    },
    {
      key: "contact",
      header: "Contact",
      cell: (r) => (
        <div className="min-w-0">
          <div className="truncate text-[var(--fg)]">{r.contact}</div>
          <div className="truncate text-[11px] text-[var(--muted)]">
            {r.email}
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      cell: (r) => (
        <span className="tabular-nums text-[var(--fg)]">{r.phone}</span>
      ),
    },
    {
      key: "lead",
      header: "Lead time",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums text-[var(--fg)]">
          {r.leadTimeDays}d
        </span>
      ),
      sortBy: (r) => r.leadTimeDays,
    },
    {
      key: "terms",
      header: "Terms",
      cell: (r) => termsBadge(r.paymentTerms),
    },
    {
      key: "poCount",
      header: "POs",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums text-[var(--fg)]">{r.poCount}</span>
      ),
      sortBy: (r) => r.poCount,
    },
    {
      key: "inflight",
      header: "In flight",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums text-[var(--fg)]">
          {fmtIDR(r.inFlightValue)}
        </span>
      ),
      sortBy: (r) => r.inFlightValue,
    },
    {
      key: "onTime",
      header: "On-time",
      align: "right",
      cell: (r) => (
        <div className="flex items-center justify-end gap-2">
          <span className="tabular-nums text-[var(--fg)]">{r.onTimePct}%</span>
          {onTimeBadge(r.onTimePct)}
        </div>
      ),
      sortBy: (r) => r.onTimePct,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
            Manage · Suppliers
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">
            Supplier master data
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Vendor registry with delivery reliability and open-PO exposure. Each
            row links to bank info, payment terms, and recent receiving
            performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            New supplier
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Active suppliers"
          value={SUPPLIERS.length.toString()}
          detail="Across 16 categories"
          tone="accent"
        />
        <StatTile
          label="POs on file"
          value={totalPOs.toString()}
          detail="Last 90 days"
          tone="info"
        />
        <StatTile
          label="Open spend"
          value={fmtIDR(totalInFlight)}
          detail={`Avg lead time ${avgLead}d`}
          tone="ok"
        />
        <StatTile
          label="At-risk"
          value={atRisk.toString()}
          detail="On-time < 80%"
          tone={atRisk === 0 ? "neutral" : "bad"}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <Field
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name, contact, email…"
            className="pl-8"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 rounded-sm border bg-transparent px-3 text-sm focus:outline-none focus:ring-1"
          style={{ borderColor: "var(--border)", color: "var(--fg)" }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(r) => r.code}
        initialSort={{ key: "onTime", dir: "desc" }}
      />

      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <Pencil className="h-3.5 w-3.5" />
          <span>
            Bank account &amp; payment terms are surfaced on the edit drawer. The
            demo skips the drawer — production shows per-supplier SKU price
            history and inline price edits.
          </span>
        </div>
      </div>
    </div>
  );
}
