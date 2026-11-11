import { describe, expect, it } from 'vitest';
import { initialState, journeyReducer as r, type JourneyState } from '../src/state/journey';

const run = (s: JourneyState, ...a: Parameters<typeof r>[1][]) => a.reduce(r, s);

describe('journey state', () => {
  const gated = (): JourneyState => run(initialState, { type: 'gateAnswered' }, { type: 'gateAnswered' }, { type: 'gateAnswered' });
  it('the envelope only opens after all three gate questions', () => {
    expect(run(initialState, { type: 'openEnvelope' }).envelopeOpen).toBe(false);
    expect(run(initialState, { type: 'gateAnswered' }, { type: 'openEnvelope' }).envelopeOpen).toBe(false);
    expect(run(gated(), { type: 'openEnvelope' }).envelopeOpen).toBe(true);
  });
  it('the gate cannot go past three answers', () => {
    expect(run(gated(), { type: 'gateAnswered' }).gate).toBe(3);
  });
  it('cannot open the envelope or advance before the gate is done', () => {
    expect(run(initialState, { type: 'next', from: 1 }).scene).toBe(1);
  });
  it('double clicking Continue advances only one scene', () => {
    let s = run(gated(), { type: 'openEnvelope' });
    s = run(s, { type: 'next', from: 1 }, { type: 'next', from: 1 });
    expect(s.scene).toBe(2);
  });
  it('preferences can be changed and survive back navigation', () => {
    let s: JourneyState = { ...initialState, scene: 2 };
    s = run(s, { type: 'choosePref', key: 'dateMood', id: 'dinner' }, { type: 'choosePref', key: 'dateMood', id: 'adventure' });
    expect(s.prefs.dateMood).toBe('adventure');
    s = run(s, { type: 'next', from: 2 });
    expect(s.decisionIndex).toBe(1);
    s = run(s, { type: 'back' });
    expect(s.decisionIndex).toBe(0);
    expect(s.prefs.dateMood).toBe('adventure');
  });
  it('requires a pick before leaving a decision', () => {
    expect(run({ ...initialState, scene: 2 }, { type: 'next', from: 2 }).decisionIndex).toBe(0);
  });
  it('memories toggle and are never required', () => {
    let s: JourneyState = { ...initialState, scene: 3 };
    s = run(s, { type: 'toggleMemory', id: 'm1' });
    expect(s.openedMemories).toEqual(['m1']);
    s = run(s, { type: 'toggleMemory', id: 'm1' });
    expect(s.openedMemories).toEqual([]);
    expect(run(s, { type: 'next', from: 3 }).scene).toBe(4);
  });
  it('candles need the wish first and fire celebration once', () => {
    let s: JourneyState = { ...initialState, scene: 4 };
    expect(run(s, { type: 'blowCandles' }).candlesOut).toBe(false);
    expect(run(s, { type: 'next', from: 4 }).scene).toBe(4);
    s = run(s, { type: 'wishReady' }, { type: 'blowCandles' });
    expect(s.candlesOut && s.confettiPending).toBe(true);
    s = run(s, { type: 'confettiDone' }, { type: 'blowCandles' });
    expect(s.confettiPending).toBe(false);
  });
  it('the journey has six scenes and stops at the last', () => {
    let st: JourneyState = { ...initialState, scene: 6 };
    expect(run(st, { type: 'next', from: 6 }).scene).toBe(6);
    st = run({ ...initialState, scene: 4, wishReady: true, candlesOut: true }, { type: 'next', from: 4 });
    expect(st.scene).toBe(5);
  });
  it('the gift opens on scene 5 and the card style changes on scene 6', () => {
    expect(run({ ...initialState, scene: 5 }, { type: 'openGift' }).giftOpen).toBe(true);
    expect(run({ ...initialState, scene: 6 }, { type: 'setStyle', style: 'minimal' }).cardStyle).toBe('minimal');
    expect(run({ ...initialState, scene: 5 }, { type: 'setStyle', style: 'minimal' }).cardStyle).toBe('romantic');
  });
  it('replay resets everything', () => {
    const s = run({ ...initialState, scene: 6, giftOpen: true, cardStyle: 'funny' }, { type: 'replay' });
    expect(s).toEqual(initialState);
  });
  it('back from the first scene is a no-op', () => {
    expect(run(initialState, { type: 'back' }).scene).toBe(1);
  });
});
