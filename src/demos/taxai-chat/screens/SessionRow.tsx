// src/demos/taxai-chat/screens/SessionRow.tsx
//
// Single conversation row in the sidebar. Hover-reveal Trash delete action.
// Matches production AppSidebar session list (app-sidebar.tsx:149-191).

import { useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import type { SessionHistoryItem } from "../mocks";
import { Badge } from "@/demos/_shared/Badge";

interface SessionRowProps {
  session: SessionHistoryItem;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function SessionRow({ session, isActive, onClick, onDelete }: SessionRowProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      className="group relative flex items-center gap-2 rounded-md px-2 py-2 hover:opacity-90"
      style={{
        backgroundColor: isActive ? "var(--surface)" : "transparent",
        border: isActive ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex flex-1 items-center gap-2 text-left min-w-0"
      >
        <MessageSquare className="h-4 w-4 shrink-0" style={{ color: "var(--muted)" }} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-xs font-medium" style={{ color: "var(--fg)" }}>
            {session.title}
          </span>
          <div className="flex items-center justify-between gap-1 text-[10px]">
            <Badge tone="neutral" className="text-[9px] px-1 py-0">
              {session.messageCount}
            </Badge>
            <span style={{ color: "var(--muted)" }}>{session.updatedAt}</span>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (confirming) {
            onDelete();
            setConfirming(false);
          } else {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 2500);
          }
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-sm"
        style={{ color: confirming ? "var(--bad)" : "var(--muted)" }}
        aria-label={confirming ? "Confirm delete" : "Delete session"}
        title={confirming ? "Click again to confirm" : "Delete"}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}