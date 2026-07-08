import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.28em] text-signal-green">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Page not found</h1>
      <p className="mt-4 text-base leading-7 text-slate-400">
        This route is not part of the exported portfolio.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-md border border-signal-cyan bg-signal-cyan px-4 text-sm font-semibold text-graphite-950 transition hover:bg-white"
      >
        Back home
      </Link>
    </section>
  );
}
