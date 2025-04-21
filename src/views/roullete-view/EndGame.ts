import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;
import { Position } from '../../managers/game-object-factory/constants.ts';
import { Shadow } from '../Shadow.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import {
  ImageLoadingKey,
  ShopFrame,
} from '../../managers/game-object-factory/imageConstants.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../constants.ts';
import { TurnType } from './RouletteView.ts';
import { SoundManager } from '../../managers/sound-manager/SoundManager.ts';
import { SoundLoadingKey } from '../../managers/sound-manager/constants.ts';
import { EventBus } from '../../EventBus.ts';
import { HIDE__DEFAULT_CURSOR, HIDE_CURSOR } from '../cursor/Cursor.ts';

//THANKS FOR PLAYING
// HA HA HA

const YOU_POSITION: Position = {
  x: -170,
  y: 20,
};

const WIN_RESULT_POSITION: Position = {
  x: 170,
  y: 20,
};

const LOSE_RESULT_POSITION: Position = {
  x: 190,
  y: 20,
};

export class EndGame extends Container {
  private shadow: Shadow;

  private blinkEffect: Phaser.GameObjects.Arc;

  private balanceBackground: Sprite;

  private winResultText: Phaser.GameObjects.Text;

  private youText: Phaser.GameObjects.Text;

  private thanksForPlaying: Phaser.GameObjects.Text;

  private scaleContainer: Phaser.GameObjects.Container;

  constructor(
    private scene: Phaser.Scene,
    private turn: TurnType,
  ) {
    super(scene, 0, 0);
    this.create();
    this.setAlpha(0);
    EventBus.emit(HIDE_CURSOR);
  }

  public showEndGame() {
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 1500,
      ease: Phaser.Math.Easing.Linear,
    });

    this.scene.time.delayedCall(2000, () => {
      this.startShowEndGame();
    });
  }

  private create() {
    this.shadow = new Shadow(this.scene, 1);

    this.balanceBackground = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.UI_SHOP,
      frame: ShopFrame.UNBALANCED,
      origin: {
        x: 0.5,
        y: 0.5,
      },
      position: {
        x: 0,
        y: 0,
      },
      scale: {
        x: 0.8,
        y: 0.8,
      },
    });
    this.balanceBackground.preFX?.addShine(0.5, 0.5, 6);

    const resultText = this.turn === TurnType.PLAYER ? 'LOSE' : 'WIN';
    const resultColor = this.turn === TurnType.PLAYER ? 'red' : 'green';
    const position = this.getResultTextPosition();

    this.winResultText = gameObjectFactory.createText(this.scene, {
      position: {
        x: position.x,
        y: -25,
      },
      color: resultColor,
      fontSize: 140,
      origin: {
        x: 0.5,
        y: 0.5,
      },
      text: resultText,
    });

    this.thanksForPlaying = gameObjectFactory.createText(this.scene, {
      position: {
        x: 0,
        y: 0,
      },
      color: 'white',
      fontSize: 135,
      origin: {
        x: 0.5,
        y: 0.5,
      },
      text: 'THANKS FOR PLAYING!!!',
    });

    this.thanksForPlaying.setAlpha(0);
    this.thanksForPlaying.setScale(0);

    this.youText = gameObjectFactory.createText(this.scene, {
      position: {
        x: -170,
        y: 50,
      },
      color: resultColor,
      fontSize: 140,
      origin: {
        x: 0.5,
        y: 0.5,
      },
      text: 'YOU',
    });

    this.scaleContainer = this.scene.add.container(0, 0);
    this.scaleContainer.add([
      this.balanceBackground,
      this.winResultText,
      this.youText,
    ]);

    this.add([this.shadow, this.scaleContainer, this.thanksForPlaying]);
  }

  private getResultTextPosition() {
    return this.turn === TurnType.PLAYER
      ? LOSE_RESULT_POSITION
      : WIN_RESULT_POSITION;
  }

  private startShowEndGame() {
    let shakeTween: Phaser.Tweens.Tween;

    this.scene.tweens.add({
      targets: this.scaleContainer,
      scale: 2,
      duration: 1500,
      ease: 'Cubic.easeOut',
      onStart: () => {
        shakeTween = this.scene.tweens.add({
          targets: this.scaleContainer,
          x: -2,
          duration: 50,
          ease: 'Cubic.easeOut',
          yoyo: true,
          repeat: -1,
        });
      },

      onComplete: () => {
        if (!this.blinkEffect) {
          this.blinkEffect = this.scene.add.circle(
            SCREEN_HALF_W,
            SCREEN_HALF_H,
            1920,
            0xffffff,
          );
          this.blinkEffect.setVisible(false);
        }

        this.scene.tweens.add({
          targets: this.blinkEffect,
          scale: { from: 1, to: 2 },
          alpha: { from: 1, to: 0 },
          delay: 2750,
          duration: 800,
          ease: 'Cubic.easeOut',
          onStart: () => {
            shakeTween.destroy();
            this.blinkEffect.setVisible(true);
            SoundManager.getInstance().play(SoundLoadingKey.SHOP_TO_BALANCED);
            this.balanceBackground.setTexture(
              ImageLoadingKey.UI_SHOP,
              ShopFrame.BALANCED,
            );
            this.youText.setPosition(YOU_POSITION.x, YOU_POSITION.y);
            const position = this.getResultTextPosition();
            this.winResultText.setPosition(position.x, position.y);
          },
          onComplete: () => {
            this.scene.time.delayedCall(1100, () => {
              this.scene.tweens.add({
                targets: this.scaleContainer,
                alpha: 0,
                scale: 0,
                ease: Phaser.Math.Easing.Cubic.Out,
                duration: 2200,
                repeat: 0,
                onStart: () => {
                  SoundManager.getInstance().play(SoundLoadingKey.SHOP_BUY_BAD);
                },
                onComplete: () => {
                  this.scaleContainer.setVisible(false);
                  this.scene.time.delayedCall(500, () => {
                    this.scene.tweens.add({
                      targets: this.thanksForPlaying,
                      alpha: 1,
                      scale: 1,
                      ease: Phaser.Math.Easing.Cubic.Out,
                      duration: 2200,
                      repeat: 0,
                      onComplete: () => {
                        EventBus.emit(HIDE__DEFAULT_CURSOR);
                        this.scene.tweens.killAll();
                      },
                    });
                  });
                },
              });
            });
          },
        });
      },
    });
  }
}
