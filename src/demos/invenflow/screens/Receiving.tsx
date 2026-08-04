// src/demos/invenflow/screens/Receiving.tsx
//
// Table of purchase orders awaiting confirmation. Per row: "Mark received"
// flips status. Bulk selection exposes an action bar above the table when any
// row is ticked. "Receive now" opens a Sheet with tracking-code input + a
// carrier-derived estimate. All updates are local component state.

import { useState } from "react";
import { Check, Inbox, Truck, X, Hash } from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { DataTable, type Column } from "@/demos/_shared/DataTable";
import { StatTile } from "@/demos/_shared/StatTile";
import { Button } from "@/demos/_shared/Button";
import { Sheet } from "@/demos/_shared/Sheet";
import { Field } from "@/demos/_shared/Field";
import {
  RECEIVING_ROWS,
  type ReceivingRow,
  vendorName,
  findOutletName,
} from "../mocks";

function statusBadge(s: ReceivingRow["status"]) {
  switch (s) {
    case "in_transit":
      return <Badge tone="info">In transit</Badge>;
    case "arrived":
      return <Badge tone="warn">Arrived · verify</Badge>;
    case "received":
      return <Badge tone="ok">Received</Badge>;
  }
}

export default function Receiving() {
  const [rows, setRows] = useState<ReceivingRow[]>(RECEIVING_ROWS);
  const [selected, setSelected] = useState<string[]>([]);
  const [receiveFor, setReceiveFor] = useState<ReceivingRow | null>(null);

  function markReceived(ids: string[]) {
    setRows((rs) =>
      rs.map((r) => (ids.includes(r.poId) ? { ...r, status: "received" } : r)),
    );
    setSelected((s) => s.filter((k) => !ids.includes(k)));
  }

  function markArrived(ids: string[]) {
    setRows((rs) =>
      rs.map((r) => (ids.includes(r.poId) && r.status === "in_transit" ? { ...r, status: "arrived" } : r)),
    );
    setSelected((s) => s.filter((k) => !ids.includes(k)));
  }

  function reset() {
    setRows(RECEIVING_ROWS);
    setSelected([]);
  }

  const inTransit = rows.filter((r) => r.status === "in_transit").length;
  const arrived = rows.filter((r) => r.status === "arrived").length;
  const received = rows.filter((r) => r.status === "received").length;

  const columns: Column<ReceivingRow>[] = [
    {
      key: "poId",
      header: "PO",
      cell: (r) => (
        <span className="font-semibold tabular-nums text-[var(--fg)]">
          {r.poId}
        </span>
      ),
      sortBy: (r) => r.poId,
    },
    {
      key: "vendor",
      header: "Vendor",
      cell: (r) => vendorName(r.vendor),
      sortBy: (r) => r.vendor,
    },
    {
      key: "outlet",
      header: "Destination",
      cell: (r) => findOutletName(r.outlet),
      sortBy: (r) => r.outlet,
    },
    {
      key: "carrier",
      header: "Carrier",
      cell: (r) => (
        <span className="text-[var(--muted)]">{r.carrier}</span>
      ),
      sortBy: (r) => r.carrier,
    },
    {
      key: "tracking",
      header: "Tracking",
      cell: (r) => (
        <span className="font-mono text-[11px] tabular-nums text-[var(--muted)]">
          {r.trackingCode}
        </span>
      ),
      sortBy: (r) => r.trackingCode,
    },
    {
      key: "eta",
      header: "ETA",
      cell: (r) => (
        <span className="tabular-nums text-[var(--fg)]">{r.eta}</span>
      ),
      sortBy: (r) => r.eta,
    },
    {
      key: "items",
      header: "Items",
      align: "right",
      cell: (r) => (
        <span className="tabular-nums">{r.itemCount}</span>
      ),
      sortBy: (r) => r.itemCount,
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => statusBadge(r.status),
    },
    {
      key: "action",
      header: "",
      align: "right",
      className: "w-px",
      cell: (r) =>
        r.status === "received" ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)]">
            <Check className="h-3.5 w-3.5" />
            Done
          </span>
        ) : (
          <div className="flex items-center justify-end gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setReceiveFor(r)}
            >
              Receive now
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => markReceived([r.poId])}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
            Workflow · Receiving
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">
            Incoming deliveries
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
            Confirm deliveries when they arrive. Tick rows to bulk-confirm or
            open <span className="font-medium text-[var(--fg)]">Receive now</span>{" "}
            to log a tracking code against a specific delivery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={reset}>
            Reset
          </Button>
          <Button variant="primary" size="sm">
            <Inbox className="h-4 w-4" />
            Log manual receipt
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          label="In transit"
          value={inTransit.toString()}
          detail="On the road"
          tone="info"
        />
        <StatTile
          label="Arrived · verify"
          value={arrived.toString()}
          detail="Needs confirmation"
          tone="warn"
        />
        <StatTile
          label="Received today"
          value={received.toString()}
          detail="Closed out"
          tone="ok"
        />
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(r) => r.poId}
        selectable
        selectedKeys={selected}
        onSelectionChange={setSelected}
        initialSort={{ key: "eta", dir: "asc" }}
        renderSelectionActions={(count) => (
          <>
            <span className="text-[var(--muted)]">{count} selected</span>
            <Button size="sm" variant="secondary" onClick={() => markArrived(selected)}>
              <Truck className="h-3.5 w-3.5" />
              Mark arrived
            </Button>
            <Button size="sm" variant="primary" onClick={() => markReceived(selected)}>
              <Check className="h-3.5 w-3.5" />
              Mark received
            </Button>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="ml-auto inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] text-[var(--muted)] hover:bg-[var(--surface)]"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          </>
        )}
        emptyTitle="No deliveries"
        emptyDescription="No purchase orders are awaiting confirmation."
      />

      <ReceiveNowSheet
        row={receiveFor}
        onClose={() => setReceiveFor(null)}
        onConfirm={(poId) => {
          markReceived([poId]);
          setReceiveFor(null);
        }}
      />
    </div>
  );
}

