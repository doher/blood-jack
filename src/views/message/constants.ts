import { AnimationPlayingKey } from '../../managers/animation-manager/AnimationManager.ts';

export interface Message {
  startType: (
    texts: string[],
    animTypeToTalkKey:
      | AnimationPlayingKey.DEALER_TALK_PLAY
      | AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
  ) => void;
}

export const enum MessageEvents {
  START_TALK = 'START_TALK',
  COMPLETE_TALK = 'COMPLETE_TALK',
}
