import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;
import { RouletteBulletsType } from '../../actors/roulette/RouletteUI.ts';
import { DataKey, RevolverCylinder } from './RevolverCylinder.ts';
import { Position } from '../../managers/game-object-factory/constants.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../constants.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import {
  ImageLoadingKey,
  UiControlsFrame,
} from '../../managers/game-object-factory/imageConstants.ts';
import { Shadow, SHADOW_TAG } from '../Shadow.ts';
import { EventBus } from '../../EventBus.ts';
import { RouletteEvent } from './constants.ts';
import { Button, LOW_CLICK_SPEED } from '../ui/button/Button.ts';
import { UI_Event, UIElementName } from '../ui/constants.ts';
import { SoundLoadingKey } from '../../managers/sound-manager/constants.ts';
import type { Blackjack } from '../../actors/blackjack/Blackjack.ts';
import { ShootChance } from './ShootChance.ts';
import { DragBullet } from './DragBullet.ts';
import { SwitchRoundTypeShadow } from './SwitchRoundTypeShadow.ts';
import { EndGame } from './EndGame.ts';

const DRUM_POSITION: Position = {
  x: 0,
  y: -100,
};

export const enum TurnType {
  PLAYER = 'YOU',
  DEALER = 'DEALER',
}

const DEATH_STOPS = [-158, -209, -260, -313, -3, -55, -107];

export class RouletteView extends Container {
  public revolverCylinder: RevolverCylinder;

  private fullLoadedRumMessage: Phaser.GameObjects.Text;

  private shootButton: Button;

  private shadow: Shadow;

  private shootChance: ShootChance;

  private currentMainRound = -1;

  private currentPlayerRound = -1;

  private currentDealerRound = -1;

  private currentStopBullet: RouletteBulletsType;

  private currentTurnType: TurnType;

  private switchRoundTypeShadow: SwitchRoundTypeShadow;

  private dealerLastAngleRotation = 0;

  private playerLastAngleRotation = 0;

  private endGame: EndGame;

  constructor(
    private scene: Phaser.Scene,
    private blackjack: Blackjack,
  ) {
    super(scene, SCREEN_HALF_W, SCREEN_HALF_H);
    this.create();
    this.setupEventListeners();
  }

  private create() {
    this.createBackground();

    this.shadow = new Shadow(this.scene, 0.65);
    this.shadow.setAlpha(0);

    this.switchRoundTypeShadow = new SwitchRoundTypeShadow(this.scene);

    this.revolverCylinder = new RevolverCylinder(this.scene, DRUM_POSITION);

    this.shootChance = new ShootChance(this.scene, this.blackjack);
    this.shootChance.setAlpha(0);

    this.fullLoadedRumMessage = gameObjectFactory.createText(this.scene, {
      position: {
        x: 0,
        y: 0,
      },
      color: 'red',
      fontSize: 120,
      origin: {
        x: 0.5,
        y: 0.5,
      },
      text: 'NOW... RUSSIAN ROULETTE',
    });

    this.fullLoadedRumMessage.setAlpha(0);

    this.shootButton = new Button(
      this.scene,
      { x: 0, y: 400 },
      UiControlsFrame.RED_BUTTON,
      {
        x: 1.7,
        y: 1.5,
      },
      UIElementName.ROULETTE_SHOOT,
      {
        text: 'SPIN!',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 70,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'red',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.ALL_IN,
    );

    this.shootButton.handleDisable(true);

    this.add([
      this.shadow,
      this.revolverCylinder,
      this.shootChance,
      this.fullLoadedRumMessage,
      this.shootButton,
      this.switchRoundTypeShadow,
    ]);

    this.scene.add.existing(this);
  }

  private setupEventListeners() {
    EventBus.on(
      RouletteEvent.FULL_DRUM_LOADED,
      this.showFullLoadedDrumScreen,
      this,
    );

    EventBus.on(UIElementName.ROULETTE_SHOOT, this.handleSpinButton, this);

    EventBus.on(RouletteEvent.SHOOT, this.handleShoot, this);

    EventBus.on(
      RouletteEvent.START_TURN_ + TurnType.DEALER,
      this.startDealerTurn,
      this,
    );

    EventBus.on(
      RouletteEvent.START_TURN_ + TurnType.PLAYER,
      this.startPlayerTurn,
      this,
    );
  }

  private startNextTurn() {
    if (this.currentTurnType === TurnType.DEALER) {
      this.switchRoundTypeShadow.showTurn(
        TurnType.PLAYER,
        () => this.startPlayerTurn(),
        () =>
          this.revolverCylinder.showPlayerCylinder(
            this.playerLastAngleRotation,
          ),
      );
      return;
    }
    this.switchRoundTypeShadow.showTurn(
      TurnType.DEALER,
      () => this.startDealerTurn(),
      () =>
        this.revolverCylinder.showDealerCylinder(this.dealerLastAngleRotation),
    );
  }

  private startDealerTurn() {
    this.revolverCylinder.drumBackground.disableInteractive();

    this.currentTurnType = TurnType.DEALER;
    this.changeMainRoundCounter();
    this.currentDealerRound += 1;

    this.scene.time.delayedCall(1000, () => {
      this.handleSpinButton();
    });
  }

  private startPlayerTurn() {
    this.currentTurnType = TurnType.PLAYER;
    this.revolverCylinder.drumBackground.setInteractive();
    this.changeMainRoundCounter();
    this.currentPlayerRound += 1;
  }

  private handleSpinButton() {
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.ROULETTE_SHOOT);

    const availableBulletsType: RouletteBulletsType[] = [];

    const dragBullets = this.revolverCylinder.dragBullets;

    dragBullets.forEach((dragBullet) => {
      const bulletType = this.getBulletTypeFroMData(dragBullet.sprite);
      availableBulletsType.push(bulletType);
    });

    const targetBulletType =
      this.getBulletTypeToRevolverCylinderStop(availableBulletsType);

    console.log('targetBulletType = ' + targetBulletType);

    this.currentStopBullet = targetBulletType;

    const stopAngle = this.getBulletAngleStop(dragBullets, targetBulletType);

    console.log('stopAngle = ' + stopAngle);

    this.revolverCylinder.startShootRotation(stopAngle);
  }

