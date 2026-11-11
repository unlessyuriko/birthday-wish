import { useEffect, useState } from 'react';
import { Heart } from '../components/Art';
import { prefetchCake3D } from '../components/CakeAuto';
import { Photo } from '../components/Photo';
import { SceneHeading } from '../components/ui';
import { fitBox, useSize } from '../components/useSize';
import { TOTAL_MEMORIES } from '../state/journey';
import type { SceneProps } from './types';

const FALLBACK_TEASERS = ['Every moment with you is my favourite.', 'You make ordinary days feel like magic.', 'Still falling for you, every single day.'];
const FRAME_X = 14; // white frame around the photo (left + right)
const FRAME_Y = 19; // top + thicker bottom edge

export function Scene3({ state, dispatch, config }: SceneProps) {
  const total = config.memories.length;
  const [idx, setIdx] = useState(0);
  const [stageRef, stage] = useSize<HTMLDivElement>();
  useEffect(() => {
    prefetchCake3D(); // warm up the 3D candles for the next step
  }, []);
  const seen = state.seenMemories.length;
  const allSeen = seen >= Math.min(total, TOTAL_MEMORIES);
  const go = (n: number) => setIdx((n + total) % total);

  return (
    <section className="scene" aria-label="Evidence">
      <SceneHeading>Evidence that you're my favourite person</SceneHeading>
      <p>Tap a little memory.</p>
      {/* The card is sized to the exact space left on screen, so any photo shape fits without scrolling. */}
      <div className="mem-stage" ref={stageRef}>
        <ul className="memories">
          {config.memories.map((m, i) => {
            if (i !== idx) return null;
            const flipped = state.openedMemories.includes(m.id);
            const photo = config.photos.find((p) => p.id === m.photoId);
            const ratio = photo?.width && photo?.height ? photo.height / photo.width : 4 / 3;
            const box = fitBox(stage.w, stage.h, ratio, FRAME_X, FRAME_Y, 380);
            const teaser = m.teaser ?? FALLBACK_TEASERS[i % FALLBACK_TEASERS.length];
            return (
              <li key={m.id} style={{ width: box.w || undefined, height: box.h || undefined, visibility: box.w ? 'visible' : 'hidden' }}>
                <button
                  type="button"
                  className={`mem ${flipped ? 'flipped' : ''}`}
                  style={{ ['--tilt' as string]: `${[-1.6, 1.4, -1][i % 3]}deg` }}
                  aria-pressed={flipped}
                  onClick={() => dispatch({ type: 'toggleMemory', id: m.id })}
                >
                  <span className="mem-inner">
                    {/* Front: a romantic cover with a flip hint. Only the visible face is exposed to assistive tech. */}
                    <span className={`mem-face mem-front ${flipped ? 'is-hidden' : ''}`} aria-hidden={flipped}>
                      <span className="cover-body">
                        <span className="cover-count">Memory {i + 1} of {total}</span>
                        <span className="cover-heart" aria-hidden="true"><Heart size={26} color="#B52346" /></span>
                        <span className="cover-teaser">{teaser}</span>
                        <span className="cover-hint">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                            <path d="M20 11a8 8 0 0 0-14.5-4.5L3 9M3 4v5h5M4 13a8 8 0 0 0 14.5 4.5L21 15M21 20v-5h-5" />
                          </svg>
                          Flip to see
                        </span>
                      </span>
                      <span className="cover-tape" aria-hidden="true" />
                    </span>
                    {/* Back: the whole photo, no text. */}
                    <span className={`mem-face mem-back ${flipped ? '' : 'is-hidden'}`} aria-hidden={!flipped}>
                      <Photo config={config} photoId={m.photoId} variant={i} />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mem-nav">
        <button type="button" className="mem-arrow" aria-label="Previous memory" onClick={() => go(idx - 1)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div className="mem-dots" role="group" aria-label="Choose a memory">
          {config.memories.map((m, i) => (
            <button key={m.id} type="button" className={`mem-dot ${state.seenMemories.includes(m.id) ? 'seen' : ''}`} aria-label={`Memory ${i + 1} of ${total}${state.seenMemories.includes(m.id) ? ', seen' : ''}`} aria-current={i === idx ? 'true' : undefined} onClick={() => go(i)}>
              <span />
            </button>
          ))}
        </div>
        <button type="button" className="mem-arrow" aria-label="Next memory" onClick={() => go(idx + 1)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <button type="button" className="btn primary" disabled={!allSeen} onClick={() => dispatch({ type: 'next', from: 3 })}>
        {allSeen ? 'A birthday wish next' : `Flip all ${total} memories (${seen} of ${total})`}
      </button>
      <div role="status" aria-live="polite" className="sr-only">{allSeen ? 'All memories seen. You can continue.' : ''}</div>
    </section>
  );
}
