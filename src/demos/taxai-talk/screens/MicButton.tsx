// src/demos/taxai-talk/screens/MicButton.tsx
//
// BIG round Mic button mirroring talk.taxai.ae production
// ConversationControls: 96px idle, 128px on lg+. bg-accent when idle,
// bg-red-500 when active with a pulsing animate-ping ring overlay.

import { Mic, Loader2, PhoneOff } from "lucide-react";

export type MicState = "idle" | "active" | "connecting" | "ending";

export interface MicButtonProps {
  state: MicState;
  onStart: () => void;
  onEnd: () => void;
}

export function MicButton({ state, onStart, onEnd }: MicButtonProps) {
  const isActive = state === "active" || state === "ending";
  const isLoading = state === "connecting" || state === "ending";

  return (
    <button
      type="button"
      onClick={isActive ? onEnd : onStart}
      disabled={isLoading}
      aria-label={isActive ? "End conversation" : "Start conversation"}
      className="relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-200 ease-in-out active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] lg:h-32 lg:w-32"
      style={{
        backgroundColor: isActive ? "var(--bad)" : "var(--accent)",
        color: "white",
        boxShadow: isActive
          ? "0 10px 25px -5px color-mix(in srgb, var(--bad) 40%, transparent)"
          : "0 10px 25px -5px color-mix(in srgb, var(--accent) 40%, transparent)",
      }}
    >
      <div className="flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : isActive ? (
          <PhoneOff className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </div>
      {/* Pulsing ring when active (mirrors production animate-ping) */}
      {state === "active" && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full opacity-75 animate-ping"
          style={{ backgroundColor: "var(--bad)" }}
        />
      )}
    </button>
  );
}
