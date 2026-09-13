import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { experience } from "@/content/experience";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Dinupa Devinda's experience at Scicom MSC Berhad, Sri Lanka Telecom, and Variosystems, across AI/ML software engineering, embedded systems, and automation.",
  alternates: {
    canonical: "/experience/"
  }
};

export default function ExperiencePage() {
  return (
    <section className="section-pad mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Experience"
        title="Experience"
        description="AI/ML software engineering at Scicom, with previous experience in telecom R&D, embedded systems, and industrial automation."
      />

      <div className="mt-10 space-y-6">
        {experience.map((item) => (
          <article key={`${item.organization}-${item.role}`} className="glass rounded-md p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal-green">
                  {item.period}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">{item.role}</h3>
                <p className="mt-1 text-sm font-semibold text-signal-cyan">
                  {item.organization} - {item.location}
                </p>
              </div>
            </div>
            <p className="mt-5 text-base leading-7 text-slate-300">{item.summary}</p>
            {item.highlights.length > 0 && <ul className="mt-5 space-y-3">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="border-l-2 border-signal-cyan/40 pl-4 text-sm leading-6 text-slate-300">
                  {highlight}
                </li>
              ))}
            </ul>}
            {item.stack.length > 0 && <div className="mt-5 flex flex-wrap gap-2">
              {item.stack.map((skill) => (
                <span key={skill} className="rounded border border-cyan-300/12 bg-cyan-300/5 px-2.5 py-1 text-xs text-slate-300">
                  {skill}
                </span>
              ))}
            </div>}
          </article>
        ))}
      </div>
    </section>
  );
}
