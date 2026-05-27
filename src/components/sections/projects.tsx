import { FocusRail } from "@/components/ui/focus-rail";
import { projects } from "@/data/portfolio";

export function Projects() {
  return (
    <section
      id="work"
      className="scroll-mt-20 overflow-x-hidden border-t border-white/10 bg-neutral-950 py-24 text-white"
    >
      <div className="mb-12 px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Projects <span className="text-emerald-400">Made</span>
        </h2>
        <p className="mt-3 text-neutral-400">
          Drag, swipe, or use the arrows to explore selected work.
        </p>
      </div>

      <FocusRail items={projects} autoPlay={false} loop />
    </section>
  );
}
