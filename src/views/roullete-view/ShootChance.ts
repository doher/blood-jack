import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import Container = Phaser.GameObjects.Container;
import { Blackjack } from '../../actors/blackjack/Blackjack.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../constants.ts';
import { TurnType } from './RouletteView.ts';
import { EventBus } from '../../EventBus.ts';
import { RouletteEvent } from './constants.ts';

export class ShootChance extends Container {
  private playerChance: Phaser.GameObjects.Text;

  private dealerChance: Phaser.GameObjects.Text;

  private blinkEffect: Phaser.GameObjects.Arc;

  private resultText: Phaser.GameObjects.Text;

  constructor(
    private scene: Phaser.Scene,
    private blackjack: Blackjack,
  ) {
    super(scene, 0, 0);
    this.create();
  }

  private create() {
    this.playerChance = gameObjectFactory.createText(this.scene, {
      position: {
        x: 0,
        y: 300,
      },
      color: 'red',
      fontSize: 75,
      origin: {
        x: 0.5,
        y: 0.5,
      },
      text: 'Your Chance To Shoot First: ',
    });

    this.resultText = gameObjectFactory.createText(this.scene, {
      position: {
        x: 0,
        y: 50,
      },
      color: 'red',
      fontSize: 100,
      origin: {
        x: 0.5,
        y: 0.5,
      },
      text: 'Shoots first: ',
    });
    this.resultText.setAlpha(0);

    this.dealerChance = gameObjectFactory.createText(this.scene, {
      position: {
        x: 0,
        y: -300,
      },
      color: 'red',
      fontSize: 75,
      origin: {
        x: 0.5,
        y: 0.5,
      },
      text: 'Dealer Chance To Shoot First: ',
    });

    this.add([this.playerChance, this.dealerChance, this.resultText]);
  }

  public showResult() {
    const playerScore = this.blackjack.playerBalance;
    const dealerScore = this.blackjack.dealerBalance;

    const maxScore = playerScore.value + dealerScore.value;

    const playerChance = (1 - playerScore.value / maxScore) * 100;
    const dealerChance = (1 - playerScore.value / maxScore) * 100;
    this.showEffect(playerChance, dealerChance);
  }

  private showEffect(playerChance: number, dealerChance: number) {
    if (!this.blinkEffect) {
      this.blinkEffect = this.scene.add.circle(
        SCREEN_HALF_W,
        SCREEN_HALF_H,
        1920,
        0xffffff,
      );
      this.blinkEffect.setAlpha(0);
    }

    this.scene.tweens.add({
      delay: 1500,
      targets: this.blinkEffect,
      scale: { from: 1, to: 2 },
      alpha: { from: 1, to: 0 },
      duration: 800,
      ease: 'Cubic.easeOut',
      onStart: () => {
        this.playerChance.setText(
          `Your Chance To Shoot First: ${playerChance}%`,
        );
        this.dealerChance.setText(
          `Dealer Chance To Shoot First: ${dealerChance}%`,
        );
      },
      onComplete: () => {
        const result = this.returnFirstTurn(playerChance, dealerChance);
        this.resultText.text = `Shoots first: ${result}`;
        this.scene.tweens.add({
          targets: this.resultText,
          alpha: 1,
          duration: 700,
          delay: 250,
          ease: Phaser.Math.Easing.Linear,
          onComplete: () => {
            this.scene.time.delayedCall(1500, () => {
              EventBus.emit(RouletteEvent.START_TURN_ + result);
            });
          },
        });
      },
    });
  }

  private returnFirstTurn(playerChance: number, dealerChance: number) {
    if (playerChance === 0) {
      return TurnType.DEALER;
    }

    if (dealerChance === 0) {
      return TurnType.PLAYER;
    }

    const total = playerChance + dealerChance;
    const playerChanceToPlayFirst = playerChance / total;

    return TurnType.PLAYER;

    // return Math.random() < playerChanceToPlayFirst
    //   ? TurnType.PLAYER
    //   : TurnType.DEALER;
  }
}
