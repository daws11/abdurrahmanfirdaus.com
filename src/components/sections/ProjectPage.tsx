import { motion } from "framer-motion";
import { useProjectRoute } from "@/lib/use-project-route";
import { projectStories } from "@/data/portfolio";
import { getDemoById } from "@/demos/_index";
import { Hero } from "@/components/sections/project/Hero";
import { Narrative } from "@/components/sections/project/Narrative";
import { Sidebar } from "@/components/sections/project/Sidebar";
import { CtaToDemo } from "@/components/sections/project/CtaToDemo";
import { ProjectNotFound } from "@/components/sections/project/ProjectNotFound";

export function ProjectPage() {
  const route = useProjectRoute();
  const story = route.id
    ? projectStories.find((s) => s.id === route.id)
    : undefined;

  if (!story) return <ProjectNotFound />;

  return (
    <section className="min-h-screen border-t border-white/10 bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex flex-col gap-3"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            {getDemoById(story.id)?.title ?? "Case study"} · {story.division}
          </span>
          <h1 className="max-w-3xl font-serif text-4xl italic leading-tight md:text-5xl lg:text-6xl">
            {story.kicker}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1,
            }}
            className="md:col-span-5"
          >
            <Hero
              id={story.id}
              heroSrc={story.heroSrc}
              division={story.division}
              duration={story.duration}
            />
          </motion.div>

          {/* Story column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2,
            }}
            className="md:col-span-7 flex flex-col gap-10"
          >
            <Narrative story={story.story} />
            <CtaToDemo
              demoHash={`#/demos/${story.id}`}
              repoHref={story.projectHref}
            />
          </motion.div>
        </div>

        {/* Sidebar full-width below */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3,
          }}
          className="mt-16 border-t border-white/10 pt-12"
        >
          <Sidebar
            fdeCallout={story.fdeCallout}
            impact={story.impact}
            outcomes={story.outcomes}
            stack={story.stack}
            integrations={story.integrations}
            duration={story.duration}
            teamSize={story.teamSize}
          />
        </motion.div>
      </div>
    </section>
  );
}