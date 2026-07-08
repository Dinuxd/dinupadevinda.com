import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { experience } from "@/content/experience";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Engineering experience of Dinupa Devinda across Sri Lanka Telecom R&D, embedded IoT, secure telemetry, factory automation, and mechatronics.",
  alternates: {
    canonical: "/experience/"
  }
};

export default function ExperiencePage() {
  return (
    <section className="section-pad mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Experience"
        title="Engineering experience"
        description="Hands-on work in embedded systems, telecom R&D, automation, IoT, and electronics manufacturing."
      />

      <div className="mt-10 space-y-6">
        {experience.map((item) => (
          <article key={`${item.organization}-${item.role}`} className="rounded-md border border-white/10 bg-white/[0.035] p-6">
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
            <ul className="mt-5 space-y-3">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="border-l-2 border-signal-cyan/40 pl-4 text-sm leading-6 text-slate-300">
                  {highlight}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.stack.map((skill) => (
                <span key={skill} className="rounded border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
