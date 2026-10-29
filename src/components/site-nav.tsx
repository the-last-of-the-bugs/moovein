import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="Moovein home">
      <span className="font-display text-lg font-bold tracking-tight">
        m
        <span className="relative inline-flex" aria-hidden="true">
          <Eye />
          <Eye />
        </span>
        vein
      </span>
    </Link>
  );
}

function Eye() {
  return (
    <span className="mx-px inline-flex size-[0.62em] translate-y-[0.16em] items-center justify-center rounded-full bg-foreground">
      <span className="size-[0.24em] rounded-full bg-background" />
    </span>
  );
}

const links: { label: string; to: "/" | "/docs"; hash?: string }[] = [
  { label: "Docs", to: "/docs" },
  { label: "Easing", to: "/docs", hash: "easing" },
  { label: "Scroll", to: "/", hash: "scroll" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              {...(l.hash ? { hash: l.hash } : {})}
              className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/docs"
            hash="install"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.04]"
          >
            Get started
          </Link>
        </div>
        <button
          className="rounded-md border border-border px-3 py-1.5 text-sm md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>
      {open ? (
        <div className="border-t border-border/70 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                {...(l.hash ? { hash: l.hash } : {})}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/docs"
              hash="install"
              onClick={() => setOpen(false)}
              className="rounded-full bg-brand px-4 py-2 text-center text-sm font-semibold text-brand-foreground"
            >
              Get started
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <p className="font-mono text-xs">
          A tiny, TypeScript-first animation engine that gets out of your way.
        </p>
      </div>
    </footer>
  );
}
