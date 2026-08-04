// src/demos/invoice-sense/screens/Suppliers.tsx
//
// Vendor → accounting-code mapping table. The production app calls this
// screen "Mapping". Click a vendor to expand an inline drawer with the
// most recent invoice and a button to remap.

import { useMemo, useState } from "react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { Sheet } from "@/demos/_shared/Sheet";
import {
  SUPPLIER_MAPPINGS,
  INVOICES,
  invoiceTotal,
  fmtCurrency,
  statusLabel,
  statusTone,
} from "../mocks";

export function Suppliers() {
  const [activeCode, setActiveCode] = useState<string | null>(null);

  const rows = useMemo(() => SUPPLIER_MAPPINGS, []);
  const active = activeCode
    ? rows.find((r) => r.vendorCode === activeCode)
    : null;
  const activeInvoices = active
    ? INVOICES.filter((i) => i.vendorCode === active.vendorCode)
    : [];

  return (
    <div className="mx-auto max-w-5xl">
      <div
        className="mb-4 flex items-end justify-between rounded-md border p-4"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div>
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--fg)" }}
          >
            Supplier mapping
          </h2>
          <p
            className="mt-1 text-[12px]"
            style={{ color: "var(--muted)" }}
          >
            Each supplier links to one accounting code. Invoices auto-route to
            the right code on approval.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px]"
          style={{ color: "var(--muted)" }}
        >
          <span>{rows.length} suppliers</span>
          <span aria-hidden="true">·</span>
          <span>
            {rows.filter((r) => r.active).length} active
          </span>
        </div>
      </div>

      <div
        className="overflow-hidden rounded-md border"
        style={{ borderColor: "var(--border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg)",
              }}
            >
              {[
                "Code",
                "Vendor",
                "Accounting code",
                "Tax ID",
                "Status",
                "Last invoice",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="h-9 px-3 text-left text-[11px] font-medium uppercase tracking-widest"
                  style={{ color: "var(--muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.vendorCode}
                className="cursor-pointer border-b last:border-b-0"
                style={{ borderColor: "var(--border)" }}
                onClick={() => setActiveCode(r.vendorCode)}
              >
                <td
                  className="h-10 px-3 font-mono text-[11px] tabular-nums"
                  style={{ color: "var(--muted)" }}
                >
                  {r.vendorCode}
                </td>
                <td
                  className="h-10 px-3 font-medium"
                  style={{ color: "var(--fg)" }}
                >
                  {r.vendorName}
                </td>
                <td
                  className="h-10 px-3 font-mono text-[11px] tabular-nums"
                  style={{ color: "var(--fg)" }}
                >
                  {r.accountingCode}
                </td>
                <td
                  className="h-10 px-3 font-mono text-[11px] tabular-nums"
                  style={{ color: "var(--muted)" }}
                >
                  {r.taxId}
                </td>
                <td className="h-10 px-3">
                  <Badge tone={r.active ? "ok" : "neutral"}>
                    {r.active ? "Active" : "Paused"}
                  </Badge>
                </td>
                <td
                  className="h-10 px-3 font-mono text-[11px] tabular-nums"
                  style={{ color: "var(--muted)" }}
                >
                  {r.lastInvoice}
                </td>
                <td className="h-10 px-3 text-right">
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet
        open={!!active}
        onClose={() => setActiveCode(null)}
        title={active ? `${active.vendorName} · mapping` : ""}
        width={440}
      >
        {active && (
          <div className="flex flex-col gap-4">
            <div
              className="flex items-center gap-2 rounded-md border p-3"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-fg)",
                }}
              >
                {active.vendorCode}
              </div>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--fg)" }}
                >
                  {active.vendorName}
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "var(--muted)" }}
                >
                  {active.contact}
                </div>
              </div>
              <Badge
                tone={active.active ? "ok" : "neutral"}
                className="ml-auto"
              >
                {active.active ? "Active" : "Paused"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <div
                className="rounded-md border p-3"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--muted)" }}
                >
                  Accounting code
                </div>
                <div
                  className="mt-1 font-mono tabular-nums"
                  style={{ color: "var(--fg)" }}
                >
                  {active.accountingCode}
                </div>
              </div>
              <div
                className="rounded-md border p-3"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--muted)" }}
                >
                  Tax ID
                </div>
                <div
                  className="mt-1 font-mono tabular-nums"
                  style={{ color: "var(--fg)" }}
                >
                  {active.taxId}
                </div>
              </div>
            </div>

            <div>
              <h3
                className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted)" }}
              >
                Recent invoices ({activeInvoices.length})
              </h3>
              <ul
                className="overflow-hidden rounded-md border"
                style={{ borderColor: "var(--border)" }}
              >
                {activeInvoices.length === 0 ? (
                  <li
                    className="px-3 py-3 text-[11px]"
                    style={{ color: "var(--muted)" }}
                  >
                    No invoices for this supplier.
                  </li>
                ) : (
                  activeInvoices.map((inv) => (
                    <li
                      key={inv.id}
                      className="flex items-center gap-2 border-b px-3 py-2 text-[12px] last:border-b-0"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span
                        className="font-mono tabular-nums"
                        style={{ color: "var(--muted)" }}
                      >
                        {inv.id}
                      </span>
                      <Badge tone={statusTone(inv.status)}>
                        {statusLabel(inv.status)}
                      </Badge>
                      <span
                        className="ml-auto font-medium tabular-nums"
                        style={{ color: "var(--fg)" }}
                      >
                        {fmtCurrency(invoiceTotal(inv), inv.currency)}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="primary">
                Remap accounting code
              </Button>
              <Button size="sm" variant="secondary">
                Pause supplier
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}