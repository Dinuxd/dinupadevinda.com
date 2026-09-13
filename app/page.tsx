import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, BrainCircuit, Code2, Cpu, Download, FolderOpen, Mail } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { ProjectGrid } from "@/components/project-grid";
import { SectionHeading } from "@/components/section-heading";
import { education } from "@/content/experience";
import { featuredProjects } from "@/content/projects";
import { profile } from "@/content/profile";

const focusAreas = [
  { icon: BrainCircuit, title: "Machine learning", detail: "Computer vision, audio classification, and sensor-based models." },
  { icon: Code2, title: "Language models & RAG", detail: "Language modelling, retrieval, evaluation, and interpretability." },
  { icon: Cpu, title: "Applied AI systems", detail: "Model serving, backend APIs, cloud deployment, and edge inference." }
];

export default function HomePage() {
  return (
    <>
      <section className="profile-hero">
        <div className="hero-inner">
          <div className="hero-copy hero-fade">
            <p className="hero-role">{profile.role}</p>
            <h1>Dinupa<br />Devinda</h1>
            <p className="hero-specialism">{profile.headline}</p>
            <p className="hero-intro">
              I build and explore AI systems, from computer vision and sensor-based
              models to language models, RAG, and the software that brings them to life.
            </p>
            <div className="hero-actions">
              <ButtonLink href="/projects/" icon={FolderOpen}>Explore projects</ButtonLink>
              <ButtonLink href={profile.links.cv} icon={Download} variant="secondary">Download CV</ButtonLink>
            </div>
            <Link className="hero-employment" href="/experience/">
              <span className="employment-marker" aria-hidden="true" />
              <span>At Scicom MSC Berhad<span className="employment-title">Trainee - Software Engineer (AI/ML)</span></span>
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          </div>
          <figure className="hero-portrait hero-fade hero-fade-d1">
            <div className="portrait-crop">
              <Image src={profile.portrait} alt="Dinupa Devinda wearing a suit outdoors" width={1254} height={1254} priority sizes="(max-width: 380px) 104px, (max-width: 760px) 124px, 440px" />
            </div>
            <figcaption><span>Colombo, Sri Lanka</span><a href="#focus" aria-label="Explore my work"><ArrowDown size={20} /></a></figcaption>
          </figure>
        </div>
      </section>

      <section id="focus" className="expertise-band">
        <div className="expertise-inner">
          <div className="expertise-heading"><h2>What I work on</h2><Link href="/about/">More about me <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
          <div className="expertise-grid">
            {focusAreas.map(({ icon: Icon, title, detail }) => (
              <div className="expertise-item" key={title}>
                <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
                <h3>{title}</h3><p>{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="section-with-link">
          <SectionHeading title="Selected work" description="Experiments, applications, and engineering projects." />
          <Link href="/projects/" className="text-link">All projects <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        <ProjectGrid projects={featuredProjects} />
      </section>

      <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="An engineering foundation" description="Electrical and electronic engineering, computer science, and mathematics." />
        <div className="education-list">
          {education.slice(0, 2).map((item) => (
            <article key={item.title}>
              <p className="text-sm text-slate-400">{item.period}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm font-semibold text-signal-cyan">{item.institution}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-band">
        <div><p>Have something in mind?</p><h2>Let&apos;s talk AI.</h2></div>
        <ButtonLink href={profile.links.emailCompose} icon={Mail} external>Get in touch</ButtonLink>
      </section>
    </>
  );
}
