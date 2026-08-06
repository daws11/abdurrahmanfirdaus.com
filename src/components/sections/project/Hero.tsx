interface HeroProps {
  id: string;
  heroSrc: string;
  division: string;
  duration: string;
}

export function Hero({ id, heroSrc, division, duration }: HeroProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl shadow-black/40">
      <img
        src={heroSrc}
        alt={`${id} placeholder`}
        className="block aspect-[3/4] w-full object-cover object-top"
      />
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-neutral-950/90 to-transparent px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
        <span>{division}</span>
        <span className="text-emerald-400">{duration}</span>
      </div>
    </div>
  );
}
