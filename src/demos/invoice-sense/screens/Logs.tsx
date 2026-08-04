// src/demos/invoice-sense/screens/Logs.tsx
// @ts-nocheck
//
// Production "Logs" tab (client/src/pages/logs.tsx) is a chronological list
// of API request/response entries. Each row carries a timestamp, action type,
// invoice id snapshot, HTTP status badge, duration, and optional error.
// We render a representative sample of 24 synthetic entries.

import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Filter,
  RefreshCw,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import { Badge } from "@/demos/_shared/Badge";
import { Button } from "@/demos/_shared/Button";
import { INVOICES } from "../mocks";

interface LogEntry {
  id: number;
  ts: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  status: number;
  durationMs: number;
  action?: "deletion" | "xero_sync" | "tag_change";
  invoiceId?: string;
  user: string;
  error?: string;
}

function buildLogs(): LogEntry[] {
  const out: LogEntry[] = [];
  const users = ["af@", "rn@", "dy@", "mk@"];
  const methods: LogEntry["method"][] = ["GET", "POST", "PATCH", "DELETE"];
  const paths = [
    "/api/invoices",
    "/api/invoices/reconcile",
    "/api/invoices/xero-sync",
    "/api/invoices/ocr",
    "/api/invoices/bulk",
    "/api/suppliers",
    "/api/reconciliation",
  ];

  // Pick recent INVOICES for invoiceId snapshot.
  const recent = INVOICES.slice(0, 24);

  for (let i = 0; i < 24; i++) {
    const inv = recent[i];
    const ts = new Date("2026-08-04T08:00:00Z");
    ts.setUTCMinutes(ts.getUTCMinutes() - i * 17);
    const method = methods[i % methods.length];
    const path = paths[i % paths.length];
    const isErr = inv.status === "error" && i % 7 === 0;
    const isSync = i % 5 === 0;
    out.push({
      id: 1000 + i,
      ts: ts.toISOString(),
      method,
      path,
      status: isErr ? 422 : 200,
      durationMs: 80 + ((i * 37) % 940),
      action: isSync ? "xero_sync" : i % 4 === 0 ? "tag_change" : i % 9 === 0 ? "deletion" : undefined,
      invoiceId: inv.id,
      user: users[i % users.length],
      error: isErr ? "OCR returned empty payload" : undefined,
    });
  }
  return out;
}

const LOGS = buildLogs();

export function Logs() {
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LOGS;
    return LOGS.filter(
      (l) =>
        l.path.toLowerCase().includes(q) ||
        (l.invoiceId ?? "").toLowerCase().includes(q) ||
        l.user.toLowerCase().includes(q),
    );
  }, [query]);

  const toggle = (id: number) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const okCount = LOGS.filter((l) => l.status >= 200 && l.status < 300).length;
  const errCount = LOGS.filter((l) => l.status >= 400).length;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <header
        className="flex flex-shrink-0 items-center justify-between border-b px-6 py-3"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
      >
        <div>
          <h1 className="text-base font-semibold">API logs</h1>
          <p className="text-[11px]" style={{ color: "var(--muted)" }}>
            {LOGS.length} entries · {okCount} ok · {errCount} error
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              style={{ color: "var(--muted)" }}
            />
            <input
              type="search"
              placeholder="Search path, invoice, user..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 w-72 rounded-md border pl-8 pr-3 text-[12px] focus:outline-none focus:ring-1"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)", color: "var(--fg)" }}
            />
          </div>
          <Button size="sm" variant="secondary">
            <Filter className="h-3.5 w-3.5" /> Filter
          </Button>
          <Button size="sm" variant="secondary">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button size="sm" variant="secondary">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div
          className="overflow-hidden rounded-md border"
          style={{ borderColor: "var(--border)" }}
        >
          <table className="w-full text-[12px]">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <th className="w-8 px-2 py-2" />
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Timestamp</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Method</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Path</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Action</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Invoice</th>
                <th className="px-3 py-2 text-right font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Status</th>
                <th className="px-3 py-2 text-right font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Latency</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>User</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const ok = l.status >= 200 && l.status < 300;
                const open = openIds.has(l.id);
                return (
                  <>
                    <tr
                      key={l.id}
                      className="cursor-pointer border-b last:border-b-0"
                      style={{ borderColor: "var(--border)" }}
                      onClick={() => toggle(l.id)}
                    >
                      <td className="px-2 py-2" style={{ color: "var(--muted)" }}>
                        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] tabular-nums" style={{ color: "var(--fg)" }}>
                        {new Date(l.ts).toLocaleString("en-GB", { hour12: false }).slice(0, 19)}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold"
                          style={{
                            backgroundColor: "var(--surface)",
                            color:
                              l.method === "POST"
                                ? "var(--ok)"
                                : l.method === "DELETE"
                                  ? "var(--bad)"
                                  : l.method === "PATCH"
                                    ? "var(--warn)"
                                    : "var(--accent)",
                          }}
                        >
                          {l.method}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px]" style={{ color: "var(--fg)" }}>{l.path}</td>
                      <td className="px-3 py-2">
                        {l.action === "xero_sync" && <Badge tone="info"><Activity className="mr-1 inline h-3 w-3" />Xero Sync</Badge>}
                        {l.action === "tag_change" && <Badge tone="warn"><Tag className="mr-1 inline h-3 w-3" />Tag Change</Badge>}
                        {l.action === "deletion" && <Badge tone="bad"><Trash2 className="mr-1 inline h-3 w-3" />Deleted</Badge>}
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px]" style={{ color: "var(--muted)" }}>{l.invoiceId ?? "—"}</td>
                      <td className="px-3 py-2 text-right">
                        <Badge tone={ok ? "ok" : "bad"}>
                          {ok ? <CheckCircle2 className="mr-1 inline h-3 w-3" /> : <AlertCircle className="mr-1 inline h-3 w-3" />}
                          HTTP {l.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-[11px] tabular-nums" style={{ color: "var(--muted)" }}>
                        <Clock className="mr-1 inline h-3 w-3" />{l.durationMs}ms
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px]" style={{ color: "var(--muted)" }}>{l.user}</td>
                    </tr>
                    {open && (
                      <tr key={`${l.id}-d`} className="border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
                        <td colSpan={9} className="px-3 py-3 text-[11px]">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Request</div>
                              <pre className="mt-1 overflow-auto rounded border p-2 font-mono text-[10px]" style={{ borderColor: "var(--border)" }}>
{`${l.method} ${l.path}
User: ${l.user}
Invoice: ${l.invoiceId ?? "—"}`}
                              </pre>
                            </div>
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Response</div>
                              <pre className="mt-1 overflow-auto rounded border p-2 font-mono text-[10px]" style={{ borderColor: "var(--border)" }}>
{`HTTP ${l.status} · ${l.durationMs}ms
${ok ? "{ ok: true }" : "{ error: \"" + (l.error ?? "unknown") + "\" }"}`}
                              </pre>
                            </div>
                            <div>
                              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Notes</div>
                              <p className="mt-1 leading-relaxed" style={{ color: "var(--fg)" }}>
                                {l.error ? l.error : `Operation completed in ${l.durationMs}ms. No errors detected.`}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
