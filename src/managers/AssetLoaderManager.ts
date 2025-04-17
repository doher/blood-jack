import { BitmapFontAsset } from './game-object-factory/bitmapConstants.ts';
import { ImageAsset } from './game-object-factory/imageConstants.ts';

type SpriteSheetAsset = {
  key: string;
  imagePath: string;
  atlasDataPath: string;
};

type AudioAsset = {
  key: string;
  paths: string[] | string;
};

type FontAsset = {
  key: string;
  url: string;
  options?: FontFaceDescriptors;
};

export class AssetLoaderManager {
  private loader: Phaser.Loader.LoaderPlugin;

  private static instance: AssetLoaderManager | null = null;

  private constructor(scene: Phaser.Scene) {
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
    this.loader.image(config.key, config.imagePath);
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
