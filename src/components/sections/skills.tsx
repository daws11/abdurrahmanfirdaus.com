import { motion, type Variants } from "framer-motion";
import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack";
import { LogoCloud } from "@/components/ui/logo-cloud";
import {
  skillCategories,
  skillsIntro,
  skillsDescription,
  techLogos,
} from "@/data/portfolio";

const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function DescriptionParagraphs({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((p, i) => (
        <p key={i} className={i > 0 ? "mt-4" : ""}>
          {p}
        </p>
      ))}
    </>
  );
}

export function Skills() {
  const introParagraphs = skillsDescription.split("\n\n").filter(Boolean);

  return (
    <section
      id="skills"
      className="scroll-mt-20 border-t border-white/10 bg-neutral-950 py-24"
    >
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUpBlur}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {skillsIntro}
          </h2>
          <div className="mt-6 space-y-0 text-base leading-relaxed text-neutral-300 md:text-lg">
            {introParagraphs.map((p, i) => (
              <p key={i} className={i > 0 ? "mt-4" : ""}>
                {p}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUpBlur}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16"
        >
          <ContainerScroll className="space-y-6">
            {skillCategories.map((cat, index) => (
              <CardSticky
                key={cat.name}
                index={index + 2}
                incrementY={64}
                className="rounded-2xl border border-white/10 bg-neutral-900/80 shadow-lg backdrop-blur-sm"
              >
                <div className="border-t border-white/10 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold text-white md:text-2xl">
                      {cat.name}
                    </h3>
                    <span className="shrink-0 text-2xl font-bold text-emerald-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-4 text-base leading-relaxed text-neutral-300">
                    <DescriptionParagraphs text={cat.description} />
                  </div>
                </div>
              </CardSticky>
            ))}
          </ContainerScroll>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUpBlur}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-16 w-full"
      >
        <LogoCloud logos={techLogos} />
      </motion.div>
    </section>
  );
}
