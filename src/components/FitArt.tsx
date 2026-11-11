import type { ReactNode } from 'react';
import { useSize } from './useSize';

/**
 * Scales its picture to exactly fill the room the layout gives it: bigger on tall screens (no empty
 * bands), smaller on short ones (no scrolling). Works for any screen size.
 */
export function FitArt({ className = '', children, max = 1.7, min = 0.3 }: { className?: string; children: ReactNode; max?: number; min?: number }) {
  const [boxRef, box] = useSize<HTMLDivElement>();
  const [innerRef, nat] = useSize<HTMLDivElement>(true);
  const k = box.w && nat.w && nat.h ? Math.min(max, Math.max(min, Math.min(box.w / nat.w, box.h / nat.h))) : 1;
  return (
    <div className={`hero-art ${className}`} ref={boxRef}>
      <div className="hero-inner" ref={innerRef} style={{ transform: `scale(${k})`, visibility: box.w ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </div>
  );
}
