import { gameObjectFactory } from '../managers/game-object-factory/GameObjectFactory.ts';
import Container = Phaser.GameObjects.Container;
import { SCREEN_HALF_H, SCREEN_HALF_W } from './constants.ts';
import Rectangle = Phaser.GameObjects.Rectangle;

export const SHADOW_TAG = 'SHADOW';

export class Shadow extends Container {
  constructor(private scene: Phaser.Scene) {
    super(scene, -SCREEN_HALF_W, -SCREEN_HALF_H);
    this.create();
  }

  private create() {
    const shadow = this.scene.add
      .rectangle(
        0,
        0,
        this.scene.cameras.main.width,
        this.scene.cameras.main.height,
        0x000000,
        0.95,
      )
      .setOrigin(0)
      .setDepth(9999)
      .setInteractive();
    shadow.setName(SHADOW_TAG);
    this.add(shadow);
  }
}
