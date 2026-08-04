// src/demos/invenflow/screens/Purchasing.tsx
//
// Kanban board: New Request → Approved → Purchased → Received (mirrors the
// production order-board column flow). Each card has "Advance →" / "← Back"
// buttons that move it between columns in component state. "New PO" opens a
// Sheet-based form (vendor dropdown, line items editor, totals). All data
// comes from mocks.ts. No network calls.

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/demos/_shared/Button";
import { Badge } from "@/demos/_shared/Badge";
import { Sheet } from "@/demos/_shared/Sheet";
import { KanbanColumn } from "@/demos/_shared/KanbanColumn";
import { StatTile } from "@/demos/_shared/StatTile";
import { Field } from "@/demos/_shared/Field";
import {
  PURCHASE_ORDERS,
  type PO,
  type POStage,
  type POLine,
  vendorName,
  skuLabel,
  findOutletName,
  findSku,
} from "../mocks";
import { SKUS, OUTLETS } from "../../_shared/fixtures/inventory";

const COLUMNS: { id: POStage; title: string; tone: "neutral" | "warn" | "accent" | "ok" }[] = [
  { id: "new", title: "New Request", tone: "neutral" },
  { id: "approve", title: "Approved", tone: "warn" },
  { id: "purchase", title: "Purchased", tone: "accent" },
  { id: "received", title: "Received", tone: "ok" },
];

