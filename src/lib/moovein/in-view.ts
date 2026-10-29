/** Fire a callback the first time an element scrolls into view. */
export function inView(
  el: Element | null,
  cb: (el: Element) => void,
  options: { threshold?: number; once?: boolean } = {},
) {
  if (!el || typeof IntersectionObserver === "undefined") return () => {};
  const { threshold = 0.25, once = true } = options;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          cb(entry.target);
          if (once) io.unobserve(entry.target);
        }
      }
    },
    { threshold },
  );
  io.observe(el);
  return () => io.disconnect();
}
