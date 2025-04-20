import Container = Phaser.GameObjects.Container;
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
import { Button, LOW_CLICK_SPEED } from '../ui/button/button.ts';
import { UI_Event, UIElementName } from '../ui/constants.ts';
import { SoundLoadingKey } from '../../managers/sound-manager/constants.ts';
import type { Blackjack } from '../../actors/blackjack/Blackjack.ts';
import { ShootChance } from './ShootChance.ts';
import { DragBullet } from './DragBullet.ts';

const DRUM_POSITION: Position = {
  x: 0,
  y: -150,
};

export const enum TurnType {
  PLAYER = 'PLAYER',
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

  private playerBulletsFrames: RouletteBulletsType[];

  private dealerBulletsFrames: RouletteBulletsType[];

  constructor(
    private scene: Phaser.Scene,
    private blackjack: Blackjack,
  ) {
    super(scene, SCREEN_HALF_W, SCREEN_HALF_H);
    this.create();
    this.setupEventListeners();
    // this.showFullLoadedDrumScreen();
  }

  private create() {
    this.createBackground();

    this.shadow = new Shadow(this.scene, 0.65);
    this.shadow.setAlpha(0);

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
      { x: 0, y: 375 },
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

    this.shootButton.handleButtonDisable(true);

    this.add([
      this.shadow,
      this.revolverCylinder,
      this.shootChance,
      this.fullLoadedRumMessage,
      this.shootButton,
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
      this.startPlayerTurn();
      return;
    }
    this.startDealerTurn();
  }

  private startDealerTurn() {
    this.changeMainRoundCounter();
    this.currentTurnType = TurnType.DEALER;
    this.currentDealerRound += 1;
    this.scene.time.delayedCall(1000, () => {
      this.handleSpinButton();
    });
  }

  private startPlayerTurn() {
    this.changeMainRoundCounter();
    this.currentTurnType = TurnType.PLAYER;

    this.showRevolverCylinder();
    this.currentPlayerRound += 1;
  }

  private handleSpinButton() {
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.ROULETTE_SHOOT);

    const availableBulletsType: RouletteBulletsType[] = [];

    const dragBullets = this.revolverCylinder.dragBullets;

    dragBullets.forEach((dragBullet) => {
      const bulletType = dragBullet.sprite.getData(DataKey.TYPE);
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
    let stopAngle = 0;

    for (
      let bulletIndex = 0;
      bulletIndex < dragBullets.length;
      bulletIndex += 1
    ) {
      const dragBullet = dragBullets[bulletIndex];
      const bulletType = dragBullet.sprite.getData(DataKey.TYPE);

      if (bulletType === targetBulletType) {
        const bulletIndex = dragBullet.sprite.getData(DataKey.LOADED_TO);
        stopAngle = DEATH_STOPS[bulletIndex];
        console.log(stopAngle);
        return DEATH_STOPS[bulletIndex];
      }
    }

    return stopAngle;
  }

  private changeMainRoundCounter() {
    this.currentMainRound += 1;
    this.revolverCylinder.readyRevolverCylinderHolder.angle = -3;
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
        EventBus.emit(
          UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.ROULETTE_SHOOT,
        );
      },
    });
  }

  private handleShoot() {
    console.log('handleShoot');

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
    // complete game
    console.log(this.currentTurnType + 'DEAD');
  }

  private shootBlank() {
    console.log('BLANK');
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
    console.log('IS FIRST ROUND = ', isFirstRound);

    let findBullet = isFirstRound
      ? this.getBulletsForFirstRound(availableBulletsType)
      : RouletteBulletsType.RED; /// TODO not red but full random

    return findBullet;
  }

  /// TODO fore first round return GREEN OR YELLOW
  private getBulletsForFirstRound(availableBulletsType: RouletteBulletsType[]) {
    const greenBullet = RouletteBulletsType.GREEN;
    const yellowBullet = RouletteBulletsType.GREEN;

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
    this.playerBulletsFrames = playerBulletsFrames;
    this.dealerBulletsFrames = dealerBulletsFrames;
    this.revolverCylinder.showPlayerBullets(playerBulletsFrames);
  }
}
