import { Scene } from 'phaser';
import { AnimationManager } from '../managers/animation-manager/AnimationManager.ts';
import { ANIMATION_LOADING_LAYOUTS } from '../managers/animation-manager/constants.ts';
import { AssetLoaderManager } from '../managers/AssetLoaderManager.ts';
import { BITMAP_FONT_LAYOUTS } from '../managers/game-object-factory/bitmapConstants.ts';
import {
  IMAGE_LAYOUTS,
  SPRITE_SHEET_LAYOUTS,
} from '../managers/game-object-factory/imageConstants.ts';
import { SceneManager } from '../managers/SceneManager.ts';
import { SoundLoadingKey } from '../managers/sound-manager/constants.ts';
import { HowlerLoader } from '../managers/sound-manager/HowlerLoader.ts';
import { SceneType } from './constants.ts';
import { Shadow } from '../views/Shadow.ts';
import { gameObjectFactory } from '../managers/game-object-factory/GameObjectFactory.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../views/constants.ts';

export class Boot extends Scene {
  private assetLoaderManager: AssetLoaderManager;

  private animationManager: AnimationManager;

  private sceneManager: SceneManager;

  private howlerLoader: HowlerLoader;

  private isPhaserCompleteLoading = false;

  private isHowlerCompleteLoading = false;

  private loadingShadow: Shadow;

  private loadingText: Phaser.GameObjects.Text;

  private progressBarText: Phaser.GameObjects.Text;

  private loadingContainer: Phaser.GameObjects.Container;

  constructor() {
    super(SceneType.BOOT);
  }

  public preload() {
    this.loadingShadow = new Shadow(this, 1);
    this.loadingShadow.setPosition(0, 0);

    this.loadingContainer = this.add.container(0, 0);

    this.loadingText = gameObjectFactory.createText(this, {
      fontSize: 100,
      color: 'white',
      position: {
        x: SCREEN_HALF_W,
        y: SCREEN_HALF_H,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
      text: 'LOADING :)',
    });

    this.progressBarText = gameObjectFactory.createText(this, {
      fontSize: 100,
      color: 'white',
      position: {
        x: SCREEN_HALF_W,
        y: SCREEN_HALF_H + 100,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
      text: '%',
    });

    this.loadingContainer.add([
      this.loadingShadow,
      this.loadingText,
      this.progressBarText,
    ]);

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
    [...ANIMATION_LOADING_LAYOUTS, ...SPRITE_SHEET_LAYOUTS].forEach(
      (layout) => {
        this.assetLoaderManager.loadSpriteSheet({
          key: layout.key,
          atlasDataPath: layout.atlasDataPath,
          imagePath: layout.imagePath,
        });
      },
    );

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
      (progress: string) => {
        this.progressBarText.setText(progress);
      },
      () => this.afterLoadAssets(),
      () => this.errorLoadingAssets(),
    );
  }

  private startHowlerLoader() {
    this.howlerLoader.load(
      [
        {
          name: SoundLoadingKey.DEALER_BBB,
          url: 'assets/sounds/dealer/talk/BBB.wav',
        },
        {
          name: SoundLoadingKey.DEALER_BB,
          url: 'assets/sounds/dealer/talk/BB.wav',
        },
        {
          name: SoundLoadingKey.DEALER_B,
          url: 'assets/sounds/dealer/talk/B.wav',
        },
        {
          name: SoundLoadingKey.DEALER_PYPYPY,
          url: 'assets/sounds/dealer/talk/PYPYPY.wav',
        },
        {
          name: SoundLoadingKey.DEALER_PYPY,
          url: 'assets/sounds/dealer/talk/PYPY.wav',
        },
        {
          name: SoundLoadingKey.DEALER_PY,
          url: 'assets/sounds/dealer/talk/PY.wav',
        },
        {
          name: SoundLoadingKey.DEALER_CLICK,
          url: 'assets/sounds/dealer/clickEffect/clickEffect.mp3',
        },
        {
          name: SoundLoadingKey.RAIN,
          url: 'assets/sounds/rain/rainSound.wav',
        },
        {
          name: SoundLoadingKey.CARD_GIVEAWAY,
          url: 'assets/sounds/ui-controls/card-giveaway.wav',
        },
        {
          name: SoundLoadingKey.DECREASE,
          url: 'assets/sounds/ui-controls/decrease.wav',
        },
        {
          name: SoundLoadingKey.INCREASE,
          url: 'assets/sounds/ui-controls/increase.wav',
        },
        {
          name: SoundLoadingKey.ALL_IN,
          url: 'assets/sounds/ui-controls/all-in.wav',
        },
        {
          name: SoundLoadingKey.STAND,
          url: 'assets/sounds/ui-controls/stand.wav',
        },
        {
          name: SoundLoadingKey.SHOP,
          url: 'assets/sounds/ui-controls/shop.wav',
        },
        {
          name: SoundLoadingKey.SHOP_BUY,
          url: 'assets/sounds/shop/buy.wav',
        },
        {
          name: SoundLoadingKey.SHOP_BUY_BAD,
          url: 'assets/sounds/shop/buyBad.wav',
        },
        {
          name: SoundLoadingKey.SHOP_BUY_SO_SO,
          url: 'assets/sounds/shop/buySoSo.wav',
        },
        {
          name: SoundLoadingKey.SHOP_BUY_GOOD,
          url: 'assets/sounds/shop/buyGood.wav',
        },
        {
          name: SoundLoadingKey.SHOP_TO_BALANCED,
          url: 'assets/sounds/shop/toBalanced.wav',
        },
        {
          name: SoundLoadingKey.SHOP_BALANCE_TEXT,
          url: 'assets/sounds/shop/tone.wav',
        },
        {
          name: SoundLoadingKey.SHOP_BALANCE_TEXT,
          url: 'assets/sounds/shop/tone.wav',
        },
        {
          name: SoundLoadingKey.ROULETTE_SPIN,
          url: 'assets/sounds/roulette/spin.wav',
        },
        {
          name: SoundLoadingKey.ROULETTE_SHOOT,
          url: 'assets/sounds/roulette/shoot.mp3',
        },
        {
          name: SoundLoadingKey.ROULETTE_EMPTY,
          url: 'assets/sounds/roulette/empty.wav',
        },
        {
          name: SoundLoadingKey.ROULETTE_LOAD_SHELL,
          url: 'assets/sounds/roulette/load-shell.wav',
        },
        {
          name: SoundLoadingKey.ROULETTE_MAIN_THEME,
          url: 'assets/sounds/roulette/background-theme.mp3',
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

    this.destroyOnLoad();
    this.animationManager.registrationAnimation();
    this.sceneManager.start(SceneType.MENU);
  }

  private destroyOnLoad() {
    [
      this.loadingShadow,
      this.loadingText,
      this.progressBarText,
      this.loadingContainer,
    ].forEach((value) => {
      value.destroy(true);
    });
  }

  private errorLoadingAssets() {
    console.log('Error while loading assets ;(');
  }

  public create() {}
}
