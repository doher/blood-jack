import type { Howl } from 'howler';
import { HowlerLoader } from './HowlerLoader.ts';

export class SoundManager {
  private static instance: SoundManager | null = null;

  public sounds: Map<string, Howl> = new Map<string, Howl>();

  private constructor() {
    this.sounds = HowlerLoader.getInstance().sounds;
    this.setupEventListeners();
  }

  public static getInstance(): SoundManager {
    if (SoundManager.instance) {
      return SoundManager.instance;
    }

    SoundManager.instance = new SoundManager();
    return SoundManager.instance;
  }

  public get(key: string): Howl | undefined {
    return this.sounds.get(key);
  }

  public muteAll() {
    this.sounds.forEach((value) => {
      value.mute(true);
    });
  }

  public isPlaying = (key: string): boolean => {
    const sound: Howl | undefined = this.get(key);
    if (sound) {
      return sound.playing();
    }
    return false;
  };

  public stop(key: string): Howl | undefined {
    const sound = this.get(key);

    if (!sound) {
      return;
    }

    sound.stop();
    return sound;
  }

  public play = (
    key: string,
    loop = false,
    doRestart = false,
    volume = 1,
  ): Howl | undefined => {
    const sound = this.get(key);

    if (!sound) {
      return;
    }

    sound.volume(volume);

    if (!sound.playing() || doRestart) {
      sound.play();
      sound.loop(loop);
    }

    return sound;
  };

  private setupEventListeners(): void {}
}
