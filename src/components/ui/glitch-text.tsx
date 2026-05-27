import * as React from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  /** The text to render. Also mirrored into `data-text` for the glitch layers. */
  text: string;
  /** Element to render as (e.g. "h1", "span"). Defaults to "span". */
  as?: React.ElementType;
  className?: string;
}

/**
 * RGB-split glitch text. The two glitch layers are drawn by the `.glitch`
 * pseudo-elements in index.css using `content: attr(data-text)`. The effect
 * pulses periodically and intensifies on hover; it is disabled automatically
 * when the user prefers reduced motion.
 */
export function GlitchText({ text, as, className }: GlitchTextProps) {
  const Tag = (as ?? "span") as React.ElementType;
  return (
    <Tag data-text={text} className={cn("glitch", className)}>
      {text}
    </Tag>
  );
}
