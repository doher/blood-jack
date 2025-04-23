import type { Blackjack } from '../../actors/blackjack/Blackjack.ts';
import { EventBus } from '../../EventBus.ts';
import type {
  Position,
  Scale,
} from '../../managers/game-object-factory/constants.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import {
  ImageLoadingKey,
  ShopFrame,
} from '../../managers/game-object-factory/imageConstants.ts';
import { SoundLoadingKey } from '../../managers/sound-manager/constants.ts';
import { SoundManager } from '../../managers/sound-manager/SoundManager.ts';
import { SCALES_COSTS } from '../../scenes/gameConstants.ts';
import { MainGame } from '../../scenes/MainGame.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../constants.ts';
import { UI_Event, UIElementName } from '../ui/constants.ts';
import type { ShopBulletsType } from './BulletsSideView.ts';
import { BulletsSideView } from './BulletsSideView.ts';
import { ShopEvent } from './constants.ts';
import { Weights } from './Weights.ts';

import Text = Phaser.GameObjects.Text;
import Sprite = Phaser.GameObjects.Sprite;
import Container = Phaser.GameObjects.Container;

const UNBALANCED_BULLETS_POSITION: Position = {
  x: -190,
  y: 35,
};

const BALANCED_BULLETS_POSITION: Position = {
  x: -190,
  y: 1,
};

const BALANCED_WEIGHTS_POSITION: Position = {
  x: 130,
  y: 15,
};

export class ScaleBalance extends Container {
  private balanceBackground: Sprite;

  private bulletPack: BulletsSideView;

  private weightPack: Weights;

  private isSelected = false;

  private baseTint = 0xffffff;

  private blinkEffect: Phaser.GameObjects.Arc;

  private textBalanced: Text;

  private positionBeforeEffect: Position;

  private scaleBeforeEffect: Scale;

  constructor(
    public scene: Phaser.Scene,
    position: Position,
    private bulletsType: ShopBulletsType[],
    private indexScaleBalance: number,
    private triggerEvent: UIElementName,
    private blackjack: Blackjack,
  ) {
    super(scene, position.x, position.y);
    this.create();
    this.saveViewParams();
    this.setupEventListeners();
  }

  private saveViewParams() {
    this.positionBeforeEffect = {
      x: this.x,
      y: this.y,
    };

    this.scaleBeforeEffect = {
      x: this.scale,
      y: this.scale,
    };
  }

