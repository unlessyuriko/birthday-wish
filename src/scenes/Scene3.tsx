import { Heart } from '../components/Art';
import { Photo } from '../components/Photo';
import { SceneHeading } from '../components/ui';
import type { SceneProps } from './types';

export function Scene3({ state, dispatch, config }: SceneProps) {
  const total = config.memories.length;
  return (
    <section className="scene" aria-label="Evidence">
      <SceneHeading>Evidence that you're my favourite person</SceneHeading>
      <p>Tap a little memory.</p>
      <ul className="memories">
        {config.memories.map((m, i) => {
          const flipped = state.openedMemories.includes(m.id);
          return (
            <li key={m.id}>
              <button
                type="button"
                className={`mem ${flipped ? 'flipped' : ''}`}
                style={{ ['--tilt' as string]: `${[-2.5, 2, -1.5][i % 3]}deg` }}
                aria-pressed={flipped}
                onClick={() => dispatch({ type: 'toggleMemory', id: m.id })}
              >
                <span className="mem-inner">
                  {/* Front: a decorative cover. Only the visible face is exposed to assistive tech. */}
                  <span className={`mem-face mem-front ${flipped ? 'is-hidden' : ''}`} aria-hidden={flipped}>
                    <span className="sr-only">Memory {i + 1} of {total}. Tap to see it.</span>
                    <span className="cover-heart" aria-hidden="true"><Heart size={34} color="#B52346" /></span>
                    <span className="cover-num" aria-hidden="true">{i + 1}</span>
                    <span className="cover-tape" aria-hidden="true" />
                  </span>
                  {/* Back: the photo only, no text. */}
                  <span className={`mem-face mem-back ${flipped ? '' : 'is-hidden'}`} aria-hidden={!flipped}>
                    <Photo config={config} photoId={m.photoId} variant={i} />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <button type="button" className="btn primary" onClick={() => dispatch({ type: 'next', from: 3 })}>
        A birthday wish next
      </button>
    </section>
  );
}
