import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-graphite-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
            Dinupa Devinda
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Copyright 2026 Dinupa Devinda. Built and maintained by Dinupa Devinda.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link className="text-sm font-semibold text-slate-300 hover:text-signal-cyan" href="/projects/">
            Projects
          </Link>
          <a
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-300 hover:text-signal-cyan"
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github aria-hidden="true" className="h-4 w-4" />
            GitHub
          </a>
          <a
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-300 hover:text-signal-cyan"
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin aria-hidden="true" className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-300 hover:text-signal-cyan"
            href={profile.links.emailCompose}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Mail aria-hidden="true" className="h-4 w-4" />
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
