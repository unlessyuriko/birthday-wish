import { useState } from 'react';
import { FitArt } from '../components/FitArt';
import { Bear } from '../components/Art';
import { CakeAuto } from '../components/CakeAuto';
import { Confetti, SceneHeading, useReducedMotion } from '../components/ui';
import type { SceneProps } from './types';

export function Scene4({ state, dispatch }: SceneProps) {
  const reduced = useReducedMotion();
  const [level, setLevel] = useState(0);
  const release = () => {
    // Let go before the end and the flames spring back, so it never feels stuck.
    if (!state.candlesOut) setLevel((l) => (l >= 100 ? l : 0));
  };
  const onSlide = (v: number) => {
    setLevel(v);
    if (v >= 100) dispatch({ type: 'blowCandles' });
  };
  return (
    <section className="scene" aria-label="Birthday wish">
      {state.confettiPending && !reduced && <Confetti onDone={() => dispatch({ type: 'confettiDone' })} />}
      <FitArt>
        <Bear size={72} className="bear-bob" />
        <CakeAuto out={state.candlesOut} level={level / 100} />
      </FitArt>
      <SceneHeading>A tiny cake. A very big wish.</SceneHeading>
      {!state.wishReady && (
        <>
          <p>Okay, birthday girl.</p>
          <p>Close your eyes for a moment.</p>
          <p>Make a wish. Keep it yours.</p>
          <button type="button" className="btn primary" onClick={() => dispatch({ type: 'wishReady' })}>
            I made my wish
          </button>
        </>
      )}
      {state.wishReady && !state.candlesOut && (
        <>
          <p>Tap and drag all the way across to blow out the candles.</p>
          <div className={`blow ${level === 0 ? '' : 'is-active'}`} style={{ ['--p' as string]: level / 100 }}>
            <div className="blow-fill" aria-hidden="true" />
            <span className="blow-label" aria-hidden="true">{level === 0 ? 'Blow out the candles' : ''}</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={level}
              autoFocus
              aria-label="Blow out the candles"
              aria-valuetext={`${level} percent blown. Slide to the end, or press End, to blow out the candles.`}
              onChange={(e) => onSlide(Number(e.target.value))}
              onPointerUp={release}
              onPointerCancel={release}
              onTouchEnd={release}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSlide(100);
                }
              }}
            />
          </div>
          <p className="hint">Using a keyboard? Press End, Enter or Space.</p>
        </>
      )}
      {state.candlesOut && (
        <>
          <div role="status" aria-live="polite">
            <p className="script">I hope it comes true.</p>
            <p>And I hope this year gives you so many reasons to smile.</p>
          </div>
          <button type="button" className="btn primary" autoFocus onClick={() => dispatch({ type: 'next', from: 4 })}>
            There's a little more
          </button>
        </>
      )}
    </section>
  );
}