  private create() {
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

    this.bulletPack = new BulletsSideView(this.scene, this.bulletsType);
    this.bulletPack.setPosition(
      UNBALANCED_BULLETS_POSITION.x,
      UNBALANCED_BULLETS_POSITION.y,
    );

    this.weightPack = new Weights(this.scene, this.indexScaleBalance);
    this.weightPack.setPosition(
      BALANCED_WEIGHTS_POSITION.x,
      BALANCED_WEIGHTS_POSITION.y,
    );

    this.weightPack.setVisible(false);

    this.textBalanced = gameObjectFactory.createText(this.scene, {
      fontSize: 150,
      position: {
        x: 0,
        y: 310,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
      text: 'BALANCED',
      color: 'green',
    });

    this.textBalanced.setAlpha(0);

    this.add([
      this.balanceBackground,
      this.bulletPack,
      this.weightPack,
      this.textBalanced,
    ]);

    const badScaleBalance = 0;
    const goodScaleBalance = 2;

    if (this.indexScaleBalance === badScaleBalance) {
      this.balanceBackground.setTint(0xcccccc);
      this.baseTint = 0xcccccc;
    }

    if (this.indexScaleBalance === goodScaleBalance) {
      this.balanceBackground.preFX?.addShine(0.5, 0.5, 6);
    }

    this.scene.add.existing(this);
  }

  private setupEventListeners() {
    EventBus.on(this.triggerEvent, this.handleSelect, this);
    EventBus.on(UIElementName.SHOP_CANCEL, this.handleDeSelect, this);
    EventBus.on(UIElementName.SHOP_SUBMIT, this.handleSubmit, this);
  }

  public reset() {
    this.textBalanced.setAlpha(0);
    this.setVisible(true);
    this.setAlpha(1);
    this.balanceBackground.setTexture(
      ImageLoadingKey.UI_SHOP,
      ShopFrame.UNBALANCED,
    );
    this.weightPack.setVisible(false);
    this.bulletPack.setPosition(
      UNBALANCED_BULLETS_POSITION.x,
      UNBALANCED_BULLETS_POSITION.y,
    );
    this.setPosition(this.positionBeforeEffect.x, this.positionBeforeEffect.y);
    this.setScale(this.scaleBeforeEffect.x, this.scaleBeforeEffect.y);
  }

  private handleSelect() {
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.SHOP_BUY_BAD);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.SHOP_BUY_SO_SO);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.SHOP_BUY_GOOD);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.SHOP_BACK);

    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.SHOP_CANCEL);

    if (
      this.blackjack.playerBalance.value >=
      SCALES_COSTS[MainGame.currentRoundIndex][this.indexScaleBalance]
    ) {
      EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.SHOP_SUBMIT);
    }

    this.scene.tweens.add({
      targets: this,
      scale: 1.1,
      ease: Phaser.Math.Easing.Expo.Out,
      duration: 1000,
    });

    this.isSelected = true;
  }

  private handleDeSelect() {
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.SHOP_CANCEL);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.SHOP_SUBMIT);

    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.SHOP_BACK);
    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.SHOP_BUY_BAD);
    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.SHOP_BUY_SO_SO);
    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.SHOP_BUY_GOOD);

    this.balanceBackground.setTint(this.baseTint);

    this.scene.tweens.add({
      targets: this,
      scale: this.scaleBeforeEffect.x,
      ease: Phaser.Math.Easing.Expo.Out,
      duration: 1000,
    });

    this.isSelected = false;
  }

  private handleSubmit() {
    if (this.isSelected) {
      this.isSelected = false;

      EventBus.emit(
        UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.SHOP_CANCEL,
        true,
      );

      EventBus.emit(
        UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.SHOP_SUBMIT,
        true,
      );

      EventBus.emit(
        UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.SHOP_BULLET_INFO,
        true,
      );
      this.scene.time.delayedCall(300, () => {
        this.congratulationsEffect();
      });

      return;
    }

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      ease: Phaser.Math.Easing.Cubic.Out,
      duration: 200,
      repeat: 0,
      onComplete: () => {
        this.setVisible(false);
      },
    });
  }

  private congratulationsEffect() {
    this.scene.tweens.chain({
      targets: this,
      tweens: [
        {
          targets: this,
          x: 0,
          y: -100,
          ease: Phaser.Math.Easing.Cubic.Out,
          duration: 2000,
          repeat: 0,
          onStart: () => {
            this.balanceBackground.setTint(this.baseTint);
          },
        },
        {
          targets: this,
          x: 2.5,
          ease: Phaser.Math.Easing.Linear,
          duration: 100,
          yoyo: true,
          repeat: -1,
          onStart: () => {
            this.scene.tweens.add({
              targets: this,
              scale: 1.7,
              ease: Phaser.Math.Easing.Cubic.Out,
              duration: 2200,
              repeat: 0,
              onComplete: () => {
                this.completeCongratulations();
              },
            });
          },
        },
      ],
    });
  }

  private completeCongratulations() {
    this.scene.time.delayedCall(500, () => {
      this.scene.tweens.killTweensOf(this);
      this.scene.time.delayedCall(300, () => {
        this.showWeights();
      });
    });
  }

  private showWeights() {
    if (!this.blinkEffect) {
      this.blinkEffect = this.scene.add.circle(
        SCREEN_HALF_W,
        SCREEN_HALF_H,
        1920,
        0xffffff,
      );
    }

    this.scene.tweens.add({
      targets: this.blinkEffect,
      scale: { from: 1, to: 2 },
      alpha: { from: 1, to: 0 },
      duration: 800,
      ease: 'Cubic.easeOut',
      onStart: () => {
        SoundManager.getInstance().play(SoundLoadingKey.SHOP_TO_BALANCED);
        this.balanceBackground.setTexture(
          ImageLoadingKey.UI_SHOP,
          ShopFrame.BALANCED,
        );
        this.weightPack.setVisible(true);
        this.bulletPack.setPosition(
          BALANCED_BULLETS_POSITION.x,
          BALANCED_BULLETS_POSITION.y,
        );
      },
      onComplete: () => {
        this.scene.tweens.add({
          targets: this.textBalanced,
          alpha: 1,
          ease: Phaser.Math.Easing.Cubic.Out,
          duration: 2200,
          repeat: 0,
          onStart: () => {
            SoundManager.getInstance().play(SoundLoadingKey.SHOP_BALANCE_TEXT);
          },
          onComplete: () => {
            this.scene.time.delayedCall(500, () => {
              this.resetShop();
            });
          },
        });
      },
    });
  }

  private resetShop() {
    const dealerBalance = this.blackjack.dealerBalance;
    const round = MainGame.currentRoundIndex;
    const currentPrices = SCALES_COSTS[round];

    let maxAffordableIndex = -1;
    let maxAffordablePrice = -Infinity;

    currentPrices.forEach((price, index) => {
      if (price <= dealerBalance.value && price > maxAffordablePrice) {
        maxAffordablePrice = price;
        maxAffordableIndex = index;
      }
    });

    console.log('maxAffordableIndex = ' + maxAffordableIndex); // Индекс самой большой доступной цены

    EventBus.emit(
      ShopEvent.SET_NEXT_ROUND,
      this.indexScaleBalance,
      maxAffordableIndex,
    );
  }
}