  private getBulletAngleStop(
    dragBullets: DragBullet[],
    targetBulletType: RouletteBulletsType,
  ) {
    const targetBullets: DragBullet[] = [];

    dragBullets.forEach((dragBullet) => {
      const bulletType = this.getBulletTypeFroMData(dragBullet.sprite);
      if (bulletType === targetBulletType) {
        targetBullets.push(dragBullet);
      }
    });

    const randomDragBulletIndex = Phaser.Math.Between(
      0,
      targetBullets.length - 1,
    );

    const targetBullet = targetBullets[randomDragBulletIndex];
    const bulletIndex = targetBullet.sprite.getData(DataKey.LOADED_TO);
    return DEATH_STOPS[bulletIndex];
  }

  private getBulletTypeFroMData(targetSprite: Sprite) {
    const dataKey =
      this.currentTurnType === TurnType.PLAYER
        ? DataKey.TYPE
        : DataKey.DEALER_TYPE;
    return targetSprite.getData(dataKey);
  }

  private changeMainRoundCounter() {
    this.currentMainRound += 1;

    if (this.currentTurnType === TurnType.DEALER) {
      this.revolverCylinder.showDealerCylinder(this.dealerLastAngleRotation);
    } else {
      this.revolverCylinder.showPlayerCylinder(this.playerLastAngleRotation);
    }

    if (this.shootChance.visible) {
      this.scene.tweens.add({
        targets: this.shootChance,
        alpha: 0,
        duration: 700,
        delay: 250,
        ease: Phaser.Math.Easing.Linear,
        onComplete: () => {
          this.shootChance.setVisible(false);
          this.revolverCylinder.drumBackground.disableInteractive();
          this.showRevolverCylinder();
        },
      });
    }
  }

  private showRevolverCylinder() {
    this.scene.tweens.add({
      targets: this.revolverCylinder,
      alpha: 1,
      duration: 300,
      delay: 250,
      ease: Phaser.Math.Easing.Linear,
      onComplete: () => {
        if (this.currentTurnType === TurnType.PLAYER) {
          EventBus.emit(
            UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.ROULETTE_SHOOT,
          );
        }
      },
    });
  }

