import { Choices, Reaction, SceneHeading } from '../components/ui';
import { decisions } from '../content/copy';
import { TOTAL_DECISIONS } from '../state/journey';
import type { SceneProps } from './types';

export function Scene2({ state, dispatch }: SceneProps) {
  const d = decisions[state.decisionIndex];
  const value = state.prefs[d.id];
  const picked = d.options.find((o) => o.id === value);
  const last = state.decisionIndex === TOTAL_DECISIONS - 1;
  return (
    <section className="scene" aria-label="Today's very important decisions">
      <p className="eyebrow">Today's very important decisions</p>
      <p className="eyebrow soft">Decision {state.decisionIndex + 1} of {TOTAL_DECISIONS}</p>
      <SceneHeading focusKey={state.decisionIndex}>{d.question}</SceneHeading>
      <Choices label={d.question} options={d.options} value={value} onPick={(id) => dispatch({ type: 'choosePref', key: d.id, id })} />
      <Reaction text={picked?.reaction} />
      {picked && (
        <button type="button" className="btn primary" onClick={() => dispatch({ type: 'next', from: 2 })}>
          {last ? 'On to the evidence' : 'Continue'}
        </button>
      )}
    </section>
  );
}
