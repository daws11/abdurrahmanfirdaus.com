// src/demos/taxai-chat/screens/Inbox.tsx
//
// Production-style AppSidebar layout: branding header + new chat button +
// session history (with hover-delete) + footer (language + token + user).
// Main column shows QuickStart empty state when nothing selected.
//
// E.6: activeSessionId + onSelectSession come from index.tsx (lifted state).
// E.8 will add SearchInput + date grouping on top of this.

import { useState } from "react";
import { Plus, MessageSquare, Calculator, FileText, Globe2 } from "lucide-react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarFooter } from "./SidebarFooter";
import { SessionRow } from "./SessionRow";
import { SESSION_HISTORY } from "../mocks";
import { setDemoHash } from "@/demos/router";

const QUICKSTARTS = [
  { icon: Calculator, title: "Calculate VAT on an invoice", body: "Quickly check the VAT component of any invoice amount in AED." },
  { icon: FileText, title: "Summarize a tax document", body: "Upload a PDF and get a plain-English summary with citations." },
  { icon: Globe2, title: "Explain free-zone tax treatment", body: "Walk through whether a free-zone entity qualifies for 0% corporate tax." },
];

interface InboxProps {
  activeSessionId: string;
  onSelectSession: (id: string) => void;
}

export function Inbox({ activeSessionId, onSelectSession }: InboxProps) {
  const [sessions, setSessions] = useState(SESSION_HISTORY);

  return (
    <div className="grid h-full grid-cols-[300px_1fr]">
      <aside
        className="flex h-full flex-col border-r"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <SidebarHeader />

        {/* New chat button */}
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={() => {
              onSelectSession("c-001");
              setDemoHash("taxai-chat", "conversation");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-medium hover:opacity-90"
            style={{ borderColor: "var(--border)", color: "var(--fg)" }}
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>
        </div>

        {/* Session history */}
        <div className="flex-1 overflow-y-auto px-2 pt-3">
          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            Recent
          </p>
          <ul className="flex flex-col gap-1">
            {sessions.map((s) => (
              <li key={s.id}>
                <SessionRow
                  session={s}
                  isActive={s.id === activeSessionId}
                  onClick={() => {
                    onSelectSession(s.id);
                    setDemoHash("taxai-chat", "conversation");
                  }}
                  onDelete={() => {
                    setSessions((prev) => prev.filter((x) => x.id !== s.id));
                  }}
                />
              </li>
            ))}
          </ul>
        </div>

        <SidebarFooter />
      </aside>

      {/* Main column: QuickStart empty state */}
      <main className="flex items-center justify-center px-6" style={{ color: "var(--muted)" }}>
        <div className="max-w-2xl">
          <div className="flex flex-col items-center text-center">
            <MessageSquare className="h-8 w-8" />
            <p className="mt-3 text-sm font-medium" style={{ color: "var(--fg)" }}>
              How can I help with UAE tax today?
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              Ask Atto anything, or pick a starter prompt below.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {QUICKSTARTS.map((q) => (
              <button
                key={q.title}
                type="button"
                onClick={() => {
                  onSelectSession("c-001");
                  setDemoHash("taxai-chat", "conversation");
                }}
                className="flex flex-col items-start gap-2 rounded-md border p-4 text-left transition hover:shadow-sm"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <q.icon className="h-4 w-4" style={{ color: "var(--accent)" }} />
                <p className="text-sm font-semibold" style={{ color: "var(--fg)" }}>{q.title}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{q.body}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