  private handleShoot() {
    if (this.currentTurnType === TurnType.DEALER) {
      this.dealerLastAngleRotation =
        this.revolverCylinder.readyRevolverCylinderHolder.angle;
    } else {
      this.playerLastAngleRotation =
        this.revolverCylinder.readyRevolverCylinderHolder.angle;
    }

    if (this.currentStopBullet === RouletteBulletsType.RED) {
      this.shootLive();
      return;
    }

    if (this.currentStopBullet === RouletteBulletsType.YELLOW) {
      const blankChance = Phaser.Math.Between(0, 1);
      if (blankChance === 1) {
        this.shootLive();
        return;
      }
      this.shootBlank();
      return;
    }

    if (this.currentStopBullet === RouletteBulletsType.GREEN) {
      this.shootBlank();
    }
  }

  private shootLive() {
    /// TODO Shoot sound

    this.endGame = new EndGame(this.scene, this.currentTurnType);
    this.add(this.endGame);
    this.scene.time.delayedCall(1000, () => {
      this.endGame.showEndGame();
    });
  }

  private shootBlank() {
    this.startNextTurn();
  }

  private getBulletTypeToRevolverCylinderStop(
    availableBulletsType: RouletteBulletsType[],
  ) {
    const currentRound =
      this.currentTurnType === TurnType.PLAYER
        ? this.currentPlayerRound
        : this.currentDealerRound;

    const isFirstRound = currentRound === 0;

    return isFirstRound
      ? this.getBulletsForFirstRound(availableBulletsType)
      : this.getRandomBullet(availableBulletsType);
  }

  private getRandomBullet(availableBulletsType: RouletteBulletsType[]) {
    const types = [
      RouletteBulletsType.RED,
      RouletteBulletsType.GREEN,
      RouletteBulletsType.YELLOW,
    ];
    const random = Phaser.Math.Between(0, 2);
    const bulletType = types[random];
    if (availableBulletsType.includes(bulletType)) {
      return bulletType;
    }
    return this.getRandomBullet(availableBulletsType);
  }

  private getBulletsForFirstRound(availableBulletsType: RouletteBulletsType[]) {
    const greenBullet = RouletteBulletsType.GREEN;
    const yellowBullet = RouletteBulletsType.YELLOW;

    for (
      let bulletIndex = 0;
      bulletIndex < availableBulletsType.length;
      bulletIndex += 1
    ) {
      const bulletType = availableBulletsType[bulletIndex];
      if (bulletType === greenBullet) {
        return greenBullet;
      }
    }

    return yellowBullet;
  }

  private showFullLoadedDrumScreen() {
    this.scene.tweens.chain({
      tweens: [
        {
          delay: 10,
          targets: this.revolverCylinder,
          alpha: 0,
          duration: 1500,
          ease: Phaser.Math.Easing.Cubic.InOut,
        },
        {
          delay: 500,
          targets: this.fullLoadedRumMessage,
          alpha: 1,
          duration: 1500,
          ease: Phaser.Math.Easing.Cubic.In,
        },
        {
          delay: 1500,
          targets: this.fullLoadedRumMessage,
          alpha: 0,
          duration: 1500,
          ease: Phaser.Math.Easing.Cubic.Out,
          onComplete: () => {
            this.showRussianRouletteScreen();
          },
        },
      ],
    });
  }

  private showRussianRouletteScreen() {
    this.scene.tweens.add({
      targets: this.shadow,
      delay: 200,
      alpha: 1,
      duration: 1000,
      ease: Phaser.Math.Easing.Cubic.In,
      onComplete: () => {
        this.scene.tweens.add({
          targets: this.shootChance,
          delay: 200,
          alpha: 1,
          duration: 1000,
          ease: Phaser.Math.Easing.Cubic.In,
          onComplete: () => {
            this.shootChance.showResult();
          },
        });
      },
    });
  }

  private createBackground() {
    const background = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.SHOP_BACKGROUND,
      position: {
        x: 0,
        y: 0,
      },
      scale: {
        x: 1,
        y: 1.08,
      },
    });
    background.setTint(0xcccccc);
    background.setInteractive();
    background.setName(SHADOW_TAG);
    this.add(background);
  }

  public show(
    playerBulletsFrames: RouletteBulletsType[],
    dealerBulletsFrames: RouletteBulletsType[],
  ) {
    this.revolverCylinder.showPlayerBullets(
      playerBulletsFrames,
      dealerBulletsFrames,
    );
  }
}
