import { FocusRail } from "@/components/ui/focus-rail";
import { projects, sectionCopy } from "@/data/portfolio";

export function Projects() {
  return (
    <section
      id="work"
      className="scroll-mt-20 overflow-x-hidden border-t border-white/10 bg-neutral-950 py-24 text-white"
    >
      <div className="mb-12 px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {sectionCopy.projects.heading}
        </h2>
        {sectionCopy.projects.subheading && (
          <p className="mx-auto mt-3 max-w-lg text-neutral-400">
            {sectionCopy.projects.subheading}
          </p>
        )}
      </div>

      <FocusRail items={projects} autoPlay={false} loop />
    </section>
  );
}
