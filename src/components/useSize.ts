import { useEffect, useRef, useState } from 'react';

/** Measures an element's content box, so art can be sized to exactly the space it has (no scrolling). */
export function useSize<T extends HTMLElement>(layout = false) {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      // layout=true reads the untransformed size, so scaling the element never changes its own measurement
      const rw = layout ? el.offsetWidth : el.getBoundingClientRect().width;
      const rh = layout ? el.offsetHeight : el.getBoundingClientRect().height;
      setSize((s) => (Math.abs(s.w - rw) < 1 && Math.abs(s.h - rh) < 1 ? s : { w: Math.floor(rw), h: Math.floor(rh) }));
    };
    read();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', read);
      return () => window.removeEventListener('resize', read);
    }
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

/** Largest box with the given height/width ratio that fits inside w x h, with an optional frame around it. */
export function fitBox(w: number, h: number, ratio: number, frameX = 0, frameY = 0, maxW = Infinity) {
  const iw = Math.max(0, Math.min(w - frameX, (h - frameY) / ratio, maxW - frameX));
  return { w: Math.floor(iw + frameX), h: Math.floor(iw * ratio + frameY) };
}
