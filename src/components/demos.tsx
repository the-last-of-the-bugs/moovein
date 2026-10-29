import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { animate, easings, inView, type Controls, type EasingName } from "@/lib/moovein";

const easingNames = Object.keys(easings) as EasingName[];

export function Playground() {
  const boxRef = useRef<HTMLDivElement>(null);
  const controls = useRef<Controls | null>(null);
  const [easing, setEasing] = useState<EasingName>("backOut");
  const [duration, setDuration] = useState(900);
  const [progress, setProgress] = useState(0);

  const run = () => {
    if (!boxRef.current) return;
    controls.current?.cancel();
    controls.current = animate(
      boxRef.current,
      { x: [0, 220], rotate: [0, 180], scale: [1, 1.25] },
      { duration, easing, onUpdate: setProgress },
    );
  };

  useEffect(() => {
    run();
    return () => controls.current?.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [easing, duration]);

  return (
    <div className="overflow-hidden border-y-2 border-play-line">
      <div className="relative overflow-hidden bg-play-stage px-6 py-12">
        <div className="relative flex items-center">
          <div
            ref={boxRef}
            className="grid size-16 place-items-center rounded-full bg-play-ball font-mono text-xs font-bold text-play-ball-ink shadow-pop"
          >
            moo
          </div>
        </div>
        <div className="relative mt-8 h-1 w-full overflow-hidden rounded-full bg-play-line">
          <div
            className="h-full rounded-full bg-play-ball transition-[width] duration-75"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 py-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <label className="flex flex-1 flex-col gap-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              easing
            </span>
            <select
              value={easing}
              onChange={(e) => setEasing(e.target.value as EasingName)}
              className="rounded-md border-2 border-play-line bg-play-surface px-3 py-2 font-mono text-sm outline-none focus:border-play-accent"
            >
              {easingNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              duration · {duration}ms
            </span>
            <input
              type="range"
              min={200}
              max={2400}
              step={100}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="accent-brand"
            />
          </label>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={run}
            className="rounded-full bg-play-accent px-5 text-play-button hover:bg-play-accent/90"
          >
            Replay
          </Button>
          <Button
            variant="outline"
            onClick={() => controls.current?.reverse()}
            className="rounded-full border-2 border-play-line bg-transparent px-5 hover:bg-play-surface"
          >
            Reverse
          </Button>
        </div>
      </div>
    </div>
  );
}

export function StaggerDemo() {
  const wrap = useRef<HTMLDivElement>(null);

  const run = () => {
    if (!wrap.current) return;
    const bars = wrap.current.querySelectorAll<HTMLElement>("[data-bar]");
    animate(bars, { y: [40, 0], opacity: [0, 1] }, { duration: 600, stagger: 70, easing: "expoOut" });
  };

  useEffect(() => {
    const stop = inView(wrap.current, run, { threshold: 0.4 });
    return stop;
  }, []);

  return (
    <div className="border-y-2 border-play-line py-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Stagger</h3>
        <Button
          variant="ghost"
          onClick={run}
          className="font-mono text-[11px] uppercase text-play-muted hover:bg-play-surface hover:text-foreground"
        >
          replay
        </Button>
      </div>
      <div ref={wrap} className="mt-6 flex h-32 items-end gap-2">
        {[36, 62, 88, 54, 100, 72, 44, 80].map((h, i) => (
          <div
            key={i}
            data-bar
            style={{ height: `${h}%` }}
            className={`flex-1 rounded-t-full opacity-0 ${i % 3 === 0 ? "bg-bar-one" : i % 3 === 1 ? "bg-bar-two" : "bg-bar-three"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function ScrollRevealDemo() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = wrap.current?.querySelectorAll<HTMLElement>("[data-card]") ?? [];
    const stops = Array.from(cards).map((card) =>
      inView(card, (el) => animate(el, { y: [56, 0], opacity: [0, 1] }, { duration: 800, easing: "expoOut" }), {
        threshold: 0.3,
      }),
    );
    return () => stops.forEach((s) => s());
  }, []);

  return (
    <div ref={wrap} className="grid gap-4 sm:grid-cols-3">
      {[
        { t: "~2 kB core", d: "No dependencies, tree-shakeable ESM." },
        { t: "Typed end to end", d: "Inference on targets, props and controls." },
        { t: "Real controls", d: "play, pause, reverse, seek, cancel." },
      ].map((c) => (
        <div key={c.t} data-card className="panel p-6 opacity-0">
          <h3 className="font-display text-lg font-semibold text-brand">{c.t}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
        </div>
      ))}
    </div>
  );
}

export function ScrollMotionDemo() {
  const track = useRef<HTMLDivElement>(null);
  const activeControls = useRef<Controls[]>([]);
  const [scrollEasing, setScrollEasing] = useState<EasingName>("backOut");

  const run = () => {
    const root = track.current;
    if (!root) return;
    activeControls.current.forEach((control) => control.cancel());
    const characters = root.querySelectorAll<HTMLElement>("[data-character-core]");
    activeControls.current = Array.from(characters).map((character, index) =>
      animate(
        character,
        { y: [80, 0], rotate: [index % 2 ? 18 : -18, 0], scale: [0.55, 1], opacity: [0, 1] },
        { duration: 850, easing: scrollEasing, delay: index * 80 },
      ),
    );
  };

  useEffect(() => {
    const root = track.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.querySelectorAll<HTMLElement>("[data-character-core]").forEach((character) => {
        character.style.opacity = "1";
      });
      return;
    }

    const stop = inView(root, run, { threshold: 0.35, once: false });
    let frame = 0;
    const updateScrollMotion = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const viewportProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const centered = Math.min(1, Math.max(0, viewportProgress)) - 0.5;
        root.querySelectorAll<HTMLElement>("[data-character]").forEach((character, index) => {
          const direction = index % 2 === 0 ? 1 : -1;
          character.style.setProperty("--scroll-shift", `${centered * 74 * direction}px`);
        });
      });
    };
    updateScrollMotion();
    window.addEventListener("scroll", updateScrollMotion, { passive: true });
    return () => {
      stop();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrollMotion);
      activeControls.current.forEach((control) => control.cancel());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollEasing]);

  const moveCharacter = (event: ReactPointerEvent<HTMLSpanElement>, index: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const character = event.currentTarget;
    const rect = character.getBoundingClientRect();
    const x = event.clientX < rect.left + rect.width / 2 ? 24 : -24;
    const y = index % 2 === 0 ? -18 : 18;
    character.style.setProperty("--pointer-x", `${x}px`);
    character.style.setProperty("--pointer-y", `${y}px`);
    character.style.setProperty("--pointer-r", `${index % 2 === 0 ? 12 : -12}deg`);
    character.style.setProperty("--pointer-scale", "1.08");
  };

  const resetCharacter = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const character = event.currentTarget;
    character.style.setProperty("--pointer-x", "0px");
    character.style.setProperty("--pointer-y", "0px");
    character.style.setProperty("--pointer-r", "0deg");
    character.style.setProperty("--pointer-scale", "1");
  };

  return (
    <div>
      <div className="mb-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <label htmlFor="scroll-easing" className="font-mono text-xs font-bold uppercase text-scroll-muted">
          Scroll easing
        </label>
        <select
          id="scroll-easing"
          value={scrollEasing}
          onChange={(event) => setScrollEasing(event.target.value as EasingName)}
          className="rounded-full border border-scroll-muted/50 bg-background/20 px-4 py-2 font-mono text-sm text-foreground outline-none backdrop-blur-md focus:border-scroll-accent"
        >
          {easingNames.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
        <Button variant="ghost" onClick={run} className="font-mono text-xs uppercase text-scroll-accent hover:bg-background/20 hover:text-scroll-accent">
          Replay
        </Button>
      </div>
      <div ref={track} className="scroll-track flex min-h-72 items-end justify-center gap-3 overflow-hidden px-4 py-10 sm:gap-7">
        {["M", "O", "O", "V", "E", "I", "N"].map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            data-character
            onPointerMove={(event) => moveCharacter(event, index)}
            onPointerLeave={resetCharacter}
            className="scroll-character block aspect-square w-[12%] max-w-28"
          >
            <span
              data-character-core
              className={`grid size-full place-items-center rounded-full font-display text-[clamp(1.5rem,5vw,4rem)] font-bold opacity-0 character-${(index % 4) + 1}`}
            >
              {index === 1 || index === 2 ? <span className="demo-eye" /> : letter}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function EasingCurves() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {easingNames.map((name) => {
        const fn = easings[name];
        const points = Array.from({ length: 40 }, (_, i) => {
          const x = i / 39;
          return `${(x * 100).toFixed(2)},${(100 - fn(x) * 100).toFixed(2)}`;
        }).join(" ");
        return (
          <div key={name} className="panel p-4">
            <svg viewBox="-6 -20 112 140" className="h-24 w-full">
              <polyline
                points={points}
                fill="none"
                stroke="var(--brand)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <p className="mt-2 text-center font-mono text-xs text-muted-foreground">{name}</p>
          </div>
        );
      })}
    </div>
  );
}
