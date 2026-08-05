import { motion } from "framer-motion";
import { sectionCopy, projectStories } from "@/data/portfolio";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";

export function Work() {
  return (
    <section
      id="work"
      className="scroll-mt-20 border-t border-white/10 bg-neutral-950 py-20 text-white md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 flex flex-col gap-3"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Case studies · 05 / 05 — inside the work.
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
          {projectStories.map((story, index) => (
            <CaseStudyCard key={story.id} story={story} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
