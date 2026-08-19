// src/demos/_shared/Card.tsx
//
// Reusable Card primitive (promoted from taxai-wizard's local StepCard shim
// in E.1). Used by:
// - taxai-wizard (via StepCard re-export aliases)
// - taxai-talk E.5 (Conclusion modal summary)
// - taxai-chat E.12 (Change Plan picker)
//
// shadcn new-york style: backdrop-blur, theme-token border, theme-token
// surface tinted at 80% via color-mix.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
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

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 pt-6 pb-2 text-center", className)}>{children}</div>;
}

export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 pb-6", className)}>{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--fg)" }}>
      {children}
    </h2>
  );
}

export function CardDescription({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
      {children}
    </p>
  );
}