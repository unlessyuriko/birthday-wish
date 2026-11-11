import type { StyleId } from '../content/copy';

export type Prefs = { dateMood?: string; need?: string; spoiled?: string };

export type JourneyState = {
  scene: number; // 1 to 6
  /** Number of gate questions answered (0 to 3). */
  gate: number;
  envelopeOpen: boolean;
  decisionIndex: number; // 0 to 2
  prefs: Prefs;
  openedMemories: string[];
  /** Memories that have been flipped at least once (stays true even if flipped back). */
  seenMemories: string[];
  wishReady: boolean;
  candlesOut: boolean;
  confettiPending: boolean;
  giftOpen: boolean;
  cardStyle: StyleId;
};

export const TOTAL_SCENES = 6;
export const TOTAL_DECISIONS = 3;
export const TOTAL_GATE = 3;
export const TOTAL_MEMORIES = 3;

export const initialState: JourneyState = {
  scene: 1,
  gate: 0,
  envelopeOpen: false,
  decisionIndex: 0,
  prefs: {},
  openedMemories: [],
  seenMemories: [],
  wishReady: false,
  candlesOut: false,
  confettiPending: false,
  giftOpen: false,
  cardStyle: 'romantic',
};

export type Action =
  | { type: 'gateAnswered' }
  | { type: 'openEnvelope' }
  | { type: 'choosePref'; key: keyof Prefs; id: string }
  | { type: 'next'; from: number }
  | { type: 'back' }
  | { type: 'toggleMemory'; id: string }
  | { type: 'wishReady' }
  | { type: 'blowCandles' }
  | { type: 'confettiDone' }
  | { type: 'openGift' }
  | { type: 'setStyle'; style: StyleId }
  | { type: 'replay' };

const PREF_KEYS: Array<keyof Prefs> = ['dateMood', 'need', 'spoiled'];

export function journeyReducer(s: JourneyState, a: Action): JourneyState {
  switch (a.type) {
    case 'gateAnswered':
      return s.scene === 1 && s.gate < TOTAL_GATE ? { ...s, gate: s.gate + 1 } : s;
    case 'openEnvelope':
      return s.scene === 1 && s.gate >= TOTAL_GATE ? { ...s, envelopeOpen: true } : s;
    case 'choosePref':
      return s.scene === 2 ? { ...s, prefs: { ...s.prefs, [a.key]: a.id } } : s;
    case 'next': {
      // "from" guards against double clicks advancing more than one step.
      if (a.from !== s.scene) return s;
      if (s.scene === 2 && s.decisionIndex < TOTAL_DECISIONS - 1) {
        if (!s.prefs[PREF_KEYS[s.decisionIndex]]) return s;
        return { ...s, decisionIndex: s.decisionIndex + 1 };
      }
      if (s.scene === 1 && !s.envelopeOpen) return s;
      if (s.scene === 2 && !s.prefs[PREF_KEYS[s.decisionIndex]]) return s;
      if (s.scene === 3 && s.seenMemories.length < TOTAL_MEMORIES) return s; // every memory must be flipped first
      if (s.scene === 4 && !s.candlesOut) return s;
      return s.scene < TOTAL_SCENES ? { ...s, scene: s.scene + 1 } : s;
    }
    case 'back':
      if (s.scene === 2 && s.decisionIndex > 0) return { ...s, decisionIndex: s.decisionIndex - 1 };
      if (s.scene === 3) return { ...s, scene: 2, decisionIndex: TOTAL_DECISIONS - 1 };
      return s.scene > 1 ? { ...s, scene: s.scene - 1 } : s;
    case 'toggleMemory': {
      if (s.scene !== 3) return s;
      const opening = !s.openedMemories.includes(a.id);
      return {
        ...s,
        openedMemories: opening ? [...s.openedMemories, a.id] : s.openedMemories.filter((x) => x !== a.id),
        seenMemories: opening && !s.seenMemories.includes(a.id) ? [...s.seenMemories, a.id] : s.seenMemories,
      };
    }
    case 'wishReady':
      return s.scene === 4 ? { ...s, wishReady: true } : s;
    case 'blowCandles':
      // Only once, and only after the wish is ready.
      return s.scene === 4 && s.wishReady && !s.candlesOut ? { ...s, candlesOut: true, confettiPending: true } : s;
    case 'confettiDone':
      return s.confettiPending ? { ...s, confettiPending: false } : s;
    case 'openGift':
      return s.scene === 5 ? { ...s, giftOpen: true } : s;
    case 'setStyle':
      return s.scene === 6 ? { ...s, cardStyle: a.style } : s;
    case 'replay':
      return { ...initialState };
    default:
      return s;
  }
}

export const treatId = (s: JourneyState): string | undefined => s.prefs.need;
