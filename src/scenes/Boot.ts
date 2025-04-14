import { Scene } from 'phaser';
import { SceneType } from './constants.ts';
import { AssetLoaderManager } from '../managers/AssetLoaderManager.ts';
import { ANIMATION_LOADING_LAYOUTS } from '../managers/animation-manager/constants.ts';
import { AnimationManager } from '../managers/animation-manager/AnimationManager.ts';
import { SceneManager } from '../managers/SceneManager.ts';

export class Boot extends Scene {
  private assetLoaderManager: AssetLoaderManager;
  private animationManager: AnimationManager;
  private sceneManager: SceneManager;

  constructor() {
    super(SceneType.BOOT);
  }

  public preload() {
    this.initializeManagers();
    this.addAssetsToLoadQueue();
    this.startAssetLoader();
  }

  private initializeManagers() {
    this.assetLoaderManager = AssetLoaderManager.getInstance(this);
    this.animationManager = AnimationManager.getInstance(this);
    this.sceneManager = SceneManager.getInstance(this.game);
  }

  private addAssetsToLoadQueue() {
    ANIMATION_LOADING_LAYOUTS.forEach((layout) => {
      this.assetLoaderManager.loadSpriteSheet({
        key: layout.loadingKey,
        atlasDataPath: layout.atlasDataPath,
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

  private afterLoadAssets() {
    this.animationManager.registrationAnimation();
    this.sceneManager.start(SceneType.MENU);
  }

  private errorLoadingAssets() {
    console.log('Error while loading assets');
  }

  public create() {}
}
