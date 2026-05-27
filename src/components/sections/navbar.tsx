import * as React from "react";
import { Github, Linkedin, Instagram, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, social, profile } from "@/data/portfolio";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-white/10 bg-neutral-950/80 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#home" className="text-lg font-bold tracking-tight">
          {profile.nickname}
          <span className="text-emerald-400">.</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <SocialIcons />
        </div>

        {/* Mobile toggle */}
        <button
          className="text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-neutral-950/95 backdrop-blur-md md:hidden">
          <ul className="flex flex-col px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm font-medium text-neutral-300 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-4 pt-4">
              <SocialIcons />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function SocialIcons() {
  return (
    <>
      <a
        href={social.github}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="text-neutral-400 transition-colors hover:text-white"
      >
        <Github className="size-5" />
      </a>
      <a
        href={social.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        className="text-neutral-400 transition-colors hover:text-white"
      >
        <Linkedin className="size-5" />
      </a>
      <a
        href={social.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className="text-neutral-400 transition-colors hover:text-white"
      >
        <Instagram className="size-5" />
      </a>
    </>
  );
}
