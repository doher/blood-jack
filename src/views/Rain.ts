import { AnimationPlayingKey } from '../managers/animation-manager/AnimationManager.ts';
import { AnimationLoadingKey } from '../managers/animation-manager/constants.ts';
import { gameObjectFactory } from '../managers/game-object-factory/GameObjectFactory.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from './constants.ts';
import { SoundManager } from '../managers/sound-manager/SoundManager.ts';
import { SoundLoadingKey } from '../managers/sound-manager/constants.ts';
import { EventBus } from '../EventBus.ts';

export const STOP_RAIN_SOUND = 'STOP_RAIN_SOUND';

export class Rain {
  constructor(private scene: Phaser.Scene) {
    this.create();
  }

  private create() {
    const rain = gameObjectFactory.createSprite(this.scene, {
      key: AnimationLoadingKey.RAIN,
      position: {
        x: SCREEN_HALF_W - 200,
        y: SCREEN_HALF_H - 200,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });
    rain.setTint(11);
    rain.play(AnimationPlayingKey.RAIN_PLAY);
    SoundManager.getInstance().play(SoundLoadingKey.RAIN, true, false, 0.3);
    rain.setBlendMode(Phaser.BlendModes.LIGHTER);

    EventBus.on(STOP_RAIN_SOUND, () => {
      SoundManager.getInstance().stop(SoundLoadingKey.RAIN);
    });
  }
}
