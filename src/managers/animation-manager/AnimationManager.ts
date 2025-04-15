import { AnimationLoadingKey } from './constants.ts';

// TODO move to other file
export const enum AnimationPlayingKey {
  DEALER_TALK_PLAY = 'DEALER_TALK_PLAY',
  DEALER_ANGRY_TALK_PLAY = 'DEALER_ANGRY_TALK_PLAY',
  DEALER_SMILE_PLAY = 'DEALER_SMILE_PLAY',
  DEALER_SAD_PLAY = 'DEALER_SAD_PLAY',
  DEALER_EAR_MOVEMENT_PLAY = 'DEALER_EAR_MOVEMENT_PLAY',
  RAIN_PLAY = 'RAIN_PLAY',
  BACKGROUND_JAIL_PLAY = 'BACKGROUND_JAIL_PLAY',
}

type AnimationRegistrationLayout = {
  key: AnimationPlayingKey;
  frames: AnimationLoadingKey;
  frameRate: 32 | 16;
  repeat: number;
};

export const ANIMATIONS_TO_CREATE: AnimationRegistrationLayout[] = [
  {
    key: AnimationPlayingKey.DEALER_TALK_PLAY,
    frames: AnimationLoadingKey.DEALER_TALK,
    frameRate: 32,
    repeat: 0,
  },
  {
    key: AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
    frames: AnimationLoadingKey.DEALER_ANGRY_TALK,
    frameRate: 32,
    repeat: 0,
  },
  {
    key: AnimationPlayingKey.DEALER_SMILE_PLAY,
    frames: AnimationLoadingKey.DEALER_SMILE,
    frameRate: 32,
    repeat: 0,
  },
  {
    key: AnimationPlayingKey.DEALER_SAD_PLAY,
    frames: AnimationLoadingKey.DEALER_SAD,
    frameRate: 32,
    repeat: 0,
  },
  {
    key: AnimationPlayingKey.DEALER_EAR_MOVEMENT_PLAY,
    frames: AnimationLoadingKey.DEALER_EAR_MOVEMENT,
    frameRate: 32,
    repeat: 0,
  },
  {
    key: AnimationPlayingKey.RAIN_PLAY,
    frames: AnimationLoadingKey.RAIN,
    frameRate: 32,
    repeat: -1,
  },
  {
    key: AnimationPlayingKey.BACKGROUND_JAIL_PLAY,
    frames: AnimationLoadingKey.BACKGROUND_JAIL,
    frameRate: 16,
    repeat: -1,
  },
];

export class AnimationManager {
  private animationManager: Phaser.Animations.AnimationManager;

  private static instance: AnimationManager | null = null;

  private constructor(scene: Phaser.Scene) {
    this.animationManager = scene.anims;
  }

  public static getInstance(scene: Phaser.Scene): AnimationManager {
    if (AnimationManager.instance) {
      return AnimationManager.instance;
    }

    AnimationManager.instance = new AnimationManager(scene);
    return AnimationManager.instance;
  }

  public registrationAnimation() {
    ANIMATIONS_TO_CREATE.forEach((animationToRegister) => {
      this.animationManager.create({
        key: animationToRegister.key,
        frames: animationToRegister.frames,
        frameRate: animationToRegister.frameRate,
        repeat: animationToRegister.repeat,
      });
    });
  }
}
