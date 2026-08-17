// src/demos/taxai-talk/screens/QuickStartPills.tsx
//
// 3 colored-dot pills mirroring talk.taxai.ae production
// ConversationControls.tsx footer:
// - Real-time processing (green)
// - AI responses (blue)
// - Live transcription (purple)
// Used at the bottom of Voice and Settings screens.

interface Pill {
  label: string;
  color: string;
}

const PILLS: Pill[] = [
  { label: "Real-time processing", color: "#10b981" }, // emerald-500
  { label: "AI responses", color: "#3b82f6" },        // blue-500
  { label: "Live transcription", color: "#a855f7" },  // purple-500
];

export function QuickStartPills() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3 px-2 text-xs sm:text-sm">
      {PILLS.map((pill) => (
        <div
          key={pill.label}
          className="flex items-center justify-center gap-2 sm:justify-start"
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: pill.color }}
          />
          <span className="truncate" style={{ color: "var(--muted)" }}>
            {pill.label}
          </span>
        </div>
      ))}
    </div>
  );
}
