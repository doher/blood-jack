import type { Scene } from 'phaser';
import { EventBus } from '../../EventBus.ts';
import type { AnimationPlayingKey } from '../../managers/animation-manager/AnimationManager.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../../views/constants.ts';
import { MessageEvents } from '../../views/message/constants.ts';
import { MessageView } from '../../views/message/MessageView.ts';
import type { MonsterAnimation } from '../../views/monster/constants.ts';
import { Monster } from '../../views/monster/Monster.ts';
import { DealerEvents } from './constants.ts';
import { VoiceSystem } from './VoiceSystem.ts';

export class Dealer implements MonsterAnimation {
  public view: Monster;

  public message: MessageView;

  public voiceSystem: VoiceSystem;

  constructor(private scene: Scene) {
    this.createGameObjects();
    this.initializeManagers();
    this.setupEventListeners();
  }

  private createGameObjects() {
    this.view = new Monster(this.scene, {
      x: SCREEN_HALF_W + 15,
      y: SCREEN_HALF_H,
    });
    this.scene.add.existing(this.view);

    this.message = new MessageView(this.scene, {
      x: SCREEN_HALF_W,
      y: SCREEN_HALF_H,
    });
    this.scene.add.existing(this.message);
  }

  private initializeManagers() {
    this.voiceSystem = VoiceSystem.getInstance();
  }

  private setupEventListeners() {
    EventBus.on(DealerEvents.SMILE, this.smile, this);
    EventBus.on(DealerEvents.SAD, this.sad, this);
    EventBus.on(DealerEvents.EAR_DANCING, this.earDancing, this);
    EventBus.on(DealerEvents.TALK_JUST_ANIMATION, this.talk, this);
    EventBus.on(DealerEvents.TALK_WITH_TEXT, this.talkText, this);
    EventBus.on(
      MessageEvents.COMPLETE_TALK,
      this.handleCompleteTalkingText,
      this,
    );
    EventBus.on(DealerEvents.GO_TO_IDLE, this.tryToGoIdle, this);
  }

  private handleCompleteTalkingText() {
    this.view.onTalkingState = false;
    this.tryToGoIdle();
  }

  private tryToGoIdle() {
    if (this.view.onTalkingState) {
      return;
    }
    this.earDancing(-1);
  }

  public handlePlayerCursor() {
    this.view.monsterEye.handlePlayerCursor();
  }

  public smile(): void {
    this.view.smile();
  }

  public sad(): void {
    this.view.sad();
  }

  public earDancing(countTimes: number | undefined): void {
    this.view.earDancing(countTimes);
  }

  public talk(
    animKey:
      | AnimationPlayingKey.DEALER_TALK_PLAY
      | AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
    countTimes: number | undefined,
  ): void {
    this.view.talk(animKey, countTimes);
  }

  public talkText(
    texts: string[],
    animTypeToTalkKey:
      | AnimationPlayingKey.DEALER_TALK_PLAY
      | AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
  ) {
    if (this.view.onTalkingState) {
      return;
    }

    this.view.onTalkingState = true;
    this.message.startType(texts, animTypeToTalkKey);
  }
}
