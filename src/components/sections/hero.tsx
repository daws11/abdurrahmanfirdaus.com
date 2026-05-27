/* eslint-disable @next/next/no-img-element */
import { motion, type Variants } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlitchText } from "@/components/ui/glitch-text";
import { profile, projects } from "@/data/portfolio";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

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
              text="SOFTWARE ENGINEER"
              className="z-20 text-primary relative font-bold text-center tracking-[-7px] text-7xl md:text-9xl xl:tracking-[-1rem] md:tracking-[-14px] xl:text-[10rem]"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute -bottom-12 left-6 sm:left-12 lg:left-24 whitespace-nowrap text-2xl lg:text-3xl xl:text-4xl font-thin tracking-[2px] lg:tracking-[4px] xl:tracking-[6px] bg-gradient-to-r from-neutral-600 via-white to-neutral-600 bg-[length:200%_auto] bg-clip-text text-transparent [animation:gradient-x_4s_ease_infinite]"
          >
            {profile.name}
          </motion.p>
        </div>

        <motion.div
          className="grid relative"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        >
          <div className="space-y-8 pt-20 flex gap-6 justify-center">
            <div className="flex gap-6 bg-secondary w-full max-w-xl h-fit p-10 items-end space-y-2 text-xl font-bold md:text-2xl lg:text-3xl">
              <div className="font-semibold text-xl">
                <div>/ WEB DEVELOPMENT</div>
                <div>/ MOBILE DEVELOPMENT</div>
                <div>/ BACKEND &amp; APIs</div>
              </div>
              <div className="absolute hidden  md:flex left-1/2 -top-10 w-fit overflow-hidden bg-secondary">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="h-100 w-full object-contain grayscale transition-all duration-500 hover:grayscale-0"
                />
                <div className="text-left p-2 rotate-180 [writing-mode:vertical-rl] text-xs font-medium tracking-widest">
                  BASED IN BANDUNG, INDONESIA
                </div>
              </div>
            </div>
          </div>
          <div className="flex md:hidden left-1/2 -top-10 w-full md:w-fit overflow-hidden bg-secondary">
            <img
              src={profile.photo}
              alt={profile.name}
              className="h-100 w-full object-contain grayscale"
            />
            <div className="text-left p-2 rotate-180 [writing-mode:vertical-rl] text-xs font-medium tracking-widest">
              BASED IN BANDUNG, INDONESIA
            </div>
          </div>
        </motion.div>

        <motion.div
          className="md:mt-40 mt-10 flex flex-col items-center"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <p className="mx-auto max-w-2xl font-mono text-center text-sm font-medium tracking-wide text-muted-foreground md:text-base">
            I'M A FULL-STACK DEVELOPER &amp; TECH LEAD,
            <br />
            BUILDING RELIABLE WEB &amp; MOBILE PRODUCTS
            <br />
            WITH 3+ YEARS OF EXPERIENCE
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center pt-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            <Button size={"lg"} asChild>
              <a href="#contact">Contact Me</a>
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
