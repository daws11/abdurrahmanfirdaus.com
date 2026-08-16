// src/demos/taxai-wizard/screens/StepCard.tsx
//
// Local Card shim mirroring shadcn Card layout. Provides consistent
// backdrop-blur, border, padding, and text alignment across the 6 wizard
// screens. Maps production's `backdrop-blur-md bg-white/20 border shadow-sm`
// to theme tokens.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StepCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`w-full max-w-md rounded-lg border shadow-sm backdrop-blur-md ${className}`}
      style={{
        backgroundColor: "color-mix(in srgb, var(--surface) 80%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      {children}
    </div>
  );
}

export function StepCardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 pt-6 pb-2 text-center", className)}>{children}</div>;
}

export function StepCardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
}

export function StepCardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--fg)" }}>
      {children}
    </h2>
  );
}

export function StepCardDescription({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
      {children}
    </p>
  );
}