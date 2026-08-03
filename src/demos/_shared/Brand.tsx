// src/demos/_shared/Brand.tsx
import type { DemoTheme } from "./theme";
import { cn } from "@/lib/utils";

export function Brand({
  theme,
  size = "md",
  showName = true,
}: {
  theme: DemoTheme;
  size?: "sm" | "md";
  showName?: boolean;
}) {
  const isSmall = size === "sm";
  const useGradient = theme.id === "channelflow";
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-md font-semibold uppercase tracking-tight",
          isSmall ? "h-6 w-6 text-[10px]" : "h-7 w-7 text-xs",
        )}
        style={
          useGradient
            ? {
                backgroundImage:
                  "linear-gradient(135deg, #10b981 0%, #047857 100%)",
                color: "var(--accent-fg)",
              }
            : {
                backgroundColor: "var(--accent)",
                color: "var(--accent-fg)",
              }
        }
      >
        {theme.brand.monogram}
      </div>
      {showName && (
        <span className={cn("font-semibold", isSmall ? "text-sm" : "text-base")}>
          {theme.brand.name}
        </span>
      )}
    </div>
  );
}
