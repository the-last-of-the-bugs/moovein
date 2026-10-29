import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { Playground, ScrollMotionDemo, StaggerDemo } from "@/components/demos";
import { animate, inView } from "@/lib/moovein";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Moovein — Tiny TypeScript-first animation engine" },
      {
        name: "description",
        content:
          "Moovein is a lightweight, dependency-free animation library for the web. Typed API, real playback controls, stagger and scroll triggers in a ~2 kB core.",
      },
      { property: "og:title", content: "Moovein — Tiny TypeScript-first animation engine" },
      {
        property: "og:description",
        content:
          "A tiny, TypeScript-first animation engine that gets out of your way. Typed API, real controls, stagger and scroll triggers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const goals = [
  ["Small", "Dependency-free core, no framework code in the engine."],
  ["Easy", "A handful of functions cover most real animations."],
  ["Fast", "One shared rAF pass, transform-only writes."],
  ["Composable", "Sequence, pause, reverse, seek or cancel anything."],
  ["Type-safe", "Public API authored in TypeScript with real inference."],
  ["Framework-friendly", "React, Vue and Svelte adapters stay optional."],
];

function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const words = heroRef.current?.querySelectorAll<HTMLElement>("[data-hero]") ?? [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroControls = reducedMotion
      ? null
      : animate(words, { y: [34, 0], opacity: [0, 1] }, { duration: 900, stagger: 90, easing: "expoOut" });
    if (reducedMotion) {
      words.forEach((word) => {
        word.style.opacity = "1";
      });
    }

    const stops = reducedMotion ? [] : sectionRefs.current.filter(Boolean).map((el) =>
      inView(el, (target) => animate(target, { y: [40, 0], opacity: [0, 1] }, { duration: 800, easing: "expoOut" }), {
        threshold: 0.15,
      }),
    );
    if (reducedMotion) {
      sectionRefs.current.forEach((section) => {
        section.style.opacity = "1";
      });
    }
    return () => {
      heroControls?.cancel();
      stops.forEach((stop) => stop());
    };
  }, []);

  const scatterHeroWords = (event: ReactPointerEvent<HTMLHeadingElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const words = event.currentTarget.querySelectorAll<HTMLElement>("[data-chaos-word]");
    words.forEach((word, index) => {
      const rect = word.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.max(60, Math.hypot(dx, dy));
      const force = Math.max(0, 1 - distance / 430);
      const direction = index % 2 === 0 ? 1 : -1;
      word.style.setProperty("--chaos-x", `${-dx * force * 0.28 + direction * force * 18}px`);
      word.style.setProperty("--chaos-y", `${-dy * force * 0.24 + Math.sin(index + event.clientX * 0.02) * force * 16}px`);
      word.style.setProperty("--chaos-r", `${direction * force * 9}deg`);
    });
  };

  const settleHeroWords = (event: ReactPointerEvent<HTMLHeadingElement>) => {
    event.currentTarget.querySelectorAll<HTMLElement>("[data-chaos-word]").forEach((word) => {
      word.style.setProperty("--chaos-x", "0px");
      word.style.setProperty("--chaos-y", "0px");
      word.style.setProperty("--chaos-r", "0deg");
    });
  };

  const register = (i: number) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current[i] = el;
  };

  return (
    <div className="min-h-screen">
      <SiteNav />

      <main>
        <section className="hero-band relative flex min-h-[82vh] items-center overflow-hidden px-5 py-20 text-center">
          <span className="hero-float hero-float-left deco-ring" aria-hidden="true" />
          <span className="hero-float hero-float-right deco-pill" aria-hidden="true" />
          <span className="hero-spark" aria-hidden="true">✦</span>
          <div ref={heroRef} className="hero-content relative z-10 mx-auto max-w-6xl">
            <p data-hero className="font-mono text-xs font-semibold uppercase text-hero-muted opacity-0">
              Tiny · TypeScript first · zero dependencies
            </p>
            <h1
              className="hero-chaos mt-8 font-display text-[clamp(4rem,11vw,9rem)] font-bold leading-[0.83]"
              onPointerMove={scatterHeroWords}
              onPointerLeave={settleHeroWords}
            >
              <span data-hero className="block opacity-0">
                <span data-chaos-word className="chaos-word inline-block">Make</span>{" "}
                <span data-chaos-word className="chaos-word inline-block">things</span>
              </span>
              <span data-hero className="hero-word block opacity-0">
                <span data-chaos-word className="chaos-word inline-block">moove</span>{" "}
                <span data-chaos-word className="chaos-word inline-block">in.</span>
              </span>
            </h1>
            <p data-hero className="mx-auto mt-8 max-w-2xl text-lg text-hero-muted opacity-0 sm:text-xl">
              A tiny animation engine for expressive web motion. Easy to learn, fast to ship,
              and only about two kilobytes.
            </p>
            <div data-hero className="mt-9 flex flex-wrap justify-center gap-3 opacity-0">
              <Link
                to="/docs"
                className="rounded-full bg-hero-ink px-7 py-3.5 font-semibold text-hero-paper transition-transform hover:scale-105"
              >
                Start mooving →
              </Link>
              <a
                href="#playground"
                className="rounded-full border-2 border-hero-ink px-7 py-3 font-semibold text-hero-ink transition-colors hover:bg-hero-ink hover:text-hero-paper"
              >
                Play with it
              </a>
            </div>
          </div>
        </section>

        <div className="marquee-band overflow-hidden py-5">
          <div className="animate-marquee flex w-max gap-10 font-display text-2xl font-bold text-marquee-ink">
            {Array.from({ length: 2 }).map((_, r) => (
              <div key={r} className="flex gap-10">
                {["animate()", "stagger", "timeline", "inView", "reverse", "seek", "easings", "adapters"].map(
                  (w) => (
                    <span key={w} className="whitespace-nowrap">
                      {w} <span aria-hidden="true">✦</span>
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>

        <section id="playground" ref={register(0)} className="play-band px-5 py-24 text-center opacity-0 sm:py-32">
          <div className="mx-auto max-w-6xl">
          <p className="play-sticker" aria-hidden="true">PLAY!</p>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-6xl">Play with motion</h2>
          <p className="mx-auto mt-4 max-w-xl text-play-muted">
            Everything below runs on the real Moovein core included in this site.
          </p>
          <div className="mt-12 grid gap-10 text-left lg:grid-cols-[1.35fr_1fr]">
            <Playground />
            <StaggerDemo />
          </div>
          </div>
        </section>

        <section ref={register(1)} className="goals-band px-5 py-24 text-center opacity-0 sm:py-32">
          <div className="mx-auto max-w-5xl">
            <p className="font-mono text-xs font-bold uppercase text-goals-accent">Built differently ⚡</p>
            <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold sm:text-6xl">Six goals. Zero heavy baggage.</h2>
            <div className="mt-14 divide-y divide-goals-line border-y border-goals-line">
              {goals.map(([t, d], index) => (
                <div key={t} className="goal-row grid gap-2 py-6 sm:grid-cols-[4rem_1fr_2fr] sm:items-center sm:text-left">
                  <span className="font-mono text-sm text-goals-muted">0{index + 1}</span>
                  <h3 className="font-display text-2xl font-semibold text-goals-accent">{t}</h3>
                  <p className="text-goals-muted">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="scroll" ref={register(2)} className="scroll-band px-5 py-24 text-center opacity-0 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-xs font-bold uppercase text-scroll-accent">Scroll powered ↓</p>
            <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold sm:text-6xl">Your page is the timeline.</h2>
            <p className="mx-auto mt-4 max-w-xl text-scroll-muted">Scroll this colorful track and watch every character find its place.</p>
            <div className="mt-14"><ScrollMotionDemo /></div>
          </div>
        </section>

        <section className="cta-band relative overflow-hidden px-5 py-24 text-center sm:py-32">
          <span className="cta-orbit eye-pair" aria-hidden="true"><i /><i /></span>
          <div className="relative mx-auto max-w-4xl">
            <h2 className="font-display text-5xl font-bold sm:text-7xl">Ship motion in one line.</h2>
            <p className="mx-auto mt-5 max-w-md text-cta-muted">
              A tiny, TypeScript-first animation engine that gets out of your way.
            </p>
            <Link
              to="/docs"
              hash="install"
              className="mt-9 inline-block rounded-full bg-cta-accent px-8 py-3.5 font-semibold text-cta-button transition-transform hover:scale-105"
            >
              npm i moovein
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
