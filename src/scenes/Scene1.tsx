import { useEffect, useState } from 'react';
import { Bear, Envelope, Heartbeat, HeartBurst } from '../components/Art';
import { ChaseButton } from '../components/ChaseButton';
import { BouquetAuto, prefetchBouquet3D } from '../components/BouquetAuto';
import { Reaction, SceneHeading } from '../components/ui';
import { gateQuestions } from '../content/copy';
import { TOTAL_GATE } from '../state/journey';
import type { SceneProps } from './types';

export function Scene1({ state, dispatch, config }: SceneProps) {
  const [line, setLine] = useState<string>();
  const [burst, setBurst] = useState(0);
  // Warm up the 3D bouquet while the opening questions are being answered.
  useEffect(() => {
    prefetchBouquet3D();
  }, []);
  const q = gateQuestions[Math.min(state.gate, TOTAL_GATE - 1)];
  const gating = state.gate < TOTAL_GATE;

  const answered = (reaction: string) => {
    setLine(reaction);
    setBurst((b) => b + 1);
    dispatch({ type: 'gateAnswered' });
  };

  return (
    <section className="scene" aria-label="Special delivery">
      <div className={`hero-art ${state.envelopeOpen ? 'open' : 'compact'}`}>
        {!state.envelopeOpen && <Bear size={56} className="bear-bob" />}
        <div className="env-scale">
          <Envelope open={state.envelopeOpen}>{state.envelopeOpen && <BouquetAuto />}</Envelope>
        </div>
        <p className="envelope-to">For {config.recipient.nickname}</p>
      </div>
      <SceneHeading>Special delivery for the birthday girl</SceneHeading>
      {!state.envelopeOpen ? (
        <>
          <p className="intro">Someone asked me to deliver a suspicious amount of love today.</p>
          {gating ? (
            <>
              <Reaction text={line} />
              <div className="gate" key={state.gate}>
                <div className="gate-head">
                  <Heartbeat size={36} />
                  <p className="eyebrow"><span className="long">Before I hand it over: </span>check {state.gate + 1} of {TOTAL_GATE}</p>
                </div>
                <p className="gate-q">{q.question}</p>
                <div className="gate-yes">
                  <button
                    type="button"
                    className="btn primary"
                    autoFocus={state.gate > 0}
                    onClick={() => answered(q.yesReaction)}
                  >
                    {q.yesLabel}
                  </button>
                  {burst > 0 && <HeartBurst key={burst} />}
                </div>
                <GateTaunts q={q} onCaught={() => answered(q.caughtReaction)} />
              </div>
            </>
          ) : (
            <>
              <Reaction text={line} />
              <button type="button" className="btn primary" autoFocus onClick={() => dispatch({ type: 'openEnvelope' })}>
                Open my envelope
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <div className="letter-lines">
            <p className="script">Happy Birthday, {config.recipient.nickname}.</p>
            <p>I made you a little something.</p>
            <p>Okay... I may have got carried away.</p>
          </div>
          <button type="button" className="btn primary" autoFocus onClick={() => dispatch({ type: 'next', from: 1 })}>
            Let me see
          </button>
        </>
      )}
    </section>
  );
}

function GateTaunts({ q, onCaught }: { q: (typeof gateQuestions)[number]; onCaught: () => void }) {
  const [taunt, setTaunt] = useState<string>();
  return (
    <>
      <ChaseButton label={q.noLabel} giveUpLabel={q.giveUpLabel} taunts={q.taunts} onTaunt={setTaunt} onCaught={onCaught} />
      <div className="taunt-slot"><Reaction text={taunt} /></div>
    </>
  );
}
