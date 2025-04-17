import type { AnimationPlayingKey } from '../../managers/animation-manager/AnimationManager.ts';

export interface Message {
  startType: (
    texts: string[],
    animTypeToTalkKey:
      | AnimationPlayingKey.DEALER_TALK_PLAY
      | AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
  ) => void;
}

export const enum MessageEvents {
  START_TALK = 'MessageEvents_START_TALK',
  COMPLETE_TALK = 'MessageEvents_COMPLETE_TALK',
}
