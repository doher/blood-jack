import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import {
  ImageLoadingKey,
  ShopFrame,
} from '../../managers/game-object-factory/imageConstants.ts';

import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;

const WEIGHT_X_OFFSET = 35;
export class Weights extends Container {
  private weights: Sprite[] = [];

  constructor(
    public scene: Phaser.Scene,
    private countWeights: number,
  ) {
    super(scene, 0, 0);
    this.create();
  }

  private create() {
    for (
      let weightIndex = 0;
      weightIndex <= this.countWeights;
      weightIndex += 1
    ) {
      const weight = gameObjectFactory.createSprite(this.scene, {
        key: ImageLoadingKey.UI_SHOP,
        frame: ShopFrame.WEIGHT,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        position: {
          x: WEIGHT_X_OFFSET * weightIndex,
          y: 0,
        },
      });

      this.add(weight);
      this.weights.push(weight);
    }
  }
}
