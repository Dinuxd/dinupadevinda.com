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
    "About Dinupa Devinda, an AI/ML and software engineer working across computer vision, language models, RAG, and applied machine learning.",
  alternates: {
    canonical: "/about/"
  }
};

export default function AboutPage() {
  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="portrait-crop">
          <Image
            src={profile.portrait}
            alt="Portrait of Dinupa Devinda"
            width={1254}
            height={1254}
          />
          </div>
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
            title="Machine Learning & Applied AI Systems"
            description={profile.summary}
          />
          <div className="mt-8 space-y-5 text-base leading-7 text-slate-300">
            <p>
              I joined Scicom MSC Berhad in September 2026 as a Trainee - Software
              Engineer (AI/ML), working in a hybrid role in Sri Lanka.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {skills.map((group) => (
              <div key={group.group} className="glass rounded-md p-5">
                <h3 className="text-lg font-semibold text-white">{group.group}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded border border-cyan-300/12 bg-cyan-300/5 px-2.5 py-1 text-xs text-slate-300">
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
          description="Engineering and physical sciences background."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {education.map((item) => (
            <article key={item.title} className="glass rounded-md p-5">
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
