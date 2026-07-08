import type { Metadata } from "next";
import { Download, Github, Linkedin, Mail } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { SectionHeading } from "@/components/section-heading";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Dinupa Devinda for machine learning projects, R&D, embedded systems, automation, and technical collaborations.",
  alternates: {
    canonical: "/contact/"
  }
};

export default function ContactPage() {
  const otherLinks = [
    { label: "WhatsApp", href: profile.links.whatsapp },
    { label: "Instagram", href: profile.links.instagram },
    { label: "Facebook", href: profile.links.facebook },
    { label: "Kaggle", href: profile.links.kaggle },
    { label: "FIDE", href: profile.links.fide },
    { label: "X", href: profile.links.x }
  ];

  return (
    <section className="section-pad mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Contact"
        title="Open to ML engineering, R&D, and project work"
        description="For roles, internships, projects, or collaborations, email and LinkedIn are the best ways to reach me."
        align="center"
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <ButtonLink href={profile.links.emailCompose} icon={Mail} external>
          Email
        </ButtonLink>
        <ButtonLink href={profile.links.linkedin} icon={Linkedin} variant="secondary" external>
          LinkedIn
        </ButtonLink>
        <ButtonLink href={profile.links.github} icon={Github} variant="secondary" external>
          GitHub
        </ButtonLink>
        <ButtonLink href={profile.links.cv} icon={Download} variant="secondary">
          CV
        </ButtonLink>
      </div>

      <div className="mt-10 rounded-md border border-white/10 bg-white/[0.035] p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-signal-green">
          Location
        </p>
        <p className="mt-2 text-xl font-semibold text-white">{profile.location}</p>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Email: {profile.email}
          <br />
          Mobile: {profile.phone}
        </p>
      </div>

      <div className="mt-6 rounded-md border border-white/10 bg-white/[0.02] p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Other links
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {otherLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-white/10 px-2.5 py-1 text-xs text-slate-400 transition hover:border-signal-cyan hover:text-signal-cyan"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
