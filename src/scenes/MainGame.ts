import { Scene } from 'phaser';
import { AnimationLoadingKey } from '../managers/animation-manager/constants.ts';
import { gameObjectFactory } from '../managers/game-object-factory/GameObjectFactory.ts';
import { ImageLoadingKey } from '../managers/game-object-factory/imageConstants.ts';
import { SceneType } from './constants.ts';
import { Dealer } from '../actors/dealer/Dealer.ts';
import { AnimationPlayingKey } from '../managers/animation-manager/AnimationManager.ts';
import { Rain } from '../views/Rain.ts';

export class MainGame extends Scene {
  private dealer: Dealer;

  constructor() {
    super(SceneType.GAME);
  }

  public preload() {
    console.log('Preload' + SceneType.GAME);
  }

  public create() {
    /// TODO add background for rain

    new Rain(this);

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

    this.dealer = new Dealer(this);
    this.dealer.talkText(
      [
        'Pypypy Pypypy Pypypy',
        'Lets play Blackjack, 2 rounds, after last round is russian roulette',
      ],
      AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
    );
  }

  public update() {
    this.dealer.handlePlayerCursor();
  }
}
