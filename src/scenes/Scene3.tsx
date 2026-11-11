import { useState } from 'react';
import { Heart } from '../components/Art';
import { Photo } from '../components/Photo';
import { SceneHeading } from '../components/ui';
import type { SceneProps } from './types';

const FALLBACK_TEASERS = ['Every moment with you is my favourite.', 'You make ordinary days feel like magic.', 'Still falling for you, every single day.'];

export function Scene3({ state, dispatch, config }: SceneProps) {
  const total = config.memories.length;
  const [idx, setIdx] = useState(0);
  const go = (n: number) => setIdx((n + total) % total);
  return (
    <section className="scene" aria-label="Evidence">
      <SceneHeading>Evidence that you're my favourite person</SceneHeading>
      <p>Tap a little memory.</p>
      <ul className="memories">
        {config.memories.map((m, i) => {
          if (i !== idx) return null;
          const flipped = state.openedMemories.includes(m.id);
          const photo = config.photos.find((p) => p.id === m.photoId);
          // Match the card to the photo's own proportions so the whole picture shows.
          const ratio = photo?.width && photo?.height ? (photo.height / photo.width) * 100 : 133.33;
          const teaser = m.teaser ?? FALLBACK_TEASERS[i % FALLBACK_TEASERS.length];
          return (
            <li key={m.id}>
              <button
                type="button"
                className={`mem ${flipped ? 'flipped' : ''}`}
                style={{ ['--tilt' as string]: `${[-2, 1.6, -1.2][i % 3]}deg`, ['--ratio' as string]: `${ratio}%`, ['--rn' as string]: ratio / 100 }}
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
      <div className="mem-nav">
        <button type="button" className="mem-arrow" aria-label="Previous memory" onClick={() => go(idx - 1)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div className="mem-dots" role="group" aria-label="Choose a memory">
          {config.memories.map((m, i) => (
            <button key={m.id} type="button" className="mem-dot" aria-label={`Memory ${i + 1} of ${total}`} aria-current={i === idx ? 'true' : undefined} onClick={() => go(i)}>
              <span />
            </button>
          ))}
        </div>
        <button type="button" className="mem-arrow" aria-label="Next memory" onClick={() => go(idx + 1)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <button type="button" className="btn primary" onClick={() => dispatch({ type: 'next', from: 3 })}>
        A birthday wish next
      </button>
    </section>
  );
}
