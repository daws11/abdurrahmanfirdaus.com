import { motion } from "framer-motion";
import { profile, aboutManifesto, aboutPullQuote, education } from "@/data/portfolio";

export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-white/10 bg-neutral-950 py-20 text-white md:py-28"
    >
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-3"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            About
          </span>
          <p className="max-w-3xl text-2xl font-medium leading-snug text-white md:text-3xl lg:text-4xl">
            {profile.bio}
          </p>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 max-w-3xl font-serif text-3xl italic leading-tight text-neutral-200 md:text-4xl lg:text-5xl"
        >
          &ldquo;{aboutPullQuote}&rdquo;
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col gap-4 border-l-2 border-emerald-400/60 pl-5"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
            How I work
          </span>
          <p className="font-serif text-2xl leading-snug text-white md:text-3xl">
            {aboutManifesto}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm text-neutral-500"
        >
          {education.map((e) => (
            <span key={e.title}>
              <span className="font-medium text-neutral-300">{e.category}</span>
              <span className="ml-2 text-neutral-600">·</span>
              <span className="ml-2">{e.date}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
