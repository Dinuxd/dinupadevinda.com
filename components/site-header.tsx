import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { profile } from "@/content/profile";

const navItems = [
  { href: "/about/", label: "About" },
  { href: "/experience/", label: "Experience" },
  { href: "/projects/", label: "Projects" },
  { href: "/certifications/", label: "Certifications" },
  { href: "/contact/", label: "Contact" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-300/10 bg-graphite-950/95 shadow-[0_8px_24px_rgba(0,0,0,0.16)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-sm font-black text-cyan-200 shadow-glow transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-teal-300/60 group-hover:text-white group-hover:shadow-glow-lg">
            DD
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Dinupa Devinda
            </span>
            <span className="block text-xs text-slate-400">{profile.role}</span>
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="site-navigation order-3 flex w-full items-center gap-1 overflow-x-auto md:order-none md:w-auto"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md px-2 py-2 text-xs font-medium text-slate-300 transition-colors sm:px-3 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-cyan-300/15 bg-cyan-300/5 p-2 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-cyan-100 hover:shadow-glow"
            aria-label="GitHub profile"
          >
            <Github aria-hidden="true" className="h-4 w-4" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-cyan-300/15 bg-cyan-300/5 p-2 text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-cyan-100 hover:shadow-glow"
            aria-label="LinkedIn profile"
          >
            <Linkedin aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
