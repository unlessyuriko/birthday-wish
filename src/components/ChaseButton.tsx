import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from './ui';

type Props = {
  label: string;
  giveUpLabel: string;
  taunts: string[];
  /** Called with the funny line each time the button escapes or is pressed. */
  onTaunt: (line: string) => void;
  /** Called once the button has given up and is pressed. */
  onCaught: () => void;
};

/**
 * A "No" that slips away from the pointer a few times (once per taunt), then gives up
 * and becomes a friendly button. Never blocks: keyboard, reduced motion and screen readers
 * get a stationary button that cycles the same lines, then gives up the same way.
 */
export function ChaseButton({ label, giveUpLabel, taunts, onTaunt, onCaught }: Props) {
  const reduced = useReducedMotion();
  const arenaRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const lastDodge = useRef(0);
  const [count, setCount] = useState(0);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const caught = count >= taunts.length;

  // Start centred in the arena.
  useLayoutEffect(() => {
    const a = arenaRef.current;
    const b = btnRef.current;
    if (a && b) setPos({ x: (a.clientWidth - b.offsetWidth) / 2, y: (a.clientHeight - b.offsetHeight) / 2 });
  }, []);

  // Keep the button inside its arena if the screen is resized or rotated.
  useEffect(() => {
    const fit = () => {
      const a = arenaRef.current;
      const b = btnRef.current;
      if (!a || !b) return;
      const maxX = Math.max(0, a.clientWidth - b.offsetWidth);
      const maxY = Math.max(0, a.clientHeight - b.offsetHeight);
      setPos((p) => (p ? { x: Math.min(p.x, maxX), y: Math.min(p.y, maxY) } : p));
    };
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const say = () => {
    onTaunt(taunts[count]);
    setCount(count + 1);
  };

  const dodge = () => {
    const a = arenaRef.current;
    const b = btnRef.current;
    if (!a || !b || caught) return;
    const maxX = Math.max(0, a.clientWidth - b.offsetWidth);
    const maxY = Math.max(0, a.clientHeight - b.offsetHeight);
    // Land well clear of where the button was (and so of the pointer), so it never ends up under it.
    const rand = () => ({ x: Math.random() * maxX, y: Math.random() * maxY });
    const far = (n: { x: number; y: number }) => !pos || Math.hypot(n.x - pos.x, n.y - pos.y) >= b.offsetWidth * 0.95;
    let next = rand();
    for (let i = 0; i < 12 && !far(next); i++) next = rand();
    if (!far(next) && pos) next = { x: pos.x > maxX / 2 ? 0 : maxX, y: Math.random() * maxY };
    setPos(next);
    lastDodge.current = Date.now();
    say();
  };

  const canRun = !reduced && !caught;
  return (
    <div className="chase-arena" ref={arenaRef}>
      <button
        ref={btnRef}
        type="button"
        className={`btn secondary chase ${caught ? 'gave-up' : ''}`}
        style={pos ? { transform: `translate(${pos.x}px, ${pos.y}px)` } : undefined}
        onPointerMove={(e) => {
          // Mouse only; touch is handled on press. Throttled so one swipe is one escape.
          if (canRun && e.pointerType === 'mouse' && Date.now() - lastDodge.current > 350) dodge();
        }}
        onPointerDown={(e) => {
          if (canRun && e.pointerType !== 'mouse') {
            e.preventDefault();
            dodge();
          } else if (canRun) dodge();
        }}
        onClick={() => {
          if (Date.now() - lastDodge.current < 250) return; // the tap that just made it run
          if (caught) onCaught();
          else say(); // keyboard or reduced motion: same lines, no running
        }}
      >
        {caught ? giveUpLabel : label}
      </button>
    </div>
  );
}
