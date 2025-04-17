import { Howl } from 'howler';
import { EventBus } from '../../EventBus.ts';

type SoundLoadCallback = () => void;

type SoundLayout = {
  name: string;
  url: string;
};

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

    soundLayouts.forEach(({ name, url }) => {
      this.sounds.set(
        name,
        new Howl({
          src: url,
          onload: () => {
            this.handleLoad(onComplete);
          },
          onloaderror: (_id, error) => {
            this.handleLoadError(name, error, onComplete);
          },
          onend: () => {
            EventBus.emit(name);
          },
        }),
      );
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
