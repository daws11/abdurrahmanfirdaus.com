import { Timeline } from "@/components/ui/timeline";
import { experience, sectionCopy } from "@/data/portfolio";

export function Experience() {
  const data = experience.map((company) => ({
    title: company.company,
    content: (
      <div className="space-y-6">
        {company.roles.map((role, i) => (
          <div key={i}>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold text-neutral-800 md:text-lg dark:text-neutral-100">
                {role.position}
              </p>
              {role.current && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  Current
                </span>
              )}
            </div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500 md:text-sm">
              {role.date}
            </p>
            <p className="text-sm font-normal leading-relaxed text-neutral-700 md:text-base dark:text-neutral-300">
              {role.description}
            </p>
          </div>
        ))}
      </div>
    ),
  }));

  return (
    <section id="experience" className="scroll-mt-20 border-t border-white/10">
      <Timeline
        data={data}
        heading={sectionCopy.experience.heading}
        subheading={sectionCopy.experience.subheading}
      />
    </section>
  );
}
