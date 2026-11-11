import { useEffect, useRef, useState, type ReactNode } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  );
  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    // Older Safari only has addListener.
    if (mq.addEventListener) mq.addEventListener('change', on);
    else mq.addListener(on);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', on);
      else mq.removeListener(on);
    };
  }, []);
  return reduced;
}

/** Heading that receives keyboard focus when its scene (or focusKey) appears. */
export function SceneHeading({ children, focusKey, className = '' }: { children: ReactNode; focusKey?: string | number; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    // Do not steal focus on the very first page load; only after the person has acted.
    if (!document.body.dataset.navigated) return;
    ref.current?.focus({ preventScroll: true });
  }, [focusKey]);
  return (
    <h2 ref={ref} tabIndex={-1} className={`scene-title ${className}`}>
      {children}
    </h2>
  );
}

/** Persistent polite live region. The text swaps; the region itself never remounts. */
export function Reaction({ text }: { text?: string }) {
  return (
    <div className="reaction-wrap" role="status" aria-live="polite">
      {text && (
        <p key={text} className="reaction">
          {text}
        </p>
      )}
    </div>
  );
}

export function Choices({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: Array<{ id: string; label: string }>;
  value?: string;
  onPick: (id: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className={`choices ${options.length === 4 ? 'cols2' : ''}`}>
      {options.map((o) => (
        <button key={o.id} type="button" className="choice" aria-pressed={value === o.id} onClick={() => onPick(o.id)}>
          <span className="choice-check" aria-hidden="true">{value === o.id ? '♥' : ''}</span>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** One short burst. Calls onDone once when finished. Not rendered at all under reduced motion. */
export function Confetti({ onDone }: { onDone: () => void }) {
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    const t = setTimeout(() => done.current(), 2200);
    return () => clearTimeout(t);
  }, []);
  const colors = ['#B52346', '#F6B8CB', '#D9AA58', '#FCE4EC', '#8F1836'];
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 36 }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 6) * 60}ms`,
            ['--dx' as string]: `${((i * 53) % 120) - 60}px`,
            ['--rot' as string]: `${(i * 97) % 360}deg`,
          }}
        />
      ))}
    </div>
  );
}
