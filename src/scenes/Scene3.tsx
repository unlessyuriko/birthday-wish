import { Photo } from '../components/Photo';
import { SceneHeading } from '../components/ui';
import type { SceneProps } from './types';

const PROMPTS = ["A moment I'd happily repeat.", 'A tiny thing about you I love.', 'My favourite kind of ordinary day.'];

export function Scene3({ state, dispatch, config }: SceneProps) {
  return (
    <section className="scene" aria-label="Evidence">
      <SceneHeading>Evidence that you're my favourite person</SceneHeading>
      <p>Tap a little memory.</p>
      <ul className="memories">
        {config.memories.map((m, i) => {
          const flipped = state.openedMemories.includes(m.id);
          const title = PROMPTS[i] ?? m.title;
          return (
            <li key={m.id}>
              <button
                type="button"
                className={`mem ${flipped ? 'flipped' : ''}`}
                style={{ ['--tilt' as string]: `${[-2, 1.5, -1][i % 3]}deg` }}
                aria-pressed={flipped}
                onClick={() => dispatch({ type: 'toggleMemory', id: m.id })}
              >
                <span className="mem-inner">
                  <span className={`mem-face mem-front ${flipped ? 'is-hidden' : ''}`} aria-hidden={flipped}>
                    <span className="mem-photo"><Photo config={config} photoId={m.photoId} variant={i} /></span>
                    <span className="mem-title">{title}</span>
                    <span className="mem-hint">Tap to flip</span>
                  </span>
                  <span className={`mem-face mem-back ${flipped ? '' : 'is-hidden'}`} aria-hidden={!flipped}>
                    <span className="mem-title small">{title}</span>
                    <span className="mem-caption">{m.caption}</span>
                    <span className="mem-hint">Tap to flip back</span>
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
