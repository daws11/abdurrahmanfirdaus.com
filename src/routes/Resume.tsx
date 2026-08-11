import { useEffect } from "react";
import {
  profile,
  social,
  experience,
  education,
  certifications,
  resumeSummary,
  resumeSkillGroups,
  projectStories,
} from "@/data/portfolio";

const LINK_CLASS = "text-blue-600 no-underline";
const PORTFOLIO_ORIGIN = "https://abdurrahmanfirdaus.com";

/**
 * Print-optimized resume, mounted at /resume (see App.tsx path check).
 * Single source of truth: reads only from src/data/portfolio.ts, so a
 * copy change there is reflected here on the next `npm run cv`.
 *
 * ATS constraints driving the layout: single column, no tables/icons/images,
 * a system font (no web-font dependency during headless PDF export),
 * bulleted achievements instead of prose blocks, and typographic characters
 * (arrows, en/em dashes, curly quotes) swapped for plain-ASCII equivalents
 * that every parser handles — see atsSafe() below.
 */

const ATS_FONT_STACK = 'Arial, Helvetica, "Liberation Sans", sans-serif';

function atsSafe(text: string): string {
  return text
    .replace(/→/g, "to")
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

/** Split a description into sentence-level bullets. */
function toBullets(text: string): string[] {
  return atsSafe(text)
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function Resume() {
  useEffect(() => {
    document.title = `${profile.name} — Resume`;
  }, []);

  return (
    <div
      className="min-h-screen bg-white text-neutral-900 text-[13px] leading-[1.45] print:text-[11px]"
      style={{ fontFamily: ATS_FONT_STACK }}
    >
      <style>{`
        html { color-scheme: light !important; }
        html, body { background: #ffffff !important; }
        @page { size: Letter; margin: 0.5in; }
      `}</style>
      <div className="mx-auto max-w-[8.5in] px-10 py-10 print:px-0 print:py-0">
        <header className="mb-3 border-b border-neutral-300 pb-3">
          <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
          <p className="text-sm font-medium text-neutral-700">{profile.title}</p>
          <p className="mt-1 text-[11px] text-neutral-600">
            {profile.location} |{" "}
            <a href={`mailto:${profile.email}`} className={LINK_CLASS}>
              {profile.email}
            </a>{" "}
            |{" "}
            <a href={social.whatsapp} className={LINK_CLASS}>
              {social.whatsapp.replace("https://wa.me/", "+")}
            </a>{" "}
            |{" "}
            <a href={social.linkedin} className={LINK_CLASS}>
              {social.linkedin.replace("https://www.", "")}
            </a>{" "}
            |{" "}
            <a href={social.github} className={LINK_CLASS}>
              {social.github.replace("https://", "")}
            </a>{" "}
            |{" "}
            <a href={PORTFOLIO_ORIGIN} className={LINK_CLASS}>
              abdurrahmanfirdaus.com
            </a>
          </p>
        </header>

        <section className="mb-3 break-inside-avoid">
          <h2 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Summary
          </h2>
          <p className="text-[12px] text-neutral-700">{atsSafe(resumeSummary)}</p>
        </section>

        <section className="mb-3 break-inside-avoid">
          <h2 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Skills
          </h2>
          <div className="space-y-0.5 text-[12px]">
            {resumeSkillGroups.map((group) => (
              <p key={group.label}>
                <span className="font-medium">{group.label}:</span> {group.items.join(", ")}
              </p>
            ))}
          </div>
        </section>

        <section className="mb-3">
          <h2 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Experience
          </h2>
          <div className="space-y-2">
            {experience.map((company) => (
              <div key={company.company}>
                <p className="font-semibold">{company.company}</p>
                {company.roles.map((role) => (
                  <div key={role.position + role.date} className="mt-0.5 pl-3 break-inside-avoid">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-medium">{role.position}</span>
                      <span className="shrink-0 text-[11px] text-neutral-500">{role.date}</span>
                    </div>
                    <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[12px] text-neutral-700">
                      {toBullets(role.description).map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                      {role.impact && (
                        <li className="font-medium text-neutral-800">{atsSafe(role.impact)}</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-3">
          <h2 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Projects
          </h2>
          <ul className="list-disc space-y-1 pl-4 text-[12px]">
            {projectStories.map((p) => (
              <li key={p.id} className="break-inside-avoid">
                <a href={`${PORTFOLIO_ORIGIN}/#/projects/${p.id}`} className={`${LINK_CLASS} font-medium`}>
                  {p.division}
                </a>{" "}
                - {atsSafe(p.outcomes[0])}
                {p.impact[0] && (
                  <span>
                    {" "}
                    ({p.impact[0].label}: {atsSafe(p.impact[0].value)})
                  </span>
                )}
                {p.stack.length > 0 && (
                  <span className="text-neutral-500"> - Stack: {p.stack.join(", ")}</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-3 break-inside-avoid">
          <h2 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Education
          </h2>
          {education.map((e) => (
            <div key={e.title} className="flex items-baseline justify-between gap-4 text-[12px]">
              <span>
                <span className="font-medium">{e.title}</span> - {e.category}
              </span>
              <span className="shrink-0 text-neutral-500">{e.date}</span>
            </div>
          ))}
        </section>

        <section className="break-inside-avoid">
          <h2 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Certifications
          </h2>
          <div className="space-y-0.5">
            {certifications.map((c) => (
              <div key={c.title} className="flex items-baseline justify-between gap-4 text-[12px]">
                <span>
                  {c.href ? (
                    <a href={c.href} className={`${LINK_CLASS} font-medium`}>
                      {c.title}
                    </a>
                  ) : (
                    <span className="font-medium">{c.title}</span>
                  )}
                  {c.category && ` - ${c.category}`}
                </span>
                {c.date && <span className="shrink-0 text-neutral-500">{c.date}</span>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
