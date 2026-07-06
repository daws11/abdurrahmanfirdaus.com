import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Instagram, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile, social, sectionCopy } from "@/data/portfolio";

export function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-white/10 bg-neutral-950 py-24 text-white md:py-32"
    >
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h2 className="font-serif text-4xl italic leading-[1.1] md:text-5xl lg:text-6xl">
            {sectionCopy.contact.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-neutral-400 md:text-lg">
            {sectionCopy.contact.subheading}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex justify-center"
        >
          <Button size="lg" asChild className="group h-14 px-8 text-base">
            <a href={social.whatsapp} target="_blank" rel="noreferrer">
              Start a conversation
              <ArrowUpRight className="ml-2 size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-col items-center gap-4 text-sm md:flex-row md:justify-center md:gap-8"
        >
          <a
            href={`mailto:${profile.email}`}
            className="text-neutral-300 transition-colors hover:text-white"
          >
            {profile.email}
          </a>
          <span className="hidden text-neutral-700 md:inline">·</span>
          <a
            href={social.resume}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-neutral-300 transition-colors hover:text-white"
          >
            <Download className="size-3.5" />
            Download CV
          </a>
          <span className="hidden text-neutral-700 md:inline">·</span>
          <a
            href={social.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-neutral-300 transition-colors hover:text-white"
          >
            <Github className="size-4" />
          </a>
          <a
            href={social.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-neutral-300 transition-colors hover:text-white"
          >
            <Linkedin className="size-4" />
          </a>
          <a
            href={social.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-neutral-300 transition-colors hover:text-white"
          >
            <Instagram className="size-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
