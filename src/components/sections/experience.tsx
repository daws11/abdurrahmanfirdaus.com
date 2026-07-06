import { Timeline } from "@/components/ui/timeline";
import { experience, tickerItems, sectionCopy } from "@/data/portfolio";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

export function Experience() {
  const data = experience.map((company) => ({
    title: company.company,
    content: (
      <div className="space-y-6">
        {company.roles.map((role, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex flex-wrap items-baseline gap-3">
              <p className="text-base font-semibold text-white">
                {role.position}
              </p>
              <span className="text-xs text-neutral-500">{role.date}</span>
              {role.current && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-400">
                  Current
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-neutral-300">
              {role.description}
            </p>
            {role.impact && (
              <p className="font-serif text-base italic text-neutral-200 md:text-lg">
                &mdash; {role.impact}
              </p>
            )}
          </div>
        ))}
      </div>
    ),
  }));

  return (
    <>
      <section
        id="experience"
        className="scroll-mt-20 overflow-hidden border-t border-white/10 bg-neutral-950 py-3"
      >
        <InfiniteSlider gap={32} duration={40} className="text-sm text-neutral-500">
          {tickerItems.map((item) => (
            <span key={item} className="flex items-center gap-8">
              <span className="font-medium uppercase tracking-widest">
                {item}
              </span>
              <span className="text-neutral-700">/</span>
            </span>
          ))}
        </InfiniteSlider>
      </section>

      <section className="scroll-mt-20 border-t border-white/10">
        <Timeline
          data={data}
          heading={sectionCopy.experience.heading}
          subheading={sectionCopy.experience.subheading}
        />
      </section>
    </>
  );
}
