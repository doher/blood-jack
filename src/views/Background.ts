import Container = Phaser.GameObjects.Container;
import { gameObjectFactory } from '../managers/game-object-factory/GameObjectFactory.ts';
import { AnimationLoadingKey } from '../managers/animation-manager/constants.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from './constants.ts';
import Sprite = Phaser.GameObjects.Sprite;
import { AnimationPlayingKey } from '../managers/animation-manager/AnimationManager.ts';
import ANIMATION_COMPLETE_KEY = Phaser.Animations.Events.ANIMATION_COMPLETE_KEY;
import { EventBus } from '../EventBus.ts';
import { DealerEvents } from '../actors/dealer/constants.ts';

export class Background extends Container {
  private interactZone: Phaser.GameObjects.Arc;

  private background: Sprite;

  private isPlaying = false;

  constructor(private scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.create();
    this.setupEventListeners();
    this.scene.add.existing(this);
  }

  private create() {
    this.interactZone = this.scene.add.circle(500, 240, 175, 0x3498db, 0);

    this.background = gameObjectFactory.createSprite(this.scene, {
      key: AnimationLoadingKey.BACKGROUND_JAIL,
      position: {
        x: SCREEN_HALF_W,
        y: SCREEN_HALF_H,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });

    this.add([this.background, this.interactZone]);
  }

  private setupEventListeners() {
    this.interactZone.setInteractive();

    this.background.on(
      ANIMATION_COMPLETE_KEY + AnimationPlayingKey.BACKGROUND_JAIL_PLAY,
      () => {
        this.isPlaying = false;
      },
    );

    this.interactZone.on('pointerdown', () => {
      if (this.isPlaying) {
        return;
      }
      EventBus.emit(DealerEvents.SMILE);
      // this.scene.time.delayedCall(3000, () => {
      //   EventBus.emit(
      //     DealerEvents.TALK_WITH_TEXT,
      //     ['Zero Chance To Leave'],
      //     AnimationPlayingKey.DEALER_TALK_PLAY,
      //   );
      // });

      this.background.play(AnimationPlayingKey.BACKGROUND_JAIL_PLAY);
      this.isPlaying = true;
    });
  }
}