function fmtIDR(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function stageBadge(stage: POStage) {
  switch (stage) {
    case "new":
      return <Badge tone="neutral">Draft</Badge>;
    case "approve":
      return <Badge tone="warn">Awaiting approval</Badge>;
    case "purchase":
      return <Badge tone="info">In transit</Badge>;
    case "received":
      return <Badge tone="ok">Received</Badge>;
  }
}

function priorityBadge(p: PO["priority"]) {
  switch (p) {
    case "urgent":
      return <Badge tone="bad">Urgent</Badge>;
    case "high":
      return <Badge tone="warn">High</Badge>;
    case "low":
      return <Badge tone="neutral">Low</Badge>;
    default:
      return null;
  }
}

export default function Purchasing() {
  const [pos, setPos] = useState<PO[]>(PURCHASE_ORDERS);
  const [newOpen, setNewOpen] = useState(false);

  const byStage = useMemo(() => {
    const map: Record<POStage, PO[]> = { new: [], approve: [], purchase: [], received: [] };
    pos.forEach((p) => map[p.stage].push(p));
    return map;
  }, [pos]);

  function move(id: string, dir: 1 | -1) {
    setPos((rows) =>
      rows.map((p) => {
        if (p.id !== id) return p;
        const idx = COLUMNS.findIndex((c) => c.id === p.stage);
        const next = COLUMNS[idx + dir];
        if (!next) return p;
        return { ...p, stage: next.id };
      }),
    );
  }

  function resetBoard() {
    setPos(PURCHASE_ORDERS);
  }

  function addPO(po: PO) {
    setPos((rows) => [po, ...rows]);
    setNewOpen(false);
  }

  const totalActive = pos.filter((p) => p.stage !== "received").length;
  const inFlight = pos.filter((p) => p.stage === "purchase").length;
  const totalSpend = pos
    .filter((p) => p.stage === "purchase" || p.stage === "received")
    .reduce((s, p) => s + p.total, 0);
  const vendorCount = new Set(pos.map((p) => p.vendor)).size;
  const urgentCount = pos.filter((p) => p.priority === "urgent" && p.stage !== "received").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
            Workflow · Purchasing
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">
            Purchase orders
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Drafts move to approval, then on to purchase and finally to received.
            Use <span className="font-medium text-[var(--fg)]">Advance →</span>{" "}
            to push a card forward;{" "}
            <span className="font-medium text-[var(--fg)]">← Back</span> reverts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={resetBoard}>
            Reset board
          </Button>
          <Button variant="primary" size="sm" onClick={() => setNewOpen(true)}>
            <Plus className="h-4 w-4" />
            New PO
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Open orders"
          value={totalActive.toString()}
          detail={`${pos.length} total on the board`}
          tone="accent"
        />
        <StatTile
          label="In flight"
          value={inFlight.toString()}
          detail="Awaiting delivery"
          tone="info"
        />
        <StatTile
          label="Committed spend"
          value={fmtIDR(totalSpend)}
          detail={`${vendorCount} vendors active`}
          tone="ok"
        />
        <StatTile
          label="Urgent"
          value={urgentCount.toString()}
          detail="Flagged this week"
          tone={urgentCount === 0 ? "neutral" : "bad"}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = byStage[col.id];
          const colIdx = COLUMNS.findIndex((c) => c.id === col.id);
          return (
            <KanbanColumn
              key={col.id}
              title={col.title}
              count={items.length}
              tone={col.tone}
            >
              {items.length === 0 && (
                <div className="rounded-md border border-dashed border-[var(--border)] px-3 py-6 text-center text-[11px] text-[var(--muted)]">
                  Nothing here yet.
                </div>
              )}
              {items.map((po) => {
                const canBack = colIdx > 0;
                const canForward = colIdx < COLUMNS.length - 1;
                return (
                  <article
                    key={po.id}
                    className="rounded-md border border-[var(--border)] bg-[var(--bg)] p-3 shadow-sm transition-colors hover:border-[var(--accent)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">
                            {po.id}
                          </span>
                          {priorityBadge(po.priority)}
                        </div>
                        <div className="mt-0.5 truncate text-sm font-semibold text-[var(--fg)]">
                          {vendorName(po.vendor)}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-[var(--muted)]">
                          → {findOutletName(po.outlet)} · {po.requester}
                        </div>
                      </div>
                      {stageBadge(po.stage)}
                    </div>

                    <ul className="mt-2 space-y-0.5 border-t border-[var(--border)] pt-2 text-[11px]">
                      {po.lines.slice(0, 3).map((l) => (
                        <li
                          key={l.sku}
                          className="flex items-center justify-between gap-2 text-[var(--fg)]"
                        >
                          <span className="truncate">{skuLabel(l.sku)}</span>
                          <span className="tabular-nums text-[var(--muted)]">
                            {l.qty} {l.unit}
                          </span>
                        </li>
                      ))}
                      {po.lines.length > 3 && (
                        <li className="text-[var(--muted)]">
                          +{po.lines.length - 3} more line
                          {po.lines.length - 3 === 1 ? "" : "s"}
                        </li>
                      )}
                    </ul>

                    <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-2">
                      <span className="text-sm font-semibold tabular-nums text-[var(--fg)]">
                        {fmtIDR(po.total)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => move(po.id, -1)}
                          disabled={!canBack}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label="Move back"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(po.id, 1)}
                          disabled={!canForward}
                          className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-[var(--accent-fg)] disabled:cursor-not-allowed disabled:opacity-30"
                          style={{
                            backgroundColor: canForward
                              ? "var(--accent)"
                              : "var(--border)",
                          }}
                          aria-label="Advance"
                        >
                          Advance
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </KanbanColumn>
          );
        })}
      </div>

      <NewPOSheet open={newOpen} onClose={() => setNewOpen(false)} onCreate={addPO} />
    </div>
  );
}

// ---- New PO Sheet -----------------------------------------------------------

