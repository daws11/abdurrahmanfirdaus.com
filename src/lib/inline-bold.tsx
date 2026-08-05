import type { ReactNode } from "react";

/**
 * Render a string with **bold** segments turned into <strong>.
 * Keeps inline prose scannable without a markdown dependency.
 */
export function renderInlineBold(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const match = part.match(/^\*\*([^*]+)\*\*$/);
    if (match) {
      return (
        <strong key={i} className="font-semibold text-white">
          {match[1]}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
