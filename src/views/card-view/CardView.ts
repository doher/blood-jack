import { Suit } from '../../actors/blackjack/constants.ts';
import { BitmapFontLoadingKey } from '../../managers/game-object-factory/bitmapConstants.ts';
import type { BitmapTextDescription } from '../../managers/game-object-factory/constants.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import { ImageLoadingKey } from '../../managers/game-object-factory/imageConstants.ts';
import type { Config } from './constants.ts';
import { ranksTexts, suitsImages } from './constants.ts';

export class CardView extends Phaser.GameObjects.Container {
  public cardBack: Phaser.GameObjects.Sprite;

  constructor(
    public scene: Phaser.Scene,
    config: Config,
  ) {
    super(scene);

    this.scene.add.existing(this);
    this.create(config);
  }

  private create(config: Config) {
    if (config.isClosed) {
      this.cardBack = gameObjectFactory.createSprite(this.scene, {
        key: ImageLoadingKey.CARD_BACK,
        position: {
          x: 0,
          y: 0,
        },
        origin: {
          x: 0.5,
          y: 0.5,
        },
      });

      this.add(this.cardBack);
      return;
    }

    const cardFront = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.CARD_FRONT,
      position: {
        x: 0,
        y: 0,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });

    const suit = gameObjectFactory.createSprite(this.scene, {
      key: suitsImages[config.suit].image,
      position: {
        x: -2,
        y: 0,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });

    const isBlackSuit = [Suit.CLUBS, Suit.SPADES].includes(config.suit);

    const textLayout: BitmapTextDescription = {
      position: {
        x: 0,
        y: 0,
      },
      text: ranksTexts[config.rank],
      font: isBlackSuit
        ? BitmapFontLoadingKey.BLACK_CARD_FONT
        : BitmapFontLoadingKey.RED_CARD_FONT,
      size: 154,
      origin: {
        x: 0,
        y: 0.5,
      },
    };

    const text = gameObjectFactory.createBitmapText(this.scene, {
      ...textLayout,
      position: {
        x: -48,
        y: -128,
      },
    });

    const revertedText = gameObjectFactory.createBitmapText(this.scene, {
      ...textLayout,
      position: {
        x: 39,
        y: 124,
      },
      rotation: Math.PI,
    });

    const smallSuitLayout = {
      key: suitsImages[config.suit].smallImage,
      origin: {
        x: 0.5,
        y: 0.5,
      },
    };

    const smallSuit = gameObjectFactory.createSprite(this.scene, {
      ...smallSuitLayout,
      position: {
        x: -39,
        y: -36,
      },
    });

    const revertedSuit = gameObjectFactory.createSprite(this.scene, {
      ...smallSuitLayout,
      position: {
        x: 30,
        y: 33,
      },
      rotation: Math.PI,
    });

    this.add([cardFront, suit, smallSuit, revertedSuit, text, revertedText]);
  }
}
