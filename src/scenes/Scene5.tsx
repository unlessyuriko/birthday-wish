import { Heartbeat } from '../components/Art';
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
  const quals = state.application !== 'none';
  return (
    <section className="scene" aria-label="Birthday person application">
      <div className="hero-art"><Heartbeat size={60} /></div>
      <SceneHeading>One more birthday with you?</SceneHeading>
      <p>Can I apply to be your birthday person again next year?</p>
      {quals && (
        <div className="application">
          <p className="eyebrow">Application attached:</p>
          <ul className="ticks">
            {qualifications.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      )}
      <Reaction text={approved ? "Best news I've had all day." : undefined} />
      <div className="btn-stack">
        {!approved && !quals && (
          <>
            <button type="button" className="btn primary" onClick={() => dispatch({ type: 'approve' })}>
              You're hired
            </button>
            <button type="button" className="btn secondary" onClick={() => dispatch({ type: 'qualifications' })}>
              What are your qualifications?
            </button>
          </>
        )}
        {!approved && quals && (
          <button type="button" className="btn primary" autoFocus onClick={() => dispatch({ type: 'approve' })}>
            Application approved
          </button>
        )}
        <button type="button" className={approved ? 'btn primary' : 'btn quiet'} autoFocus={approved} onClick={() => dispatch({ type: 'next', from: 5 })}>
          Keep opening my birthday gift
        </button>
      </div>
    </section>
  );
}
