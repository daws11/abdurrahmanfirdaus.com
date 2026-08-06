import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectStory } from "@/data/portfolio";

interface CaseStudyCardProps {
  story: ProjectStory;
  index: number;
}

export function CaseStudyCard({ story, index }: CaseStudyCardProps) {
  const reverse = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12"
    >
      {/* Visual */}
      <div className={cn("md:col-span-5", reverse && "md:order-2")}>
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl shadow-black/40">
          <img
            src={story.heroSrc}
            alt={`${story.id} placeholder`}
            className="block aspect-[3/4] w-full object-cover object-top"
          />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-neutral-950/90 to-transparent px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            <a
              href={`#/projects/${story.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-2.5 py-0.5 text-emerald-400 transition-colors hover:bg-emerald-400/10"
            >
              Read case →
            </a>
            <a
              href={`#/demos/${story.id}`}
              className="text-neutral-500 transition-colors hover:text-emerald-400"
            >
              Try demo →
            </a>
          </div>
        </div>
      </div>

      {/* Ringkas story column */}
      <div
        className={cn(
          "md:col-span-7 flex flex-col gap-5",
          reverse && "md:order-1",
        )}
      >
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-emerald-400/40 bg-emerald-400/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400">
            {story.division}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-600">
            Case study · {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p className="max-w-2xl font-serif text-2xl italic leading-snug text-white md:text-3xl lg:text-4xl">
          &ldquo;{story.kicker}&rdquo;
        </p>

        <p className="line-clamp-3 max-w-2xl text-base text-neutral-400 md:text-lg">
          {firstSentence(story.fdeCallout)}
        </p>

        {story.impact.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-1">
            {story.impact.map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                  {m.label}
                </p>
                <p className="mt-0.5 font-serif text-lg italic text-white md:text-xl">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <a
            href={`#/projects/${story.id}`}
            className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
          >
            Read the case study
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

/** First sentence of an FDE callout for the card's ringkas preview. */
function firstSentence(text: string): string {
  const idx = text.indexOf(". ");
  return idx === -1 ? text : text.slice(0, idx + 1);
}
