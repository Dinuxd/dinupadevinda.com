import type { Metadata } from "next";
import Image from "next/image";
import { Download, Github, Linkedin } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { SectionHeading } from "@/components/section-heading";
import { education } from "@/content/experience";
import { profile, skills } from "@/content/profile";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Dinupa Devinda, a machine learning focused engineering graduand with embedded systems, software, and R&D project experience.",
  alternates: {
    canonical: "/about/"
  }
};

export default function AboutPage() {
  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Image
            src="/data/avatar/profile_pic.jpg"
            alt="Portrait of Dinupa Devinda"
            width={620}
            height={760}
            className="rounded-md border border-white/10 object-cover"
          />
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href={profile.links.github} icon={Github} external>
              GitHub
            </ButtonLink>
            <ButtonLink href={profile.links.linkedin} icon={Linkedin} variant="secondary" external>
              LinkedIn
            </ButtonLink>
            <ButtonLink href={profile.links.cv} icon={Download} variant="secondary">
              CV
            </ButtonLink>
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="About me"
            title="Engineering graduand focused on machine learning."
            description={profile.summary}
          />
          <div className="mt-8 space-y-5 text-base leading-7 text-slate-300">
            <p>
              My projects sit across machine learning, software, embedded
              systems, and engineering prototypes. I have worked on model
              training, evaluation, Raspberry Pi deployment, computer vision,
              audio classification, IMU data, backend APIs, dashboards, and
              automation prototypes.
            </p>
            <p>
              I am interested in using machine learning and engineering to solve
              practical problems. I have also worked with lightweight model
              deployment on Raspberry Pi where it fit the project.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {skills.map((group) => (
              <div key={group.group} className="rounded-md border border-white/10 bg-white/[0.035] p-5">
                <h3 className="text-lg font-semibold text-white">{group.group}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded border border-white/10 px-2.5 py-1 text-xs text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <SectionHeading
          eyebrow="Education"
          title="Education"
          description="Graduand in engineering and physical sciences."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {education.map((item) => (
            <article key={item.title} className="rounded-md border border-white/10 bg-white/[0.035] p-5">
              <p className="text-sm font-semibold text-signal-green">{item.period}</p>
              <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm font-semibold text-signal-cyan">{item.institution}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
