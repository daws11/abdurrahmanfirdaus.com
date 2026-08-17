// src/demos/taxai-talk/screens/StatusIndicator.tsx
//
// Inline status indicator mirroring talk.taxai.ae production
// ConversationControls: 3 animated dots (blue) when listening,
// single static dot (green) when speaking. Sits below the Mic button.

export type SessionStatus = "idle" | "listening" | "speaking" | "ended";

export interface StatusIndicatorProps {
  status: SessionStatus;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  if (status === "idle" || status === "ended") {
    return <div className="mt-2 h-5" aria-hidden />;
  }

  const isListening = status === "listening";

  return (
    <div className="mt-2 flex h-5 items-center justify-center gap-2">
      <div
        className="flex items-center gap-1.5"
        style={{ color: isListening ? "#3b82f6" : "#10b981" }}
      >
        {isListening ? (
          <>
            <span
              className="h-2 w-2 rounded-full animate-pulse bg-current"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="h-2 w-2 rounded-full animate-pulse bg-current"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="h-2 w-2 rounded-full animate-pulse bg-current"
              style={{ animationDelay: "300ms" }}
            />
          </>
        ) : (
          <span className="h-2 w-2 rounded-full bg-current" />
        )}
        <span className="text-sm font-medium">
          {isListening ? "Listening…" : "Speaking…"}
        </span>
      </div>
    </div>
  );
}
