import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { CodeBlock } from "@/components/code-block";
import { EasingCurves } from "@/components/demos";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Moovein Docs — API, easing and adapters" },
      {
        name: "description",
        content:
          "Install Moovein and learn the API: animate(), playback controls, easing curves, stagger, scroll triggers and the React adapter.",
      },
      { property: "og:title", content: "Moovein Docs — API, easing and adapters" },
      {
        property: "og:description",
        content:
          "Install Moovein and learn animate(), playback controls, easing curves, stagger, scroll triggers and framework adapters.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Docs,
});

const nav = [
  { id: "install", label: "Installation" },
  { id: "quick-start", label: "Quick start" },
  { id: "animate", label: "animate()" },
  { id: "options", label: "Options" },
  { id: "controls", label: "Controls" },
  { id: "easing", label: "Easing" },
  { id: "stagger", label: "Stagger" },
  { id: "scroll", label: "Scroll triggers" },
  { id: "react", label: "React adapter" },
  { id: "architecture", label: "Architecture" },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border/60 pb-12 pt-12 first:pt-0">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      <div className="mt-5 space-y-5 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function Table({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Option</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r[0]}>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-brand">{r[0]}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-cyan/90">{r[1]}</td>
              <td className="px-4 py-3 text-muted-foreground">{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Docs() {
  const [active, setActive] = useState("install");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 },
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <div className="mx-auto flex max-w-6xl gap-10 px-5 py-12">
        <aside className="sticky top-24 hidden h-fit w-56 shrink-0 lg:block">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Documentation
          </p>
          <nav className="mt-4 space-y-1 border-l border-border">
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors ${
                  active === n.id
                    ? "border-brand text-brand"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-widest text-brand">Docs · v0.1</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Moovein handbook
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything in the first release fits on one page. That is the point.
          </p>

          <div className="mt-10 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
              >
                {n.label}
              </a>
            ))}
          </div>

          <div className="mt-8">
            <Section id="install" title="Installation">
              <p>Moovein ships as ESM with TypeScript declarations. No peer dependencies.</p>
              <CodeBlock code={`npm install @tlob/moovein\n# or\npnpm add @tlob/moovein`} filename="terminal" />
              <p>
                Framework adapters live in their own packages so the core never pulls React, Vue or
                Svelte into your bundle.
              </p>
              <CodeBlock code={`pnpm add @tlob/moovein-react   # or @tlob/moovein-vue, @tlob/moovein-svelte`} filename="terminal" />
            </Section>

            <Section id="quick-start" title="Quick start">
              <p>One import, one call. The animation starts immediately and returns controls.</p>
              <CodeBlock
                filename="quick-start.ts"
                code={`import { animate } from "moovein";

animate(".card", { y: 0, opacity: 1 }, {
  duration: 700,
  delay: 100,
  easing: "expoOut",
  onComplete: () => console.log("done"),
});`}
              />
            </Section>

            <Section id="animate" title="animate(target, props, options)">
              <p>
                <code className="font-mono text-brand">target</code> accepts a CSS selector, an
                element, an array of elements or a NodeList. Props are numbers (animate from the
                current default) or a <code className="font-mono text-brand">[from, to]</code> tuple.
              </p>
              <CodeBlock
                filename="animate.ts"
                code={`animate(document.querySelectorAll("li"), {
  x: [-40, 0],      // explicit from → to
  opacity: [0, 1],
  scale: 1.05,      // implicit from the default value
  rotate: 8,
});`}
              />
              <Table
                rows={[
                  ["x / y", "number | [number, number]", "Translation in pixels, composed into one transform."],
                  ["scale", "number | [number, number]", "Uniform scale, defaults from 1."],
                  ["rotate", "number | [number, number]", "Rotation in degrees."],
                  ["opacity", "number | [number, number]", "Opacity, defaults from 1."],
                  ["width", "number | [number, number]", "Width in percent, handy for progress bars."],
                ]}
              />
            </Section>

            <Section id="options" title="Options">
              <Table
                rows={[
                  ["duration", "number = 600", "Length of a single pass, in milliseconds."],
                  ["delay", "number = 0", "Wait before the first element starts."],
                  ["stagger", "number = 0", "Extra delay added per element in the target list."],
                  ["easing", "EasingName | (t) => number", "Built-in curve name or your own function."],
                  ["repeat", "number = 0", "How many extra passes to run after the first."],
                  ["yoyo", "boolean = false", "Alternate direction on each repeat."],
                  ["onUpdate", "(progress) => void", "Called every frame with progress from 0 to 1."],
                  ["onComplete", "() => void", "Called once the final pass finishes."],
                ]}
              />
            </Section>

            <Section id="controls" title="Playback controls">
              <p>Every call returns a control object. Nothing is hidden behind a global timeline.</p>
              <CodeBlock
                filename="controls.ts"
                code={`const anim = animate("#box", { x: 200 }, { duration: 1000 });

anim.pause();
anim.play();
anim.reverse();
anim.seek(0.5);      // jump to the halfway frame
anim.cancel();       // stop and reset
console.log(anim.progress); // 0 → 1`}
              />
            </Section>

            <Section id="easing" title="Easing">
              <p>
                Eight curves ship in the core; anything else is a plain function of{" "}
                <code className="font-mono text-brand">t</code>.
              </p>
              <EasingCurves />
              <CodeBlock
                filename="easing.ts"
                code={`import { animate, easings } from "moovein";

animate("#a", { y: 0 }, { easing: "elasticOut" });
animate("#b", { y: 0 }, { easing: (t) => t * t });
animate("#c", { y: 0 }, { easing: easings.bounceOut });`}
              />
            </Section>

            <Section id="stagger" title="Stagger">
              <p>Pass a list of elements and a stagger value; each element inherits the offset.</p>
              <CodeBlock
                filename="stagger.ts"
                code={`animate("[data-bar]", { y: [40, 0], opacity: [0, 1] }, {
  duration: 600,
  stagger: 70,
  easing: "expoOut",
});`}
              />
            </Section>

            <Section id="scroll" title="Scroll triggers">
              <p>
                <code className="font-mono text-brand">inView</code> is a thin IntersectionObserver
                helper that returns its own cleanup function.
              </p>
              <CodeBlock
                filename="scroll.ts"
                code={`import { animate, inView } from "moovein";

const stop = inView(document.querySelector(".panel"), (el) => {
  animate(el, { y: [56, 0], opacity: [0, 1] }, { duration: 800 });
}, { threshold: 0.3, once: true });

// later
stop();`}
              />
            </Section>

            <Section id="react" title="React adapter">
              <p>
                The adapter is a hook around the same engine. It cleans up the animation when the
                component unmounts.
              </p>
              <CodeBlock
                filename="Card.tsx"
                code={`import { useMoovein } from "@tlob/moovein-react";

export function Card() {
  const { ref, controls } = useMoovein({ y: [40, 0], opacity: [0, 1] }, {
    duration: 700,
    easing: "expoOut",
    whenInView: true,
  });

  return <div ref={ref} onClick={() => controls.current?.reverse()} />;
}`}
              />
            </Section>

            <Section id="architecture" title="Architecture">
              <p>
                A small pnpm monorepo: the core holds the engine and the math, adapters are thin
                layers on top, and docs and examples live outside the runtime packages.
              </p>
              <CodeBlock
                filename="repo"
                code={`moovein/
  packages/
    core/            # engine, easing, interpolation — no framework code
    react/           # useMoovein hook
    vue/             # composable
    svelte/          # action
  docs/              # this site
  examples/`}
              />
              <p>
                Build with tsup to ESM plus declarations. CI runs lint, typecheck, unit tests in
                Vitest, browser tests for rAF behaviour, then publishes on a synchronized version.
              </p>
            </Section>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
