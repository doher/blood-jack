import { Scene } from 'phaser';
import { AnimationManager } from '../managers/animation-manager/AnimationManager.ts';
import { ANIMATION_LOADING_LAYOUTS } from '../managers/animation-manager/constants.ts';
import { AssetLoaderManager } from '../managers/AssetLoaderManager.ts';
import { BITMAP_FONT_LAYOUTS } from '../managers/game-object-factory/bitmapConstants.ts';
import { IMAGE_LAYOUTS } from '../managers/game-object-factory/imageConstants.ts';
import { SceneManager } from '../managers/SceneManager.ts';
import { SoundLoadingKey } from '../managers/sound-manager/constants.ts';
import { HowlerLoader } from '../managers/sound-manager/HowlerLoader.ts';
import { SceneType } from './constants.ts';

export class Boot extends Scene {
  private assetLoaderManager: AssetLoaderManager;

  private animationManager: AnimationManager;

  private sceneManager: SceneManager;

  private howlerLoader: HowlerLoader;

  private isPhaserCompleteLoading = false;

  private isHowlerCompleteLoading = false;

  constructor() {
    super(SceneType.BOOT);
  }

  public preload() {
    this.initializeManagers();
    this.addAssetsToLoadQueue();
    this.startAssetLoader();
    this.startHowlerLoader();
  }

  private initializeManagers() {
    this.assetLoaderManager = AssetLoaderManager.getInstance(this);
    this.howlerLoader = HowlerLoader.getInstance();
    this.animationManager = AnimationManager.getInstance(this);
    this.sceneManager = SceneManager.getInstance(this.game);
  }

  private addAssetsToLoadQueue() {
    ANIMATION_LOADING_LAYOUTS.forEach((layout) => {
      this.assetLoaderManager.loadSpriteSheet({
        key: layout.key,
        atlasDataPath: layout.atlasDataPath,
        imagePath: layout.imagePath,
      });
    });

    BITMAP_FONT_LAYOUTS.forEach((layout) => {
      this.assetLoaderManager.loadBitmapFont({
        key: layout.key,
        fontDataPath: layout.fontDataPath,
        imagePath: layout.imagePath,
      });
    });

    IMAGE_LAYOUTS.forEach((layout) => {
      this.assetLoaderManager.loadImage({
        key: layout.key,
        imagePath: layout.imagePath,
      });
    });
  }

  private startAssetLoader() {
    this.assetLoaderManager.start(
      () => this.afterLoadAssets(),
      () => this.errorLoadingAssets(),
    );
  }

  private startHowlerLoader() {
    this.howlerLoader.load(
      [
        {
          name: SoundLoadingKey.DEALER_BBB,
          url: '/assets/sounds/dealer/talk/BBB.wav',
        },
        {
          name: SoundLoadingKey.DEALER_BB,
          url: '/assets/sounds/dealer/talk/BB.wav',
        },
        {
          name: SoundLoadingKey.DEALER_B,
          url: '/assets/sounds/dealer/talk/B.wav',
        },
        {
          name: SoundLoadingKey.DEALER_PYPYPY,
          url: '/assets/sounds/dealer/talk/PYPYPY.wav',
        },
        {
          name: SoundLoadingKey.DEALER_PYPY,
          url: '/assets/sounds/dealer/talk/PYPY.wav',
        },
        {
          name: SoundLoadingKey.DEALER_PY,
          url: '/assets/sounds/dealer/talk/PY.wav',
        },
        {
          name: SoundLoadingKey.DEALER_CLICK,
          url: '/assets/sounds/dealer/clickEffect/clickEffect.mp3',
        },
        {
          name: SoundLoadingKey.RAIN,
          url: '/assets/sounds/rain/rainSound.mp3',
        },
      ],
      () => {
        this.afterLoadSounds();
      },
    );
  }

  private afterLoadAssets() {
    this.isPhaserCompleteLoading = true;
    this.tryLoadingGame();
  }

  private afterLoadSounds() {
    this.isHowlerCompleteLoading = true;
    this.tryLoadingGame();
  }

  private tryLoadingGame() {
    if (!this.isHowlerCompleteLoading || !this.isPhaserCompleteLoading) {
      return;
    }
    this.animationManager.registrationAnimation();
    this.sceneManager.start(SceneType.MENU);
  }

  private errorLoadingAssets() {
    console.log('Error while loading assets');
  }

  public create() {}
}
