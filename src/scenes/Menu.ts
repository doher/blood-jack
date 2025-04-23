import { Scene } from 'phaser';
import { SceneManager } from '../managers/SceneManager.ts';
import { SceneType } from './constants.ts';
import Sprite = Phaser.GameObjects.Sprite;
import { Button, LOW_CLICK_SPEED } from '../views/ui/button/Button.ts';
import {
  ImageLoadingKey,
  UiControlsFrame,
} from '../managers/game-object-factory/imageConstants.ts';
import { UIElementName } from '../views/ui/constants.ts';
import { SoundLoadingKey } from '../managers/sound-manager/constants.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../views/constants.ts';
import { gameObjectFactory } from '../managers/game-object-factory/GameObjectFactory.ts';
import { EventBus } from '../EventBus.ts';

export class Menu extends Scene {
  private sceneManager: SceneManager;

  private gameName: Sprite;

  private background: Sprite;

  private buttonStartGame: Button;

  private mainMenuContainer: Phaser.GameObjects.Container;

  private isStarting = false;

  constructor() {
    super(SceneType.MENU);
  }

  public preload() {
    this.sceneManager = SceneManager.getInstance(this.game);
  }

  public create() {
    this.mainMenuContainer = this.add.container(SCREEN_HALF_W, SCREEN_HALF_H);

    this.background = gameObjectFactory.createSprite(this, {
      key: ImageLoadingKey.SHOP_BACKGROUND,
      position: {
        x: 0,
        y: 0,
      },
    });

    this.gameName = gameObjectFactory.createSprite(this, {
      key: ImageLoadingKey.GAME_NAME,
      position: {
        x: 0,
        y: -300,
      },
      scale: {
        x: 1.3,
        y: 1.3,
      },
    });

    this.buttonStartGame = new Button(
      this,
      { x: 0, y: 250 },
      UiControlsFrame.RED_BUTTON,
      {
        x: 1.5,
        y: 1.4,
      },
      UIElementName.START_GAME,
      {
        text: 'PLAY',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 110,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'white',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.SHOP_BUY_SO_SO,
    );
    this.buttonStartGame.setAlpha(0);

    EventBus.once(UIElementName.START_GAME, () => {
      this.startGame();
    });

    this.mainMenuContainer.add([
      this.background,
      this.buttonStartGame,
      this.gameName,
    ]);

    this.tweens.add({
      delay: 250,
      targets: this.gameName,
      duration: 1100,
      ease: Phaser.Math.Easing.Elastic.InOut,
      scale: 2,
      onComplete: () => {
        this.tweens.add({
          targets: this.buttonStartGame,
          duration: 1000,
          ease: Phaser.Math.Easing.Cubic.Out,
          alpha: 1,
        });
      },
    });
  }

  private startGame() {
    if (this.isStarting) {
      return;
    }

    this.isStarting = true;

    this.sceneManager.start(SceneType.GAME);
    this.gameName.destroy(true);
    this.buttonStartGame.destroy(true);
    this.background.destroy(true);
  }
}
