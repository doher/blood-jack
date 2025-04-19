import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import {
  ImageLoadingKey,
  ShopFrame,
} from '../../managers/game-object-factory/imageConstants.ts';

export const enum ShopBulletsType {
  RED = ShopFrame.BULLET_RED,
  YELLOW = ShopFrame.BULLET_YELLOW,
  GREEN = ShopFrame.BULLET_GREEN,
}

const BULLET_X_OFFSET = 25;
const BULLET_Y_OFFSET = 2;

export class BulletsSideView extends Container {
  private bullets: Sprite[] = [];

  constructor(
    private scene: Phaser.Scene,
    private bulletTypes: ShopBulletsType[],
  ) {
    super(scene, 0, 0);
    this.create();
  }

  private create() {
    this.bulletTypes.forEach((bulletType, index) => {
      const yOffset = index === 1 ? BULLET_Y_OFFSET : 0;

      const bullet = gameObjectFactory.createSprite(this.scene, {
        key: ImageLoadingKey.UI_SHOP,
        frame: bulletType,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        position: {
          x: BULLET_X_OFFSET * index,
          y: yOffset,
        },
      });

      this.bullets.push(bullet);
    });

    this.add([this.bullets[0], this.bullets[2], this.bullets[1]]);

    this.scene.add.existing(this);
  }
}
