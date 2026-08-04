// src/demos/kitchen-fresh/screens/PrintLabel.tsx
// @ts-nocheck
//
// Production equivalent: PrintLabelPage. Lets staff select a dish, choose
// a quantity, and "print" a batch of labels with a synthetic confirmation
// of the print run. Mirrors production's label-printing UX.

import { useMemo, useState } from "react";
import { Printer, Plus, Minus, Tag } from "lucide-react";
import { useKitchenFresh } from "../context";
import { findOutlet, DISHES, LABEL_BATCHES } from "../mocks";
import { setDemoHash } from "@/demos/router";

export function PrintLabel() {
  const { activeOutletId } = useKitchenFresh();
  const outlet = findOutlet(activeOutletId);

  const [dishId, setDishId] = useState<string>(DISHES[0]?.id ?? "");
  const [qty, setQty] = useState(6);

  const dish = useMemo(() => DISHES.find((d) => d.id === dishId), [dishId]);
  const batches = useMemo(
    () => LABEL_BATCHES.filter((b) => b.outlet === activeOutletId || true).slice(0, 6),
    [activeOutletId],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header>
        <div
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          Print Label
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Print Dish Labels</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Generate batch labels for{" "}
          <strong style={{ color: "var(--fg)" }}>{outlet?.name}</strong> ({outlet?.code}).
          Each label includes the dish name, POS code, and a 120-minute
          countdown that the Fresh Counter reads.
        </p>
      </header>

      <section
        className="rounded-xl border p-5"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <h2 className="text-sm font-semibold">New label batch</h2>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          Pick a dish and quantity, then print. The system logs the batch and
          starts a Fresh Counter timer for each label.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="md:col-span-2 block text-xs">
            <span
              className="mb-1 block text-[10px] font-medium uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              Dish
            </span>
            <div
              className="flex h-9 items-center gap-2 rounded-md border px-2"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
            >
              <Tag className="h-3.5 w-3.5" style={{ color: "var(--muted)" }} />
              <select
                value={dishId}
                onChange={(e) => setDishId(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none"
                style={{ color: "var(--fg)" }}
              >
                {DISHES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} · POS {d.posCode ?? "—"}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="block text-xs">
            <span
              className="mb-1 block text-[10px] font-medium uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              Quantity
            </span>
            <div
              className="flex h-9 items-center justify-between rounded-md border px-2"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
            >
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-7 w-7 items-center justify-center rounded"
                style={{ color: "var(--muted)" }}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="font-mono text-sm font-semibold tabular-nums">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(50, q + 1))}
                className="flex h-7 w-7 items-center justify-center rounded"
                style={{ color: "var(--muted)" }}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border)" }}>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            {dish && (
              <span>
                Shelf life: <strong style={{ color: "var(--fg)" }}>{dish.defaultDurationMinutes}m</strong>{" "}
                · Prep: <strong style={{ color: "var(--fg)" }}>{dish.prepMinutes}m</strong>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setDemoHash("kitchen-fresh", "daily")}
            className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Printer className="h-4 w-4" />
            Print {qty} label{qty === 1 ? "" : "s"}
          </button>
        </div>
      </section>

      <section
        className="rounded-xl border"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <header className="border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-sm font-semibold">Recent batches</h2>
          <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
            Last 6 batches printed across all outlets.
          </p>
        </header>
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b text-left text-[10px] font-medium uppercase tracking-widest"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              <th className="px-4 py-2">Dish</th>
              <th className="px-4 py-2">POS</th>
              <th className="px-4 py-2">Outlet</th>
              <th className="px-4 py-2">Printed</th>
              <th className="px-4 py-2 text-right">Qty</th>
              <th className="px-4 py-2 text-right">Shelf life</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => (
              <tr
                key={`${b.outlet}-${b.posCode}-${b.printedAt}`}
                className="border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="px-4 py-2 font-medium">{b.dishName}</td>
                <td className="px-4 py-2 font-mono text-xs">{b.posCode}</td>
                <td className="px-4 py-2 text-xs">{b.outlet}</td>
                <td className="px-4 py-2 font-mono text-xs">{b.printedAt}</td>
                <td className="px-4 py-2 text-right font-mono font-semibold tabular-nums">{b.count}</td>
                <td className="px-4 py-2 text-right font-mono text-xs">{b.expirationMinutes}m</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
