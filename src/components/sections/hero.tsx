/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlitchText } from "@/components/ui/glitch-text";
import {
  profile,
  projects,
  heroHeadline,
  heroSubheadline,
  heroGlitchText,
  heroTyping,
} from "@/data/portfolio";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function HeroTyping({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (phrases.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, 2800);
    return () => clearInterval(id);
  }, [phrases.length]);
  if (phrases.length === 0) return null;
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="inline-block bg-gradient-to-r from-neutral-600 via-white to-neutral-600 bg-[length:200%_auto] bg-clip-text text-transparent [animation:gradient-x_4s_ease_infinite]"
      >
        {phrases[index]}
      </motion.span>
    </AnimatePresence>
  );
}

export function Hero() {
  return (
    <section id="home" className="min-h-screen overflow-hidden relative py-20">
      <div className="mx-auto max-w-7xl relative z-20 px-6">
        <div className="relative ">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlitchText
              as="h1"
              text={heroGlitchText}
              className="z-20 text-primary relative font-bold text-center tracking-[-7px] text-7xl md:text-9xl xl:tracking-[-1rem] md:tracking-[-14px] xl:text-[10rem]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute -bottom-10 left-0 right-0 text-center text-base sm:text-lg md:text-xl lg:text-2xl font-thin tracking-[2px] lg:tracking-[3px] xl:tracking-[4px]"
          >
            <HeroTyping phrases={heroTyping} />
          </motion.div>
        </div>

        <motion.div
          className="grid relative pt-16 md:pt-24"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        >
          <div className="mx-auto grid w-full max-w-4xl grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto] md:gap-10">
            {/* Left — division list */}
            <div className="bg-secondary w-full p-6 font-bold text-xl md:p-8 md:text-2xl lg:text-3xl">
              <div className="space-y-1 font-semibold">
                <div>/ INVENTORY &amp; OPS</div>
                <div>/ FINANCE &amp; ANALYTICS</div>
                <div>/ HR &amp; WORKFORCE</div>
                <div>/ INTEGRATIONS &amp; APIs</div>
              </div>
            </div>

            {/* Right — photo (desktop) */}
            <div className="hidden md:flex w-fit overflow-hidden bg-secondary">
              <img
                src={profile.photo}
                alt={profile.name}
                className="h-72 w-auto object-contain grayscale transition-all duration-500 hover:grayscale-0"
              />
              <div className="rotate-180 p-2 text-left text-xs font-medium tracking-widest [writing-mode:vertical-rl]">
                BASED IN BALI, INDONESIA
              </div>
            </div>
          </div>

          {/* Mobile photo */}
          <div className="mt-8 flex w-fit overflow-hidden bg-secondary md:hidden">
            <img
              src={profile.photo}
              alt={profile.name}
              className="h-72 w-full object-contain grayscale"
            />
            <div className="rotate-180 p-2 text-left text-xs font-medium tracking-widest [writing-mode:vertical-rl]">
              BASED IN BALI, INDONESIA
            </div>
          </div>
        </motion.div>

        {(heroHeadline || heroSubheadline) && (
          <motion.div
            className="md:mt-40 mt-10 flex flex-col items-center"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            {heroHeadline && (
              <p className="mx-auto max-w-2xl text-center text-xl font-medium tracking-tight text-white md:text-2xl">
                {heroHeadline}
              </p>
            )}
            {heroSubheadline && (
              <p className="mx-auto mt-4 max-w-xl text-center text-base text-neutral-400 md:text-lg">
                {heroSubheadline}
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          className="mt-32 flex justify-center pt-6 md:mt-40"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            <Button size={"lg"} asChild>
              <a href="mailto:hello@abdurrahmanfirdaus.com">Contact Me</a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="md:flex mt-20 items-end justify-between"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="group relative">
            <div className="w-60 h-36 shadow-lg border rounded-md overflow-hidden mb-8 md:mb-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2">
              <img
                src={projects[2].imageSrc}
                alt={projects[2].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-60 h-36 absolute left-6 -top-6  shadow-lg border rounded-md overflow-hidden mb-8 md:mb-0 transition-transform duration-500">
              <img
                src={projects[1].imageSrc}
                alt={projects[1].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-60 h-36 absolute left-12 -top-12  shadow-lg border rounded-md overflow-hidden mb-8 md:mb-0 transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:rotate-2">
              <img
                src={projects[0].imageSrc}
                alt={projects[0].title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <a href="#work" className="group block">
            <div className="flex items-center md:justify-end gap-2">
              <span className="text-lg font-medium tracking-wider">
                RECENT WORK
              </span>
              <ArrowDownRight className="size-6 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </div>

            <div className="mt-3 md:text-right">
              <GlitchText
                as="h2"
                text="CODE WITHOUT LIMITS"
                className="text-5xl uppercase tracking-[-4px]"
              />
            </div>
          </a>
        </motion.div>
      </div>
      <div
        className="absolute block dark:hidden inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, #e5e5e5 1px, transparent 1px),
        linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)
      `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      <div
        className="absolute hidden dark:block inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, #404040 1px, transparent 1px),
        linear-gradient(to bottom, #404040 1px, transparent 1px)
      `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
    </section>
  );
}
