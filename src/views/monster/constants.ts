import type { AnimationPlayingKey } from '../../managers/animation-manager/AnimationManager.ts';

export const enum MonsterObjectsId {
  BODY = 'BODY',
  EYE_CONTAINER = 'EYE_CONTAINER',
  EYE_BACK = 'EYE_BACK',
  EYE_TOP = 'EYE_TOP',
}

export interface MonsterAnimation {
  talk: (
    animKey:
      | AnimationPlayingKey.DEALER_TALK_PLAY
      | AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
    countTimes?: number,
  ) => void;
  earDancing: (countTimes?: number) => void;
  sad: () => void;
  smile: () => void;
}
