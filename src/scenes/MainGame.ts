import { Scene } from 'phaser';
import { Dealer } from '../actors/dealer/Dealer.ts';
import { PlayerUI } from '../actors/player-ui/PlayerUI.ts';
import { Player } from '../actors/Player.ts';
import { RouletteUI } from '../actors/roulette/RouletteUI.ts';
import { ShopUI } from '../actors/ShopUI.ts';
import { AnimationPlayingKey } from '../managers/animation-manager/AnimationManager.ts';
import { BlackjackManager } from '../managers/blackjack-score-manager/BlackjackManager.ts';
import { gameObjectFactory } from '../managers/game-object-factory/GameObjectFactory.ts';
import { ImageLoadingKey } from '../managers/game-object-factory/imageConstants.ts';
import { SoundManager } from '../managers/sound-manager/SoundManager.ts';
import { Background } from '../views/Background.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../views/constants.ts';
import { Cursor } from '../views/cursor/Cursor.ts';
import { Rain } from '../views/Rain.ts';
import { SceneType } from './constants.ts';

export class MainGame extends Scene {
  public static currentRoundIndex = -1;

  private dealer: Dealer;

  private blackjackManager: BlackjackManager;

  private rouletteUI: RouletteUI;

  public cursor: Cursor;

  constructor() {
    super(SceneType.GAME);

    SoundManager.getInstance();
  }

  public preload() {
    console.log('Preload' + SceneType.GAME);
  }

  public create() {
    /// TODO add background for rain

    new Rain(this);

    ///TODO bring to background

    new Background(this);

    ///TODO bring to background
    gameObjectFactory.createSprite(this, {
      key: ImageLoadingKey.TABLE,
      position: {
        x: SCREEN_HALF_W,
        y: SCREEN_HALF_H + 200,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });

    this.blackjackManager = new BlackjackManager(this);

    this.dealer = new Dealer(this);

    new PlayerUI(this);

    new ShopUI(this, this.blackjackManager.blackjack);

    this.rouletteUI = new RouletteUI(this, this.blackjackManager.blackjack);

    this.cursor = new Cursor(this);

    new Player(this, this.blackjackManager.blackjack, this.rouletteUI);

    this.time.delayedCall(1000, () => {
      this.dealer.talkText(
        [
          'Hello prisoner #666',
          'We will play Blackjack with You',
          'I advise you to win all my money',
          "If you're lucky, you can buy blank cartridges...",
          'Because as soon as you buy cartridges 2 times...',
          'We will play...RUSSIAN ROULETTE',
        ],
        AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
      );
    });
  }

  public update() {
    this.dealer.handlePlayerCursor();
    this.cursor.handlePlayerMouse();
    this.rouletteUI.rouletteView.revolverCylinder.handleDrumRotateByPlayer();
  }
}
