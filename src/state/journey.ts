import type { StyleId } from '../content/copy';

export type Prefs = { dateMood?: string; need?: string; spoiled?: string };
export type ApplicationState = 'none' | 'qualifications' | 'approved';

export type JourneyState = {
  scene: number; // 1 to 7
  identity?: string;
  envelopeOpen: boolean;
  decisionIndex: number; // 0 to 2
  prefs: Prefs;
  openedMemories: string[];
  wishReady: boolean;
  candlesOut: boolean;
  confettiPending: boolean;
  application: ApplicationState;
  giftOpen: boolean;
  cardStyle: StyleId;
};

export const TOTAL_SCENES = 7;
export const TOTAL_DECISIONS = 3;

export const initialState: JourneyState = {
  scene: 1,
  envelopeOpen: false,
  decisionIndex: 0,
  prefs: {},
  openedMemories: [],
  wishReady: false,
  candlesOut: false,
  confettiPending: false,
  application: 'none',
  giftOpen: false,
  cardStyle: 'romantic',
};

export type Action =
  | { type: 'chooseIdentity'; id: string }
  | { type: 'openEnvelope' }
  | { type: 'choosePref'; key: keyof Prefs; id: string }
  | { type: 'next'; from: number }
  | { type: 'back' }
  | { type: 'toggleMemory'; id: string }
  | { type: 'wishReady' }
  | { type: 'blowCandles' }
  | { type: 'confettiDone' }
  | { type: 'qualifications' }
  | { type: 'approve' }
  | { type: 'openGift' }
  | { type: 'setStyle'; style: StyleId }
  | { type: 'replay' };

const PREF_KEYS: Array<keyof Prefs> = ['dateMood', 'need', 'spoiled'];

export function journeyReducer(s: JourneyState, a: Action): JourneyState {
  switch (a.type) {
    case 'chooseIdentity':
      return s.scene === 1 ? { ...s, identity: a.id } : s;
    case 'openEnvelope':
      return s.scene === 1 && s.identity ? { ...s, envelopeOpen: true } : s;
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
      if (s.scene === 4 && !s.candlesOut) return s;
      return s.scene < TOTAL_SCENES ? { ...s, scene: s.scene + 1 } : s;
    }
    case 'back':
      if (s.scene === 2 && s.decisionIndex > 0) return { ...s, decisionIndex: s.decisionIndex - 1 };
      if (s.scene === 3) return { ...s, scene: 2, decisionIndex: TOTAL_DECISIONS - 1 };
      return s.scene > 1 ? { ...s, scene: s.scene - 1 } : s;
    case 'toggleMemory':
      if (s.scene !== 3) return s;
      return {
        ...s,
        openedMemories: s.openedMemories.includes(a.id)
          ? s.openedMemories.filter((x) => x !== a.id)
          : [...s.openedMemories, a.id],
      };
    case 'wishReady':
      return s.scene === 4 ? { ...s, wishReady: true } : s;
    case 'blowCandles':
      // Only once, and only after the wish is ready.
      return s.scene === 4 && s.wishReady && !s.candlesOut ? { ...s, candlesOut: true, confettiPending: true } : s;
    case 'confettiDone':
      return s.confettiPending ? { ...s, confettiPending: false } : s;
    case 'qualifications':
      return s.scene === 5 && s.application === 'none' ? { ...s, application: 'qualifications' } : s;
    case 'approve':
      return s.scene === 5 ? { ...s, application: 'approved' } : s;
    case 'openGift':
      return s.scene === 6 ? { ...s, giftOpen: true } : s;
    case 'setStyle':
      return s.scene === 7 ? { ...s, cardStyle: a.style } : s;
    case 'replay':
      return { ...initialState };
    default:
      return s;
  }
}

export const treatId = (s: JourneyState): string | undefined => s.prefs.need;
