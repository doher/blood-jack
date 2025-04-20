import { SCREEN_HALF_H, SCREEN_HALF_W } from './constants.ts';

import Container = Phaser.GameObjects.Container;

export const SHADOW_TAG = 'SHADOW';

export class Shadow extends Container {
  constructor(
    private scene: Phaser.Scene,
    private fillAlpha: number = 0.95,
  ) {
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
        this.fillAlpha,
      )
      .setOrigin(0)
      .setDepth(9999)
      .setInteractive();
    shadow.setName(SHADOW_TAG);
    this.add(shadow);
  }
}
