import { EventBus } from '../../EventBus.ts';
import { AnimationPlayingKey } from '../../managers/animation-manager/AnimationManager.ts';
import { SoundLoadingKey } from '../../managers/sound-manager/constants.ts';
import { SoundManager } from '../../managers/sound-manager/SoundManager.ts';

const DEFAULT_TALK_DIVIDER = 10;
const ANGRY_TALK_DIVIDER = 10;

const ANGRY_TALK_SPEED = 1.15;

const CHANCE_BB = 0.65;
const CHANCE_PYPY = 0.3;

const CHANCE_BBB = 0.75;
const CHANCE_PYPYPYPY = 0.4;

export const enum VoiceSystemEvent {
  ALL_VOICES_IN_CHAIN_PLAYED = 'VoiceSystemEvent_ALL_VOICES_IN_CHAIN_PLAYED',
}

export class VoiceSystem {
  private static instance: VoiceSystem | null = null;

  private soundManager: SoundManager;

  private constructor() {
    this.initializeManagers();
  }

  public static getInstance(): VoiceSystem {
    if (VoiceSystem.instance) {
      return VoiceSystem.instance;
    }

    VoiceSystem.instance = new VoiceSystem();
    return VoiceSystem.instance;
  }

  private initializeManagers() {
    this.soundManager = SoundManager.getInstance();
  }

  private calcTalkVoiceCountRun(
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

  public say(
    textForEmulate: string,
    animTypeToTalkKey:
      | AnimationPlayingKey.DEALER_TALK_PLAY
      | AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
  ) {
    const voiceLongValue = this.calcTalkVoiceCountRun(
      textForEmulate,
      animTypeToTalkKey,
    );

    const voiceSpeed =
      animTypeToTalkKey == AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY
        ? ANGRY_TALK_SPEED
        : 1;

    const voiceKeys = this.generateVoiceKeysToSay(voiceLongValue);
    this.startVoices(voiceKeys, voiceSpeed);
  }

  private startVoices(voiceKeys: SoundLoadingKey[], voiceSpeed: number) {
    const voiceKey = voiceKeys.shift();

    if (!voiceKey) {
      EventBus.emit(VoiceSystemEvent.ALL_VOICES_IN_CHAIN_PLAYED);
      return;
    }

    EventBus.once(voiceKey, () => {
      this.startVoices(voiceKeys, voiceSpeed);
    });

    this.soundManager.play(voiceKey)?.rate(voiceSpeed);
  }

  private generateVoiceKeysToSay(voiceLongValue: number) {
    let voiceKeys: SoundLoadingKey[] = [];
    let lastTakeSimpleB = false;

    for (let voiceIndex = 0; voiceIndex < voiceLongValue; voiceIndex += 1) {
      const randomValue = Math.random();
      const soundKey = this.getSoundKeyFromRandom(randomValue, lastTakeSimpleB);

      if (soundKey === SoundLoadingKey.DEALER_B) {
        lastTakeSimpleB = !lastTakeSimpleB;
      }

      voiceKeys.push(soundKey);
    }

    return voiceKeys;
  }

  private getSoundKeyFromRandom(rng: number, lastTakeSimpleB: boolean) {
    if (CHANCE_PYPY > rng) {
      return SoundLoadingKey.DEALER_PYPY;
    }

    if (CHANCE_PYPYPYPY > rng) {
      return SoundLoadingKey.DEALER_PYPYPY;
    }

    if (CHANCE_BB > rng) {
      return SoundLoadingKey.DEALER_BB;
    }

    if (CHANCE_BBB > rng) {
      return SoundLoadingKey.DEALER_BBB;
    }

    if (lastTakeSimpleB) {
      return SoundLoadingKey.DEALER_PY;
    }

    return SoundLoadingKey.DEALER_B;
  }
}
