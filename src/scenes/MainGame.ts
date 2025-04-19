import { Scene } from 'phaser';
import { Dealer } from '../actors/dealer/Dealer.ts';
import { PlayerUI } from '../actors/player-ui/PlayerUI.ts';
import { Player } from '../actors/Player.ts';
import { AnimationPlayingKey } from '../managers/animation-manager/AnimationManager.ts';
import { AnimationLoadingKey } from '../managers/animation-manager/constants.ts';
import { BlackjackManager } from '../managers/blackjack-score-manager/BlackjackManager.ts';
import { gameObjectFactory } from '../managers/game-object-factory/GameObjectFactory.ts';
import { ImageLoadingKey } from '../managers/game-object-factory/imageConstants.ts';
import { SoundManager } from '../managers/sound-manager/SoundManager.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../views/constants.ts';
import { Rain } from '../views/Rain.ts';
import { SceneType } from './constants.ts';
import { ShopView } from '../views/shop-view/ShopView.ts';
import { Shadow } from '../views/Shadow.ts';
import { Cursor } from '../views/cursor/Cursor.ts';
import { ShopUI } from '../actors/ShopUI.ts';

export class MainGame extends Scene {
  private dealer: Dealer;

  private blackjackManager: BlackjackManager;

  private playerUI: PlayerUI;

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
    gameObjectFactory.createSprite(this, {
      key: AnimationLoadingKey.BACKGROUND_JAIL,
      position: {
        x: SCREEN_HALF_W,
        y: SCREEN_HALF_H,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });

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
    this.dealer.talkText(
      [
        'Pypypy Pypypy Pypypy',
        'Lets play Blackjack, 2 rounds, after last round is russian roulette',
      ],
      AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
    );

    ///TODO DEV MUTE
    // SoundManager.getInstance().muteAll();

    this.playerUI = new PlayerUI(this); // create ui before create player

    new ShopUI(this);

    this.cursor = new Cursor(this); // create cursor after all ui elements!!!

    new Player(this, this.blackjackManager.blackjack); // create in last queue
  }

  public update() {
    this.dealer.handlePlayerCursor();
    this.cursor.handlePlayerMouse();
  }
}
