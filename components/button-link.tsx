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
  const isStaticAsset =
    href.startsWith("/data/") || /\.(pdf|zip|png|jpe?g|webp|svg|mp4)(\?.*)?$/i.test(href);
  const classes = [
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-all duration-300",
    "focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-graphite-950",
    variant === "primary"
      ? "border-cyan-300/45 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white shadow-lg shadow-cyan-500/18 hover:-translate-y-0.5 hover:from-blue-500 hover:via-cyan-400 hover:to-teal-300 hover:shadow-cyan-400/24"
      : "",
    variant === "secondary"
      ? "border-cyan-300/15 bg-cyan-950/25 backdrop-blur-sm text-slate-200 hover:-translate-y-0.5 hover:border-cyan-300/42 hover:bg-cyan-900/20 hover:text-white"
      : "",
    variant === "ghost"
      ? "border-transparent bg-transparent text-slate-200 hover:-translate-y-0.5 hover:text-cyan-200"
      : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  if (
    external ||
    isStaticAsset ||
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        download={href.toLowerCase().includes(".pdf") ? true : undefined}
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
