import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { caseStudies, sectionCopy } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export function Work() {
  return (
    <section
      id="work"
      className="scroll-mt-20 border-t border-white/10 bg-neutral-950 py-20 text-white md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 flex flex-col gap-3"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Case studies · 03 / 05
          </span>
          <h2 className="max-w-3xl font-serif text-4xl italic leading-tight md:text-5xl lg:text-6xl">
            {sectionCopy.work.heading}
          </h2>
          {sectionCopy.work.subheading && (
            <p className="mt-2 max-w-2xl text-base text-neutral-400 md:text-lg">
              {sectionCopy.work.subheading}
            </p>
          )}
        </motion.div>

        <div className="space-y-28 md:space-y-40">
          {caseStudies.map((study, index) => (
            <CaseStudyArticle key={study.id} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudyArticle({
  study,
  index,
}: {
  study: (typeof caseStudies)[number];
  index: number;
}) {
  // Alternate which side the hero visual sits on for visual rhythm.
  const reverse = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16"
    >
      {/* Visual */}
      <div
        className={cn(
          "md:col-span-5",
          reverse && "md:order-2"
        )}
      >
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl shadow-black/40">
          <img
            src={study.heroSrc}
            alt={`${study.id} placeholder`}
            className="block aspect-[3/4] w-full object-cover"
          />
          {/* Placeholder label — honest about what this is. */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-neutral-950/90 to-transparent px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            <span>UI / UX prototype · placeholder</span>
            <span className="text-emerald-400">
              {String(index + 1).padStart(2, "0")} / 03
            </span>
          </div>
        </div>
      </div>

      {/* Story column */}
      <div
        className={cn(
          "md:col-span-7 flex flex-col gap-6",
          reverse && "md:order-1"
        )}
      >
        {/* Meta + division tag */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400">
              {study.division}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-600">
              Case study · {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Kicker — the scene-setter */}
          <p className="max-w-2xl font-serif text-2xl italic leading-snug text-white md:text-3xl lg:text-4xl">
            &ldquo;{study.kicker}&rdquo;
          </p>
        </div>

        {/* FDE callout — what I did as FDE here */}
        <blockquote className="relative border-l-2 border-emerald-400/60 pl-5">
          <p className="text-base italic leading-relaxed text-neutral-300 md:text-lg">
            {study.fdeCallout}
          </p>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400">
            FDE moment
          </p>
        </blockquote>

        {/* Narrative — prose with bold sub-labels */}
        <div className="space-y-4 text-base leading-relaxed text-neutral-300 md:text-lg">
          {study.story.split("\n\n").map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">
              {renderInlineBold(paragraph)}
            </p>
          ))}
        </div>

        {/* Impact chips — the headlines */}
        {study.impact.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2">
            {study.impact.map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                  {m.label}
                </p>
                <p className="mt-1 font-serif text-xl italic text-white md:text-2xl">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Stack + integrations */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6">
          <StackColumn label="Stack" items={study.stack} variant="mono" />
          <StackColumn
            label="Integrations"
            items={study.integrations}
            variant="pill"
          />
          <a
            href={study.projectHref}
            target="_blank"
            rel="noreferrer"
            className="group ml-auto inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
          >
            Read the code
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function StackColumn({
  label,
  items,
  variant,
}: {
  label: string;
  items: string[];
  variant: "mono" | "pill";
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) =>
          variant === "mono" ? (
            <span
              key={s}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-neutral-300"
            >
              {s}
            </span>
          ) : (
            <span
              key={s}
              className="rounded-full border border-emerald-400/30 bg-emerald-400/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400"
            >
              {s}
            </span>
          )
        )}
      </div>
    </div>
  );
}

/**
 * Render a string with **bold** segments turned into <strong>.
 * Keeps inline prose scannable without a markdown dependency.
 */
function renderInlineBold(text: string): React.ReactNode {
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