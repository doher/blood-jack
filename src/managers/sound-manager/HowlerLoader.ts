import { EventBus } from '../../EventBus.ts';

type SoundLoadCallback = () => void;

type SoundLayout = {
  name: string;
  url: string;
};

import { Howl } from 'howler';

export class HowlerLoader {
  private static instance: HowlerLoader | null = null;

  public sounds: Map<string, Howl> = new Map<string, Howl>();

  private loadedCount: number = 0;
  private totalToLoad: number = 0;

  public static getInstance(): HowlerLoader {
    if (HowlerLoader.instance) {
      return HowlerLoader.instance;
    }

    HowlerLoader.instance = new HowlerLoader();
    return HowlerLoader.instance;
  }

  public load(
    soundLayouts: SoundLayout[],
    onComplete?: SoundLoadCallback,
  ): void {
    this.totalToLoad = soundLayouts.length;
    this.loadedCount = 0;

    soundLayouts.forEach((soundLayout) => {
      this.sounds[soundLayout.name] = new Howl({
        src: soundLayout.url,
        onload: () => {
          this.handleLoad(onComplete);
        },
        onloaderror: (id, error) => {
          this.handleLoadError(soundLayout.name, error, onComplete);
        },
        onend: () => {
          EventBus.emit(soundLayout.name);
        },
      });
    });
  }

  private handleLoad(onComplete?: SoundLoadCallback): void {
    this.loadedCount++;
    if (this.loadedCount === this.totalToLoad) {
      onComplete?.();
    }
  }

  private handleLoadError(
    name: string,
    error: unknown,
    onComplete?: SoundLoadCallback | undefined,
  ): void {
    console.error(`Error loading sound ${name}:`, error);
    this.loadedCount++;
    if (this.loadedCount === this.totalToLoad) {
      onComplete?.();
    }
  }
}
