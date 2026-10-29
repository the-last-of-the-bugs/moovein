import { resolveEasing, type EasingFn, type EasingName } from "./easing";

export type AnimatableTarget = Element | Element[] | NodeListOf<Element> | string | null;

export type AnimatableProps = {
  x?: number | [number, number];
  y?: number | [number, number];
  scale?: number | [number, number];
  rotate?: number | [number, number];
  opacity?: number | [number, number];
  width?: number | [number, number];
};

export type AnimateOptions = {
  duration?: number;
  delay?: number;
  stagger?: number;
  easing?: EasingName | EasingFn;
  repeat?: number;
  yoyo?: boolean;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
};

export type Controls = {
  play: () => void;
  pause: () => void;
  reverse: () => void;
  cancel: () => void;
  seek: (progress: number) => void;
  readonly progress: number;
};

type PropKey = keyof AnimatableProps;

const DEFAULTS: Record<PropKey, number> = {
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
  opacity: 1,
  width: 0,
};

const toElements = (target: AnimatableTarget): HTMLElement[] => {
  if (!target) return [];
  if (typeof target === "string") return Array.from(document.querySelectorAll<HTMLElement>(target));
  if (target instanceof Element) return [target as HTMLElement];
  return Array.from(target as ArrayLike<Element>) as HTMLElement[];
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const applyStyles = (el: HTMLElement, values: Partial<Record<PropKey, number>>) => {
  const t: string[] = [];
  if (values.x !== undefined || values.y !== undefined)
    t.push(`translate3d(${values.x ?? 0}px, ${values.y ?? 0}px, 0)`);
  if (values.rotate !== undefined) t.push(`rotate(${values.rotate}deg)`);
  if (values.scale !== undefined) t.push(`scale(${values.scale})`);
  if (t.length) el.style.transform = t.join(" ");
  if (values.opacity !== undefined) el.style.opacity = String(values.opacity);
  if (values.width !== undefined) el.style.width = `${values.width}%`;
};

/**
 * The tiny Moovein engine: one rAF loop per animation, no dependencies.
 */
export function animate(
  target: AnimatableTarget,
  props: AnimatableProps,
  options: AnimateOptions = {},
): Controls {
  const els = toElements(target);
  const {
    duration = 600,
    delay = 0,
    stagger = 0,
    repeat = 0,
    yoyo = false,
    onUpdate,
    onComplete,
  } = options;
  const ease = resolveEasing(options.easing);
  const keys = Object.keys(props) as PropKey[];

  const tracks = els.map((el, i) => {
    const from: Partial<Record<PropKey, number>> = {};
    const to: Partial<Record<PropKey, number>> = {};
    for (const k of keys) {
      const v = props[k]!;
      if (Array.isArray(v)) {
        from[k] = v[0];
        to[k] = v[1];
      } else {
        from[k] = DEFAULTS[k];
        to[k] = v;
      }
    }
    return { el, from, to, offset: delay + stagger * i };
  });

  const total = duration + delay + stagger * Math.max(0, els.length - 1);
  let raf = 0;
  let start = 0;
  let elapsed = 0;
  let direction: 1 | -1 = 1;
  let iteration = 0;
  let running = false;
  let progress = 0;

  const render = (time: number) => {
    progress = total === 0 ? 1 : Math.min(1, Math.max(0, time / total));
    for (const track of tracks) {
      const local = Math.min(1, Math.max(0, (time - track.offset) / duration));
      const e = ease(local);
      const values: Partial<Record<PropKey, number>> = {};
      for (const k of keys) values[k] = lerp(track.from[k]!, track.to[k]!, e);
      applyStyles(track.el, values);
    }
    onUpdate?.(progress);
  };

  const tick = (now: number) => {
    if (!running) return;
    if (!start) start = now;
    elapsed += (now - start) * direction;
    start = now;
    const clamped = Math.min(total, Math.max(0, elapsed));
    render(clamped);

    const done = direction === 1 ? elapsed >= total : elapsed <= 0;
    if (done) {
      if (iteration < repeat) {
        iteration++;
        if (yoyo) direction = direction === 1 ? -1 : 1;
        else elapsed = 0;
        raf = requestAnimationFrame(tick);
        return;
      }
      running = false;
      onComplete?.();
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  const play = () => {
    if (running) return;
    running = true;
    start = 0;
    raf = requestAnimationFrame(tick);
  };

  const pause = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  render(0);
  play();

  return {
    play,
    pause,
    reverse: () => {
      direction = direction === 1 ? -1 : 1;
      play();
    },
    cancel: () => {
      pause();
      elapsed = 0;
      render(0);
    },
    seek: (p: number) => {
      pause();
      elapsed = total * Math.min(1, Math.max(0, p));
      render(elapsed);
    },
    get progress() {
      return progress;
    },
  };
}
