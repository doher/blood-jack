import Container = Phaser.GameObjects.Container;
import { Position } from '../../managers/game-object-factory/constants.ts';
import Sprite = Phaser.GameObjects.Sprite;
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import { AnimationLoadingKey } from '../../managers/animation-manager/constants.ts';
import { MonsterEye } from './MonsterEye.ts';
import { MonsterAnimation, MonsterObjectsId } from './constants.ts';
import { AnimationPlayingKey } from '../../managers/animation-manager/AnimationManager.ts';
import ANIMATION_COMPLETE_KEY = Phaser.Animations.Events.ANIMATION_COMPLETE_KEY;
import { EventBus } from '../../EventBus.ts';
import { DealerEvents } from '../../actors/dealer/constants.ts';

export class Monster extends Container implements MonsterAnimation {
  private gameObjectsMap = new Map<string, Phaser.GameObjects.GameObject>();

  private monsterBody: Sprite;

  public monsterEye: MonsterEye;

  constructor(
    public scene: Phaser.Scene,
    position: Position,
  ) {
    super(scene, position.x, position.y);
    this.createGameObjects();
  }

  private createGameObjects() {
    this.monsterBody = gameObjectFactory.createSprite(this.scene, {
      key: AnimationLoadingKey.DEALER_TALK,
      position: {
        x: 0,
        y: 0,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });
    this.gameObjectsMap.set(MonsterObjectsId.BODY, this.monsterBody);

    this.monsterEye = new MonsterEye(this.scene, { x: -5, y: -210 });
    this.monsterEye.setScale(0.94, 0.94);
    this.gameObjectsMap.set(MonsterObjectsId.EYE_CONTAINER, this.monsterEye);
    this.rotation = -0.05;

    this.add([this.monsterBody, this.monsterEye]);
  }

  public smile() {
    this.monsterBody.once(
      ANIMATION_COMPLETE_KEY + AnimationPlayingKey.DEALER_SMILE_PLAY,
      () => {
        this.scene.tweens.add({
          targets: this.monsterBody,
          x: {
            from: this.monsterBody.x,
            to: this.monsterBody.x + Phaser.Math.Between(-2, 2),
          },
          y: {
            from: this.monsterBody.y,
            to: this.monsterBody.y + 2,
          },
          duration: 50,
          yoyo: true,
          repeat: -1,
          ease: Phaser.Math.Easing.Linear,
        });
        this.scene.time.delayedCall(1500, () => {
          this.scene.tweens.killTweensOf(this.monsterBody);

          this.monsterBody.once(
            ANIMATION_COMPLETE_KEY + AnimationPlayingKey.DEALER_SMILE_PLAY,
            () => {
              EventBus.emit(DealerEvents.GO_TO_IDLE);
            },
          );

          this.monsterBody.playReverse(AnimationPlayingKey.DEALER_SMILE_PLAY);
        });
      },
    );

    this.monsterBody.play(AnimationPlayingKey.DEALER_SMILE_PLAY);
  }

  public sad() {
    this.monsterBody.once(
      ANIMATION_COMPLETE_KEY + AnimationPlayingKey.DEALER_SAD_PLAY,
      () => {
        this.scene.tweens.killTweensOf(this.monsterEye);
        this.scene.tweens.add({
          targets: this.monsterBody,
          x: {
            from: this.monsterBody.x,
            to: this.monsterBody.x + Phaser.Math.Between(-2, 2),
          },
          y: {
            from: this.monsterBody.y,
            to: this.monsterBody.y + 2,
          },
          duration: 50,
          yoyo: true,
          repeat: -1,
          ease: Phaser.Math.Easing.Linear,
        });

        this.scene.time.delayedCall(1500, () => {
          this.scene.tweens.killTweensOf(this.monsterBody);
          const tweenLeft = this.scene.tweens.add({
            targets: this.monsterEye,
            x: {
              from: this.monsterEye.x,
              to: this.monsterEye.x + 20,
            },
            duration: 350,
            onComplete: () => {
              this.scene.tweens.add({
                targets: this.monsterEye,
                x: {
                  from: this.monsterEye.x,
                  to: this.monsterEye.x - 20,
                },
                duration: 350,
                ease: Phaser.Math.Easing.Linear,
                onComplete: () => {
                  tweenLeft.restart();
                },
              });
            },
            ease: Phaser.Math.Easing.Linear,
          });

          this.monsterBody.once(
            ANIMATION_COMPLETE_KEY + AnimationPlayingKey.DEALER_SAD_PLAY,
            () => {
              this.scene.tweens.killTweensOf(this.monsterEye);
              EventBus.emit(DealerEvents.GO_TO_IDLE);
            },
          );

          this.monsterBody.playReverse(AnimationPlayingKey.DEALER_SAD_PLAY);
        });
      },
    );

    const tweenLeft = this.scene.tweens.add({
      targets: this.monsterEye,
      x: {
        from: this.monsterEye.x,
        to: this.monsterEye.x - 20,
      },
      duration: 350,
      onComplete: () => {
        this.scene.tweens.add({
          targets: this.monsterEye,
          x: {
            from: this.monsterEye.x,
            to: this.monsterEye.x + 20,
          },
          duration: 350,
          ease: Phaser.Math.Easing.Linear,
          onComplete: () => {
            tweenLeft.restart();
          },
        });
      },
      ease: Phaser.Math.Easing.Linear,
    });
    this.monsterBody.play(AnimationPlayingKey.DEALER_SAD_PLAY);
  }

  public earDancing(countTimes = 1) {
    let currentPlayingCount = 0;

    this.monsterBody.on(
      ANIMATION_COMPLETE_KEY + AnimationPlayingKey.DEALER_EAR_MOVEMENT_PLAY,
      () => {
        if (countTimes !== -1) {
          currentPlayingCount += 1;
        }
        if (currentPlayingCount === countTimes) {
          this.monsterBody.off(
            ANIMATION_COMPLETE_KEY +
              AnimationPlayingKey.DEALER_EAR_MOVEMENT_PLAY,
          );
          this.monsterBody.stop();
        } else {
          this.monsterBody.play(AnimationPlayingKey.DEALER_EAR_MOVEMENT_PLAY);
        }
      },
    );

    this.monsterBody.play(AnimationPlayingKey.DEALER_EAR_MOVEMENT_PLAY);
  }

  public talk(
    animKey:
      | AnimationPlayingKey.DEALER_TALK_PLAY
      | AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
    countTimes = 1,
  ) {
    let currentPlayingCount = 0;
    const finalY = this.monsterEye.y + 15;
    this.monsterBody.on(ANIMATION_COMPLETE_KEY + animKey, () => {
      currentPlayingCount += 1;
      if (currentPlayingCount === countTimes) {
        this.monsterBody.off(ANIMATION_COMPLETE_KEY + animKey);
        this.monsterBody.stop();
        this.scene.tweens.killTweensOf(this.monsterEye);
        this.scene.tweens.add({
          targets: this.monsterEye,
          y: {
            from: this.monsterEye.y,
            to: finalY - 15,
          },
          yoyo: false,
          repeat: 0,
          duration: 100,
          ease: Phaser.Math.Easing.Linear,
        });
        EventBus.emit(DealerEvents.GO_TO_IDLE);
      } else {
        this.monsterBody.play(animKey);
      }
    });

    this.addTalkTween(finalY, countTimes, animKey);
    this.monsterBody.play(animKey);
  }

  private addTalkTween(
    finalY: number,
    countTimes: number,
    animType:
      | AnimationPlayingKey.DEALER_TALK_PLAY
      | AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
  ) {
    const animSpeed =
      animType === AnimationPlayingKey.DEALER_TALK_PLAY ? 535 : 210;

    this.scene.tweens.add({
      targets: this.monsterEye,
      y: {
        from: this.monsterEye.y,
        to: finalY,
      },
      yoyo: true,
      repeat: countTimes,
      duration: animSpeed,
      ease: Phaser.Math.Easing.Linear,
      onComplete: () => {
        this.scene.tweens.killTweensOf(this.monsterEye);
      },
    });
  }
}
