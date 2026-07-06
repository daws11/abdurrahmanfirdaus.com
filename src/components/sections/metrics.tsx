import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { metrics, sectionCopy } from "@/data/portfolio";

function CountUp({
  to,
  suffix = "",
}: {
  to: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => Math.round(v));
  useEffect(() => {
    if (inView) {
      const controls = animate(value, to, {
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1],
      });
      return () => controls.stop();
    }
  }, [inView, to, value]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function Metrics() {
  const featured = metrics.find((m) => m.featured);
  const rest = metrics.filter((m) => !m.featured);

  return (
    <section
      id="metrics"
      className="scroll-mt-20 border-t border-white/10 bg-neutral-950 py-20 text-white md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex items-baseline gap-4"
        >
          <h2 className="font-serif text-4xl italic md:text-5xl">
            {sectionCopy.metrics.heading}
          </h2>
          <span className="text-sm text-neutral-500">
            {sectionCopy.metrics.subheading}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-10">
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="md:col-span-2"
            >
              <p className="bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 bg-clip-text font-serif text-[7rem] font-medium leading-[0.95] tracking-tight text-transparent md:text-[9rem] lg:text-[11rem]">
                <CountUp
                  to={featured.numericValue ?? 0}
                  suffix="%"
                />
              </p>
              <p className="mt-2 text-base font-semibold text-white md:text-lg">
                {featured.label}
              </p>
              <p className="mt-1 text-sm text-neutral-500">{featured.detail}</p>
            </motion.div>
          )}

          <div className="flex flex-col gap-6 md:col-span-3 md:gap-8 md:border-l md:border-white/10 md:pl-10">
            {rest.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-baseline gap-5"
              >
                <p className="shrink-0 bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text font-serif text-5xl font-medium leading-none tracking-tight text-transparent md:text-6xl">
                  <CountUp
                    to={m.numericValue ?? 0}
                    suffix={m.value.replace(/[0-9]/g, "")}
                  />
                </p>
                <div>
                  <p className="text-base font-semibold text-white">
                    {m.label}
                  </p>
                  <p className="text-sm text-neutral-500">{m.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
