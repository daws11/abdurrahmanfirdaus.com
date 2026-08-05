interface SidebarProps {
  fdeCallout: string;
  impact: { label: string; value: string }[];
  outcomes: string[];
  stack: string[];
  integrations: string[];
  duration: string;
  teamSize: string;
}

export function Sidebar({
  fdeCallout,
  impact,
  outcomes,
  stack,
  integrations,
  duration,
  teamSize,
}: SidebarProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* FDE callout */}
      <blockquote className="relative border-l-2 border-emerald-400/60 pl-5">
        <p className="text-base italic leading-relaxed text-neutral-300 md:text-lg">
          {fdeCallout}
        </p>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400">
          FDE moment
        </p>
      </blockquote>

      {/* Impact chips */}
      {impact.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {impact.map((m) => (
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

      {/* Outcomes list */}
      {outcomes.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
            What changed
          </p>
          <ul className="space-y-2 text-sm text-neutral-300 md:text-base">
            {outcomes.map((o) => (
              <li key={o} className="flex gap-2">
                <span className="text-emerald-400">→</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Meta: duration + team */}
      <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
        <Meta label="Duration" value={duration} />
        <Meta label="Team" value={teamSize} />
      </div>

      {/* Stack + integrations */}
      <StackColumn label="Stack" items={stack} variant="mono" />
      <StackColumn label="Integrations" items={integrations} variant="pill" />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
        {label}
      </p>
      <p className="text-sm font-medium text-neutral-200">{value}</p>
    </div>
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
          ),
        )}
      </div>
    </div>
  );
}
