import { useProjectRoute } from "@/lib/use-project-route";

export function ProjectNotFound() {
  const route = useProjectRoute();
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-neutral-950 px-6 text-white">
      <div className="max-w-md text-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Case study · 404
        </div>
        <h1 className="mt-2 font-serif text-3xl italic leading-tight md:text-4xl">
          That project page isn't on the shelf.
        </h1>
        <p className="mt-3 text-sm text-neutral-400 md:text-base">
          {route.id
            ? `No case study found for "${route.id}".`
            : "Open a project from the case studies section."}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 text-sm">
          <a
            href="#work"
            className="inline-flex h-9 items-center rounded-md border border-white/10 bg-white/5 px-4 font-medium text-white hover:bg-white/10"
          >
            ← Back to case studies
          </a>
          <a
            href="#/demos"
            className="inline-flex h-9 items-center rounded-md bg-white px-4 font-medium text-black hover:scale-105 active:scale-95"
          >
            Open demos hub →
          </a>
        </div>
      </div>
    </div>
  );
}