import { Suit } from '../../managers/blackjack/constants.ts';
import { BitmapFontLoadingKey } from '../../managers/game-object-factory/bitmapConstants.ts';
import type { GameObjectsBitmapTextDescription } from '../../managers/game-object-factory/constants.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import { ImageLoadingKey } from '../../managers/game-object-factory/imageConstants.ts';
import type { Config } from './constants.ts';
import { ranksTexts } from './constants.ts';
import { suitsImages } from './constants.ts';

export class CardView extends Phaser.GameObjects.Container {
  constructor(
    public scene: Phaser.Scene,
    config: Config,
  ) {
    super(scene);

    this.scene.add.existing(this);
    this.create(config);
  }

  private create(config: Config) {
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

    const textLayout: GameObjectsBitmapTextDescription = {
      position: {
        x: 0,
        y: 0,
      },
      text: ranksTexts[config.rank],
      font: BitmapFontLoadingKey.CARD_VALUES,
      size: 16,
      origin: {
        x: 0,
        y: 0.5,
      },
      ...(isBlackSuit ? { tint: { topLeft: 0x000000 } } : {}),
    };

    const text = gameObjectFactory.createBitmapText(this.scene, {
      ...textLayout,
      position: {
        x: -16,
        y: -26,
      },
    });

    const revertedText = gameObjectFactory.createBitmapText(this.scene, {
      ...textLayout,
      position: {
        x: 13,
        y: 25,
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
        x: -13,
        y: -12,
      },
    });

    const revertedSuit = gameObjectFactory.createSprite(this.scene, {
      ...smallSuitLayout,
      position: {
        x: 10,
        y: 11,
      },
      rotation: Math.PI,
    });

    this.setPosition(1920 / 2, 1080 / 2);
    this.setScale(3, 3);

    this.add([cardFront, suit, smallSuit, revertedSuit, text, revertedText]);
  }
}
