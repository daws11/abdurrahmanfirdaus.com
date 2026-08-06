// src/demos/_shared/Brand.tsx
//
// Brand tile used across the demos. Each demo has its own real brand
// asset copied from production (see `public/assets/images/logos/`):
//   - invoice-sense.png   — favicon (production uses FileText icon tile)
//   - invenflow.svg       — actual bar-chart logo (dark navy + blue arrow)
//   - channelflow.png     — actual TIB monogram (booking app icon.png)
//   - kitchen-fresh.svg   — actual brand mark (KF tile, same as favicon)
//   - people-culture.png  — actual PeopleOS unicorn mark
//
// For demos with a custom logo asset, we render the `<img>` directly.
// For invoice-sense (which uses a FileText icon in production), we fall
// back to the existing monogram tile so it matches the in-app topbar.

import type { ReactNode } from "react";
import type { DemoTheme } from "./theme";
import { cn } from "@/lib/utils";
import { Clock, FileText } from "lucide-react";

interface LogoAsset {
  src: string;
  /** Visual treatment of the tile — "image" for real logos, "tile" for monogram/icon tiles. */
  kind: "image" | "tile";
  /** Background color of the rounded container (for "tile" kind). */
  backgroundColor?: string;
  /** Foreground (icon/text) color of the tile content. */
  color?: string;
}

const LOGOS: Record<string, LogoAsset> = {
  "invoice-sense": { src: "", kind: "tile", backgroundColor: "var(--accent)", color: "var(--accent-fg)" },
  invenflow: { src: "/assets/images/logos/invenflow.svg", kind: "image" },
  channelflow: { src: "/assets/images/logos/channelflow.png", kind: "image" },
  "kitchen-fresh": { src: "/assets/images/logos/kitchen-fresh.svg", kind: "image" },
  "people-culture": { src: "/assets/images/logos/people-culture.png", kind: "image" },
};

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
  const logo = LOGOS[theme.id];
  const tileClass = "flex items-center justify-center rounded-md";
  const tileSize = isSmall ? "h-7 w-7" : "h-9 w-9";
  const imgSize = isSmall ? "h-7 w-7" : "h-9 w-9";
  const iconPx = isSmall ? 16 : 20;

  let tileContent: ReactNode;
  if (!logo || logo.kind === "tile") {
    // Fallback for invoice-sense: production uses FileText icon in accent tile
    const useKitchenIcon = theme.id === "kitchen-fresh";
    const useFileIcon = theme.id === "invoice-sense";
    tileContent = (
      <div
        className={cn(tileClass, tileSize, "font-semibold uppercase tracking-tight")}
        style={{
          backgroundColor: logo?.backgroundColor ?? "var(--accent)",
          color: logo?.color ?? "var(--accent-fg)",
        }}
      >
        {useFileIcon ? (
          <FileText style={{ width: iconPx, height: iconPx }} />
        ) : useKitchenIcon ? (
          <Clock style={{ width: iconPx, height: iconPx }} />
        ) : (
          <span className={isSmall ? "text-[10px]" : "text-xs"}>{theme.brand.monogram}</span>
        )}
      </div>
    );
  } else {
    tileContent = (
      <div className={cn(tileClass, tileSize, "overflow-hidden")}>
        <img
          src={logo.src}
          alt={`${theme.brand.name} logo`}
          className={cn("block", imgSize)}
          style={{ objectFit: "contain" }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {tileContent}
      {showName && (
        <span className={cn("font-semibold", isSmall ? "text-sm" : "text-base")}>
          {theme.brand.name}
        </span>
      )}
    </div>
  );
}