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

  public isPlaying = (key: string): boolean => {
    const sound: Howl | undefined = this.get(key);
    if (sound) {
      return sound.playing();
    }
    return false;
  };

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

  public stop(key: string): Howl | undefined {
    const sound = this.get(key);

    if (!sound) {
      return;
    }

    sound.stop();
    return sound;
  }

  public pause = (key: string): Howl | undefined => {
    const sound = this.get(key);

    if (!sound) {
      return;
    }

    sound.pause();
    return sound;
  };

  public fadeOut(
    key: string,
    from: number,
    duration: number,
    to = 0,
  ): Howl | undefined {
    const sound = this.get(key);

    if (!sound) {
      return;
    }

    sound.fade(from, to, duration);
    return sound;
  }

  public fadeOutAndStop = (
    key: string,
    from: number,
    duration: number,
    to = 0,
  ): void => {
    const sound = this.fadeOut(key, from, duration, to);
    sound?.once('fade', () => {
      if (this.get(key)?.volume() === 0) {
        this.stop(key);
      }
    });
  };

  public fadeIn = (
    key: string,
    from: number,
    duration: number,
    to = 1,
  ): Howl | undefined => {
    const sound = this.get(key);

    if (!sound) {
      return;
    }

    sound.fade(from, to, duration);
  };

  public fadeInAndPlay = (
    key: string,
    from: number,
    duration: number,
    to = 1,
    loop = false,
  ): Howl | undefined => {
    const sound = this.play(key, loop, false, from);

    if (sound) {
      sound.fade(from, to, duration);
    }

    return sound;
  };

  private setupEventListeners(): void {}
}
