import { useEffect, useRef } from "react";
import { animate, type AnimatableProps, type AnimateOptions, type Controls } from "./animate";
import { inView } from "./in-view";

/** React adapter: animate a ref'd element on mount, or when it enters view. */
export function useMoovein<T extends HTMLElement = HTMLDivElement>(
  props: AnimatableProps,
  options: AnimateOptions & { whenInView?: boolean } = {},
) {
  const ref = useRef<T | null>(null);
  const controls = useRef<Controls | null>(null);
  const { whenInView = false, ...rest } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!whenInView) {
      controls.current = animate(el, props, rest);
      return () => controls.current?.cancel();
    }
    const stop = inView(el, () => {
      controls.current = animate(el, props, rest);
    });
    return () => {
      stop();
      controls.current?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, controls };
}
