import type { Dispatch } from 'react';
import type { BirthdayConfig } from '../content/types';
import type { Action, JourneyState } from '../state/journey';

export type SceneProps = {
  state: JourneyState;
  dispatch: Dispatch<Action>;
  config: BirthdayConfig;
};
