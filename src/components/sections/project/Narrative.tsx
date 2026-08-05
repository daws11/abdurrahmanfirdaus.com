import { renderInlineBold } from "@/lib/inline-bold";

interface NarrativeProps {
  story: string;
}

export function Narrative({ story }: NarrativeProps) {
  return (
    <div className="space-y-4 text-base leading-relaxed text-neutral-300 md:text-lg">
      {story.split("\n\n").map((paragraph, i) => (
        <p key={i} className="whitespace-pre-line">
          {renderInlineBold(paragraph)}
        </p>
      ))}
    </div>
  );
}
