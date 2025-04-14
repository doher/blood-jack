import 'phaser';

interface ImageAsset {
  key: string;
  path: string;
}

interface SpriteSheetAsset {
  key: string;
  imagePath: string;
  atlasDataPath: string;
}

interface BitmapFontAsset {
  key: string;
  imagePath: string;
  fontDataPath: string;
}

interface AudioAsset {
  key: string;
  paths: string[] | string;
}

interface FontAsset {
  key: string;
  url: string;
  options?: FontFaceDescriptors;
}

export class AssetLoaderManager {
  private scene: Phaser.Scene;
  private loader: Phaser.Loader.LoaderPlugin;
  private static instance: AssetLoaderManager | null = null;

  private constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.loader = scene.load;
    this.loader.setPath('assets');
  }

  public static getInstance(scene: Phaser.Scene): AssetLoaderManager {
    if (AssetLoaderManager.instance) {
      return AssetLoaderManager.instance;
    }

    AssetLoaderManager.instance = new AssetLoaderManager(scene);
    return AssetLoaderManager.instance;
  }

  public loadImage(config: ImageAsset): this {
    this.loader.image(config.key, config.path);
    return this;
  }

  public loadSpriteSheet(config: SpriteSheetAsset): this {
    this.loader.multiatlas(config.key, config.atlasDataPath, config.imagePath);
    return this;
  }

  public loadBitmapFont(config: BitmapFontAsset): this {
    this.loader.bitmapFont(config.key, config.imagePath, config.fontDataPath);
    return this;
  }

  public loadAudio(config: AudioAsset): this {
    const audioPaths = Array.isArray(config.paths)
      ? config.paths
      : [config.paths];
    this.loader.audio(config.key, audioPaths);
    return this;
  }

  public start(
    onComplete?: () => void,
    onError?: (error: Error) => void,
  ): void {
    this.loader.once(Phaser.Loader.Events.COMPLETE, () => {
      onComplete?.();
    });

    this.loader.once(
      Phaser.Loader.Events.FILE_LOAD_ERROR,
      (file: Phaser.Loader.File) => {
        const error = new Error(`Failed to load ${file.key}`);
        onError?.(error);
      },
    );

    this.loader.start();
  }
}
