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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-graphite-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-signal-cyan/40 bg-signal-cyan/10 text-sm font-black text-signal-cyan">
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
          className="order-3 flex w-full flex-wrap items-center gap-1 md:order-none md:w-auto"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
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
            className="rounded-md border border-white/10 p-2 text-slate-300 transition hover:border-signal-cyan hover:text-signal-cyan"
            aria-label="GitHub profile"
          >
            <Github aria-hidden="true" className="h-4 w-4" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-white/10 p-2 text-slate-300 transition hover:border-signal-cyan hover:text-signal-cyan"
            aria-label="LinkedIn profile"
          >
            <Linkedin aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
