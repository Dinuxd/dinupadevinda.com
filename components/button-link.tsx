import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { ArrowUpRight } from "lucide-react";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  icon: Icon = ArrowUpRight,
  variant = "primary",
  external,
  className = ""
}: ButtonLinkProps) {
  const classes = [
    "inline-flex h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition",
    "focus:outline-none focus:ring-2 focus:ring-signal-cyan focus:ring-offset-2 focus:ring-offset-graphite-950",
    variant === "primary"
      ? "border-signal-cyan bg-signal-cyan text-graphite-950 hover:bg-white"
      : "",
    variant === "secondary"
      ? "border-white/15 bg-white/[0.04] text-white hover:border-signal-green hover:text-signal-green"
      : "",
    variant === "ghost"
      ? "border-transparent bg-transparent text-slate-200 hover:text-signal-cyan"
      : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        <Icon aria-hidden="true" className="h-4 w-4" />
        <span>{children}</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      <Icon aria-hidden="true" className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
}
