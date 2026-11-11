import { Bear, Cake } from '../components/Art';
import { Confetti, SceneHeading, useReducedMotion } from '../components/ui';
import type { SceneProps } from './types';

export function Scene4({ state, dispatch }: SceneProps) {
  const reduced = useReducedMotion();
  return (
    <section className="scene" aria-label="Birthday wish">
      {state.confettiPending && !reduced && <Confetti onDone={() => dispatch({ type: 'confettiDone' })} />}
      <div className="hero-art">
        <Bear size={72} className="bear-bob" />
        {state.wishReady && !state.candlesOut ? (
          // Pointer convenience only: the labelled button below is the accessible action.
          <button type="button" className="cake-btn" tabIndex={-1} aria-hidden="true" onClick={() => dispatch({ type: 'blowCandles' })}>
            <Cake out={false} />
          </button>
        ) : (
          <Cake out={state.candlesOut} />
        )}
      </div>
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
          <p>Tap the candles when you're ready.</p>
          <button type="button" className="btn primary" onClick={() => dispatch({ type: 'blowCandles' })}>
            Blow out the candles
          </button>
        </>
      )}
      {state.candlesOut && (
        <>
          <div role="status" aria-live="polite">
            <p className="script">I hope it comes true.</p>
            <p>And I hope this year gives you so many reasons to smile.</p>
          </div>
          <button type="button" className="btn primary" onClick={() => dispatch({ type: 'next', from: 4 })}>
            There's a little more
          </button>
        </>
      )}
    </section>
  );
}