function ReceiveNowSheet({
  row,
  onClose,
  onConfirm,
}: {
  row: ReceivingRow | null;
  onClose: () => void;
  onConfirm: (poId: string) => void;
}) {
  const [serial, setSerial] = useState("");

  if (!row) return null;
  const open = !!row;
  // Reset serial each time we open for a different row.
  const key = row.poId;

  return (
    <Sheet
      key={key}
      open={open}
      onClose={() => {
        setSerial("");
        onClose();
      }}
      title={`Receive ${row.poId}`}
      width={460}
      footer={
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSerial("");
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onConfirm(row.poId)}
          >
            <Check className="h-4 w-4" />
            Confirm receipt
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-md border border-[var(--border)] bg-[var(--bg)] p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted)]">PO</span>
            <span className="font-semibold tabular-nums">{row.poId}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[var(--muted)]">Vendor</span>
            <span>{vendorName(row.vendor)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[var(--muted)]">Destination</span>
            <span>{findOutletName(row.outlet)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[var(--muted)]">Items</span>
            <span className="tabular-nums">{row.itemCount}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[var(--muted)]">Carrier</span>
            <span>{row.carrier}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[var(--muted)]">Tracking</span>
            <span className="font-mono text-[11px] tabular-nums">{row.trackingCode}</span>
          </div>
        </div>

        <Field
          label="Scan or type serial / lot number"
          placeholder="e.g. SN-2026-A100"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          trailing={<Hash className="h-3.5 w-3.5" />}
          hint="Optional. Saved against the received record so the buyer can trace the batch."
        />

        <div
          className="rounded-md border border-[var(--border)] px-3 py-2 text-[11px]"
          style={{ backgroundColor: "var(--bg)", color: "var(--muted)" }}
        >
          Confirming will flip status to <strong className="text-[var(--fg)]">Received</strong>{" "}
          and post the corresponding stock movement into the central warehouse.
        </div>
      </div>
    </Sheet>
  );
}