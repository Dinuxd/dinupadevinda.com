import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { certifications, chessAchievements, honors } from "@/content/certifications";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Certifications, honors, machine learning training, embedded systems training, and awards for Dinupa Devinda.",
  alternates: {
    canonical: "/certifications/"
  }
};

export default function CertificationsPage() {
  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Certifications"
        title="Certifications"
        description="Certificates and achievements related to machine learning, programming, embedded systems, and business."
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((certification) => (
          <article key={certification.title} className="group relative rounded-md border border-white/10 bg-white/[0.035] p-4 transition hover:z-20">
            <div className="relative z-0 transition group-hover:z-30">
              <Image
                src={certification.image}
                alt={`${certification.title} certificate from ${certification.issuer}`}
                width={900}
                height={640}
                className="aspect-[4/3] cursor-zoom-in rounded bg-graphite-900 object-contain transition duration-300 ease-out group-hover:scale-[1.5] group-hover:shadow-2xl group-hover:ring-1 group-hover:ring-signal-cyan/40"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{certification.title}</h3>
            <p className="mt-1 text-sm font-semibold text-signal-cyan">{certification.issuer}</p>
            <p className="mt-1 text-sm text-slate-400">{certification.date}</p>
            {certification.detail ? (
              <p className="mt-3 text-sm leading-6 text-slate-400">{certification.detail}</p>
            ) : null}
            {certification.credentialUrl ? (
              <a
                href={certification.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-signal-cyan hover:text-signal-cyan"
              >
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
                Verify credential
              </a>
            ) : null}
          </article>
        ))}
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_0.75fr]">
        <div>
          <SectionHeading eyebrow="Honors" title="Competitions and awards" />
          <div className="mt-8 grid gap-5 md:grid-cols-3 lg:grid-cols-1">
            {honors.map((honor) => (
              <article key={honor.title} className="grid gap-4 rounded-md border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[190px_1fr]">
                <Image
                  src={honor.image}
                  alt={`${honor.title} honor evidence`}
                  width={500}
                  height={360}
                  className="aspect-[4/3] rounded bg-graphite-900 object-contain"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{honor.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-signal-cyan">{honor.issuer}</p>
                  <p className="mt-1 text-sm text-slate-400">{honor.date}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{honor.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Chess" title="Competitive discipline" />
          <ul className="mt-8 space-y-3 rounded-md border border-white/10 bg-white/[0.035] p-5">
            {chessAchievements.map((achievement) => (
              <li key={achievement} className="border-l-2 border-signal-green/50 pl-4 text-sm leading-6 text-slate-300">
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
