import { Bear, Envelope } from '../components/Art';
import { Photo } from '../components/Photo';
import { Choices, Reaction, SceneHeading } from '../components/ui';
import { identityOptions } from '../content/copy';
import type { SceneProps } from './types';

export function Scene1({ state, dispatch, config }: SceneProps) {
  const picked = identityOptions.find((o) => o.id === state.identity);
  return (
    <section className="scene" aria-label="Special delivery">
      <div className="hero-art">
        <Bear size={96} className="bear-bob" />
        <Envelope open={state.envelopeOpen}>
          {state.envelopeOpen && config.heroPhotoId && (
            <div className="env-photo"><Photo config={config} photoId={config.heroPhotoId} /></div>
          )}
        </Envelope>
        <p className="envelope-to">For {config.recipient.nickname}</p>
      </div>
      <div>
        <SceneHeading>Special delivery for the birthday girl</SceneHeading>
      </div>
      {!state.envelopeOpen ? (
        <>
          <p>Someone asked me to deliver a suspicious amount of love today.</p>
          <p>Before I hand it over... who's opening this?</p>
          <Choices label="Who is opening this?" options={identityOptions} value={state.identity} onPick={(id) => dispatch({ type: 'chooseIdentity', id })} />
          <Reaction text={picked?.reaction} />
          {state.identity && (
            <button type="button" className="btn primary" onClick={() => dispatch({ type: 'openEnvelope' })}>
              Open my envelope
            </button>
          )}
        </>
      ) : (
        <>
          <div className="letter-lines">
            <p className="script">Happy Birthday, {config.recipient.nickname}.</p>
            <p>I made you a little something.</p>
            <p>Okay... I may have got carried away.</p>
          </div>
          <button type="button" className="btn primary" onClick={() => dispatch({ type: 'next', from: 1 })}>
            Let me see
          </button>
        </>
      )}
    </section>
  );
}
