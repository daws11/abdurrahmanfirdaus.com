// src/demos/kitchen-fresh/screens/ShiftHandoff.tsx
//
// Outgoing + incoming shift handoff for the active outlet. Two side-by-side
// notes with checklists, timestamps, and editable body text. Pre-populated
// with realistic, outlet-specific content so the screen reads as a real
// shift log on first load.
//
// State is local — typing updates the note body in real time. The
// checklist items can be toggled. No backend.

import { useEffect, useState } from "react";
import { LogOut, LogIn, Check, Square, Clock4 } from "lucide-react";
import { useKitchenFresh } from "../context";
import { findOutlet } from "@/demos/_shared/fixtures/inventory";
import { SHIFT_HANDOFFS, type ShiftNote } from "../mocks";
import { setDemoHash } from "@/demos/router";

export function ShiftHandoff() {
  const { activeOutletId } = useKitchenFresh();
  const outlet = findOutlet(activeOutletId);
  const data = SHIFT_HANDOFFS.find((h) => h.outletId === activeOutletId);

  // Local copies of the two notes so the user can edit them.
  const [outgoing, setOutgoing] = useState<ShiftNote | null>(null);
  const [incoming, setIncoming] = useState<ShiftNote | null>(null);

  useEffect(() => {
    if (data) {
      setOutgoing(data.outgoing);
      setIncoming(data.incoming);
    }
  }, [activeOutletId, data]);

  if (!data || !outgoing || !incoming) return null;

  const now = new Date();
  const tsLabel = now.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });

  const toggleChecklist = (
    setter: typeof setOutgoing,
    current: ShiftNote,
    index: number,
  ) => {
    setter({
      ...current,
      checklist: current.checklist.map((c, i) =>
        i === index ? { ...c, done: !c.done } : c,
      ),
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Shift Log
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Shift Handoff</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Notes between shifts at{" "}
            <strong style={{ color: "var(--fg)" }}>{outlet?.name}</strong> ({outlet?.code}). The
            outgoing shift's notes and checklist carry over to the incoming team.
          </p>
        </div>
        <div
          className="rounded-md border px-3 py-1.5 text-xs"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
            color: "var(--muted)",
          }}
        >
          Today: <span style={{ color: "var(--fg)" }}>{data.date}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <NotePanel
          note={outgoing}
          tone="outgoing"
          title="Outgoing shift"
          onChangeBody={(v) => setOutgoing({ ...outgoing, body: v })}
          onToggleChecklist={(i) => toggleChecklist(setOutgoing, outgoing, i)}
        />
        <NotePanel
          note={incoming}
          tone="incoming"
          title="Incoming shift"
          onChangeBody={(v) => setIncoming({ ...incoming, body: v })}
          onToggleChecklist={(i) => toggleChecklist(setIncoming, incoming, i)}
        />
      </div>

      <footer
        className="flex items-center justify-between rounded-md border px-3 py-2 text-xs"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
          color: "var(--muted)",
        }}
      >
        <span className="flex items-center gap-1">
          <Clock4 className="h-3 w-3" />
          Auto-saved at <span style={{ color: "var(--fg)" }}>{tsLabel}</span>
        </span>
        <button
          type="button"
          onClick={() => setDemoHash("kitchen-fresh", "outlets")}
          className="font-medium"
          style={{ color: "var(--accent)" }}
        >
          ← Switch outlet
        </button>
      </footer>
    </div>
  );
}

function NotePanel({
  note,
  tone,
  title,
  onChangeBody,
  onToggleChecklist,
}: {
  note: ShiftNote;
  tone: "outgoing" | "incoming";
  title: string;
  onChangeBody: (v: string) => void;
  onToggleChecklist: (index: number) => void;
}) {
  const Icon = tone === "outgoing" ? LogOut : LogIn;
  const accent = tone === "outgoing" ? "var(--warn)" : "var(--ok)";
  const timestamp = new Date(note.at).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section
      className="flex flex-col rounded-xl border"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      <header
        className="flex items-center justify-between gap-2 border-b px-4 py-3"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{ backgroundColor: "var(--bg)", color: accent }}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
          <div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-[11px]" style={{ color: "var(--muted)" }}>
              {note.author} · {timestamp}
            </div>
          </div>
        </div>
        <div
          className="rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest"
          style={{
            borderColor: accent,
            color: accent,
          }}
        >
          {tone}
        </div>
      </header>

      <textarea
        value={note.body}
        onChange={(e) => onChangeBody(e.target.value)}
        placeholder={
          tone === "outgoing"
            ? "What did the shift complete? Anything left for the next team?"
            : "What does the incoming team need to know first?"
        }
        rows={5}
        className="w-full resize-none border-b bg-transparent px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-0"
        style={{
          borderColor: "var(--border)",
          color: "var(--fg)",
        }}
      />

      {note.checklist.length > 0 && (
        <ul className="space-y-1 px-4 py-3">
          <li
            className="pb-1 text-[10px] font-medium uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Checklist
          </li>
          {note.checklist.map((item, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => onToggleChecklist(i)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                style={{
                  backgroundColor: item.done ? "var(--bg)" : "transparent",
                  color: item.done ? "var(--muted)" : "var(--fg)",
                }}
              >
                {item.done ? (
                  <Check
                    className="h-4 w-4 shrink-0"
                    style={{ color: accent }}
                  />
                ) : (
                  <Square
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--muted)" }}
                  />
                )}
                <span
                  className="flex-1"
                  style={{ textDecoration: item.done ? "line-through" : "none" }}
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}