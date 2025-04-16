import { Scene } from 'phaser';
import { AnimationLoadingKey } from '../managers/animation-manager/constants.ts';
import { gameObjectFactory } from '../managers/game-object-factory/GameObjectFactory.ts';
import { ImageLoadingKey } from '../managers/game-object-factory/imageConstants.ts';
import { SceneType } from './constants.ts';

export class MainGame extends Scene {
  constructor() {
    super(SceneType.GAME);
  }

  public preload() {
    console.log('Preload' + SceneType.GAME);
  }

  public create() {
    gameObjectFactory.createSprite(this, {
      key: AnimationLoadingKey.BACKGROUND_JAIL,
      position: {
        x: 1920 / 2,
        y: 1080 / 2,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });

    gameObjectFactory.createSprite(this, {
      key: ImageLoadingKey.TABLE,
      position: {
        x: 1920 / 2,
        y: 1080 / 2 + 200,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });
  }
}
