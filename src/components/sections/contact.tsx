import { MessageCircle, Mail, Github, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile, social, sectionCopy } from "@/data/portfolio";

export function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-white/10 bg-neutral-950 py-24 text-white"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {sectionCopy.contact.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-neutral-400">
          {sectionCopy.contact.subheading}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <a href={social.whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-1 size-4" /> Contact Me!
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href={`mailto:${profile.email}`}>
              <Mail className="mr-1 size-4" /> Email
            </a>
          </Button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <a
            href={social.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-neutral-400 transition-colors hover:text-white"
          >
            <Github className="size-6" />
          </a>
          <a
            href={social.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-neutral-400 transition-colors hover:text-white"
          >
            <Linkedin className="size-6" />
          </a>
          <a
            href={social.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-neutral-400 transition-colors hover:text-white"
          >
            <Instagram className="size-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
