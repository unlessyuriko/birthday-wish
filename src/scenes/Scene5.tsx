import { Reaction, SceneHeading } from '../components/ui';
import { privileges, qualifications } from '../content/copy';
import type { SceneProps } from './types';

export function Scene5({ state, dispatch, config }: SceneProps) {
  const approved = state.application === 'approved';
  if (!config.features.relationshipJoke) {
    return (
      <section className="scene" aria-label="Birthday privileges">
        <SceneHeading>Your birthday privileges</SceneHeading>
        <ul className="ticks">
          {privileges.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <button type="button" className="btn primary" onClick={() => dispatch({ type: 'next', from: 5 })}>
          Keep opening my birthday gift
        </button>
      </section>
    );
  }
  return (
    <section className="scene" aria-label="Birthday person application">
      <SceneHeading>One more birthday with you?</SceneHeading>
      <p>Can I apply to be your birthday person again next year?</p>
      {!approved && (
        <div className="btn-row">
          <button type="button" className="btn primary" onClick={() => dispatch({ type: 'approve' })}>
            You're hired
          </button>
          {state.application === 'none' && (
            <button type="button" className="btn secondary" onClick={() => dispatch({ type: 'qualifications' })}>
              What are your qualifications?
            </button>
          )}
        </div>
      )}
      {state.application !== 'none' && (
        <div className="application">
          <p className="eyebrow">Application attached:</p>
          <ul className="ticks">
            {qualifications.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
          {!approved && (
            <button type="button" className="btn primary" onClick={() => dispatch({ type: 'approve' })}>
              Application approved
            </button>
          )}
        </div>
      )}
      <Reaction text={approved ? "Best news I've had all day." : undefined} />
      <button
        type="button"
        className={approved ? 'btn primary' : 'btn quiet'}
        onClick={() => dispatch({ type: 'next', from: 5 })}
      >
        Keep opening my birthday gift
      </button>
    </section>
  );
}
