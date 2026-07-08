import Image from "next/image";
import { Download, FolderOpen, Github, Linkedin, Mail } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { MetricCard } from "@/components/metric-card";
import { ProjectGrid } from "@/components/project-grid";
import { SectionHeading } from "@/components/section-heading";
import { education } from "@/content/experience";
import { featuredProjects } from "@/content/projects";
import { profile } from "@/content/profile";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-14 sm:px-6 md:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pt-20">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-signal-green">
            {profile.role}
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-200">{profile.headline}</p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">{profile.summary}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/projects/" icon={FolderOpen}>
              View work
            </ButtonLink>
            <ButtonLink href={profile.links.github} icon={Github} variant="secondary" external>
              GitHub
            </ButtonLink>
            <ButtonLink href={profile.links.linkedin} icon={Linkedin} variant="secondary" external>
              LinkedIn
            </ButtonLink>
            <ButtonLink href={profile.links.cv} icon={Download} variant="secondary">
              Download CV
            </ButtonLink>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {profile.focusChips.map((chip) => (
              <span
                key={chip}
                className="rounded border border-signal-cyan/20 bg-signal-cyan/10 px-3 py-1.5 text-sm font-semibold text-signal-cyan"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="technical-panel p-4">
          <div className="grid gap-4 sm:grid-cols-[0.78fr_1fr] md:grid-cols-1 xl:grid-cols-[0.78fr_1fr]">
            <div className="overflow-hidden rounded-md border border-white/10 bg-graphite-900">
              <Image
                src="/data/avatar/profile_pic.jpg"
                alt="Dinupa Devinda"
                width={520}
                height={640}
                priority
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="rounded-md border border-white/10 bg-graphite-950/70 p-4">
              <div className="grid gap-3">
                {profile.heroStats.map((metric) => (
                  <MetricCard key={metric.label} metric={metric} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="About me"
            title="Machine learning with an engineering base."
            description="I like building useful projects with models, software, data, and systems that solve clear problems."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {profile.capabilities.map((capability) => (
              <div key={capability.title} className="rounded-md border border-white/10 bg-graphite-950/60 p-5">
                <h3 className="text-lg font-semibold text-white">{capability.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{capability.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Education"
          title="Education"
          description="Engineering and physical sciences background."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {education.slice(0, 2).map((item) => (
            <article key={item.title} className="rounded-md border border-white/10 bg-white/[0.035] p-5">
              <p className="text-sm font-semibold text-signal-green">{item.period}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm font-semibold text-signal-cyan">{item.institution}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work"
          description="A few projects that best show my ML and engineering work. More projects are on the Projects page."
        />
        <ProjectGrid projects={featuredProjects} />
      </section>

      <section className="border-t border-white/10 bg-white/[0.025] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-signal-green">
                Contact
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                View the projects or get in touch.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/projects/" icon={FolderOpen}>
                Browse all projects
              </ButtonLink>
              <ButtonLink href={profile.links.emailCompose} icon={Mail} variant="secondary" external>
                Contact me
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
