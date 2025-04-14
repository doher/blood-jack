import { Scene } from 'phaser';
import { AnimationPlayingKey } from '../managers/animation-manager/AnimationManager.ts';
import { AnimationLoadingKey } from '../managers/animation-manager/constants.ts';
import { gameObjectFactory } from '../managers/game-object-factory/GameObjectFactory.ts';
import { SceneManager } from '../managers/SceneManager.ts';
import { SceneType } from './constants.ts';

export class MainGame extends Scene {
  private sceneManager: SceneManager;

  constructor() {
    super(SceneType.GAME);
  }

  public preload() {
    console.log('Preload' + SceneType.GAME);
    this.initializeManagers();
  }

  private initializeManagers() {
    this.sceneManager = SceneManager.getInstance(this.game);
  }

  public create() {
    const rainAnimation = gameObjectFactory.createSprite(this, {
      key: AnimationLoadingKey.RAIN,
      position: {
        x: 0,
        y: 0,
      },
    });

    rainAnimation.setTint(100);
    rainAnimation.play(AnimationPlayingKey.RAIN_PLAY);
  }
}
