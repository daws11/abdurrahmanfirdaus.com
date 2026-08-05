import { ArrowUpRight, PlayCircle } from "lucide-react";

interface CtaToDemoProps {
  demoHash: string;
  repoHref: string;
}

export function CtaToDemo({ demoHash, repoHref }: CtaToDemoProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
      <a
        href={demoHash}
        className="group inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-base font-semibold text-neutral-950 transition-transform hover:scale-105 active:scale-95"
      >
        <PlayCircle className="size-5" />
        Open the demo →
      </a>
      <a
        href={repoHref}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/[0.06]"
      >
        Read the code
        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