function NewPOSheet({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (po: PO) => void;
}) {
  const nextNum = PURCHASE_ORDERS.length + 1;
  const [vendor, setVendor] = useState("VA");
  const [outlet, setOutlet] = useState("WH");
  const [requester, setRequester] = useState("Person 01");
  const [priority, setPriority] = useState<PO["priority"]>("normal");
  const [lines, setLines] = useState<POLine[]>([
    { sku: "SKU-001", qty: 10, unit: "kg", unitPrice: 95000 },
  ]);
  const [notes, setNotes] = useState("");

  function setLine(idx: number, patch: Partial<POLine>) {
    setLines((ls) =>
      ls.map((l, i) => {
        if (i !== idx) return l;
        const next = { ...l, ...patch };
        if (patch.sku && patch.sku !== l.sku) {
          const skuDef = findSku(patch.sku);
          if (skuDef) next.unit = skuDef.unit;
        }
        return next;
      }),
    );
  }

  function addLine() {
    setLines((ls) => [...ls, { sku: "SKU-005", qty: 12, unit: "pcs", unitPrice: 45000 }]);
  }
  function removeLine(idx: number) {
    setLines((ls) => ls.filter((_, i) => i !== idx));
  }

  const total = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);

  function submit() {
    const id = `PO-2026-${(nextNum + 200).toString().padStart(3, "0")}`;
    onCreate({
      id,
      vendor,
      outlet: outlet as PO["outlet"],
      lines,
      total,
      createdAt: new Date().toISOString().slice(0, 10),
      stage: "new",
      requester,
      priority,
      notes: notes.trim() || undefined,
    });
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="New purchase order"
      width={520}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={submit}>
            <ClipboardList className="h-4 w-4" />
            Create PO
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
              Vendor
            </div>
            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="h-9 w-full rounded-sm border bg-transparent px-3 text-sm focus:outline-none focus:ring-1"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              {["VA", "VB", "VC", "VD", "VE", "VF", "VG"].map((v) => (
                <option key={v} value={v}>
                  {v} · {vendorName(v)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
              Destination
            </div>
            <select
              value={outlet}
              onChange={(e) => setOutlet(e.target.value)}
              className="h-9 w-full rounded-sm border bg-transparent px-3 text-sm focus:outline-none focus:ring-1"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              {OUTLETS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Requester"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
          />
          <label className="block">
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
              Priority
            </div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PO["priority"])}
              className="h-9 w-full rounded-sm border bg-transparent px-3 text-sm focus:outline-none focus:ring-1"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
              Line items ({lines.length})
            </div>
            <button
              type="button"
              onClick={addLine}
              className="inline-flex h-7 items-center gap-1 rounded-md border border-[var(--border)] px-2 text-[11px] font-medium text-[var(--fg)] hover:bg-[var(--surface)]"
            >
              <Plus className="h-3 w-3" />
              Add line
            </button>
          </div>
          <div className="space-y-2">
            {lines.map((l, idx) => (
              <div
                key={idx}
                className="rounded-md border border-[var(--border)] p-2"
              >
                <div className="flex items-start gap-2">
                  <select
                    value={l.sku}
                    onChange={(e) => setLine(idx, { sku: e.target.value })}
                    className="h-8 flex-1 rounded-sm border bg-transparent px-2 text-xs focus:outline-none focus:ring-1"
                    style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                  >
                    {SKUS.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} · {s.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeLine(idx)}
                    disabled={lines.length <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Remove line"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <label className="block">
                    <div className="mb-0.5 text-[10px] uppercase tracking-wider text-[var(--muted)]">
                      Qty
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={l.qty}
                      onChange={(e) => setLine(idx, { qty: Math.max(1, Number(e.target.value)) })}
                      className="h-8 w-full rounded-sm border bg-transparent px-2 text-xs tabular-nums focus:outline-none focus:ring-1"
                      style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                    />
                  </label>
                  <label className="block">
                    <div className="mb-0.5 text-[10px] uppercase tracking-wider text-[var(--muted)]">
                      Unit
                    </div>
                    <input
                      value={l.unit}
                      onChange={(e) => setLine(idx, { unit: e.target.value })}
                      className="h-8 w-full rounded-sm border bg-transparent px-2 text-xs focus:outline-none focus:ring-1"
                      style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                    />
                  </label>
                  <label className="block">
                    <div className="mb-0.5 text-[10px] uppercase tracking-wider text-[var(--muted)]">
                      Unit price (IDR)
                    </div>
                    <input
                      type="number"
                      min={0}
                      value={l.unitPrice}
                      onChange={(e) => setLine(idx, { unitPrice: Math.max(0, Number(e.target.value)) })}
                      className="h-8 w-full rounded-sm border bg-transparent px-2 text-xs tabular-nums focus:outline-none focus:ring-1"
                      style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <label className="block">
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
            Notes
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Optional — anything the buyer should know."
            className="w-full rounded-sm border bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-1"
            style={{ borderColor: "var(--border)", color: "var(--fg)" }}
          />
        </label>

        <div
          className="flex items-center justify-between rounded-md border border-[var(--border)] px-3 py-2 text-sm"
          style={{ backgroundColor: "var(--bg)" }}
        >
          <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
            Total
          </span>
          <span className="text-base font-semibold tabular-nums text-[var(--fg)]">
            {fmtIDR(total)}
          </span>
        </div>
      </div>
    </Sheet>
  );
}