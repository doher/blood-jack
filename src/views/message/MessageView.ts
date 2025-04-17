import { DealerEvents } from '../../actors/dealer/constants.ts';
import { VoiceSystem } from '../../actors/dealer/VoiceSystem.ts';
import { EventBus } from '../../EventBus.ts';
import { AnimationPlayingKey } from '../../managers/animation-manager/AnimationManager.ts';
import type { Position } from '../../managers/game-object-factory/constants.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import { ImageLoadingKey } from '../../managers/game-object-factory/imageConstants.ts';
import type { Message } from './constants.ts';
import { MessageEvents } from './constants.ts';

import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;

const START_POSITION: Position = {
  x: 330,
  y: -350,
};

const DEFAULT_TALK_SPEED = 80;
const ANGRY_TALK_SPEED = 60;

const DEFAULT_TALK_DIVIDER = 14;
const ANGRY_TALK_DIVIDER = 15;

const DELAY_BEFORE_TALK_ANIMATION = 500;
const DELAY_BEFORE_NEXT_TEXT = 1110;

export class MessageView extends Container implements Message {
  public textField: Phaser.GameObjects.Text;

  public background: Sprite;

  constructor(
    public scene: Phaser.Scene,
    position: Position,
  ) {
    super(scene, position.x, position.y);
    this.createGameObjects();
  }

  private createGameObjects() {
    this.background = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.MESSAGE,
      position: START_POSITION,
      origin: {
        x: 0.5,
        y: 0.5,
      },
      scale: {
        x: 0.6,
        y: 0.4,
      },
    });

    this.textField = gameObjectFactory.createText(this.scene, {
      position: {
        x: START_POSITION.x,
        y: START_POSITION.y - 100,
      },
      fontSize: 27,
      origin: {
        x: 0.5,
        y: 0,
      },
      maxLines: 4,
    });

    this.textField.setWordWrapWidth(350, false);

    this.setAlpha(0);
    this.add([this.background, this.textField]);
  }

  public startType(
    texts: string[],
    animTypeToTalkKey:
      | AnimationPlayingKey.DEALER_TALK_PLAY
      | AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
  ): void {
    const textToType = texts.shift();

    if (!textToType) {
      EventBus.emit(MessageEvents.COMPLETE_TALK);
      return;
    }

    this.showBackground();
    EventBus.emit(MessageEvents.START_TALK);
    this.scene.time.delayedCall(DELAY_BEFORE_TALK_ANIMATION, () => {
      VoiceSystem.getInstance().say(textToType, animTypeToTalkKey);

      EventBus.emit(
        DealerEvents.TALK_JUST_ANIMATION,
        AnimationPlayingKey.DEALER_TALK_PLAY,
        this.calcTalkAnimationCountRun(textToType, animTypeToTalkKey),
      );
    });

    this.textToAnimation(textToType, texts, animTypeToTalkKey);
  }

  private textToAnimation(
    textToType: string,
    texts: string[],
    animTypeToTalkKey:
      | AnimationPlayingKey.DEALER_TALK_PLAY
      | AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
  ) {
    const speed = this.getTalkSpeed(animTypeToTalkKey);

    this.textField.setText('');
    let currentLetterIndex = 0;
    this.scene.time.addEvent({
      delay: speed,
      repeat: textToType.length - 1,
      callback: () => {
        this.textField.setText(textToType.substring(0, currentLetterIndex + 1));
        currentLetterIndex++;
        if (currentLetterIndex === textToType.length) {
          this.scene.time.delayedCall(DELAY_BEFORE_NEXT_TEXT, () => {
            this.hideBackground(texts, animTypeToTalkKey);
          });
        }
      },
    });
  }

  private calcTalkAnimationCountRun(
    text: string,
    animTypeToTalkKey:
      | AnimationPlayingKey.DEALER_TALK_PLAY
      | AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
  ) {
    const divider =
      animTypeToTalkKey === AnimationPlayingKey.DEALER_TALK_PLAY
        ? DEFAULT_TALK_DIVIDER
        : ANGRY_TALK_DIVIDER;
    const textLength = text.length / divider;
    return Math.round(textLength);
  }

  private getTalkSpeed(
    animTypeToTalkKey:
      | AnimationPlayingKey.DEALER_TALK_PLAY
      | AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
  ) {
    return animTypeToTalkKey === AnimationPlayingKey.DEALER_TALK_PLAY
      ? DEFAULT_TALK_SPEED
      : ANGRY_TALK_SPEED;
  }

  private showBackground() {
    this.scene.tweens.add({
      targets: this,
      delay: 300,
      alpha: 1,
      scale: {
        from: 0.5,
        to: 1,
      },
      ease: Phaser.Math.Easing.Cubic.Out,
    });
  }

  private hideBackground(
    texts: string[],
    animTypeToTalkKey:
      | AnimationPlayingKey.DEALER_TALK_PLAY
      | AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
  ) {
    this.scene.tweens.add({
      targets: this,
      delay: 1,
      alpha: 0,
      scale: {
        from: 1,
        to: 0.5,
      },
      ease: Phaser.Math.Easing.Cubic.In,
      onComplete: () => {
        this.startType(texts, animTypeToTalkKey);
      },
    });
  }
}
