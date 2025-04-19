import Container = Phaser.GameObjects.Container;
import { RouletteBulletsType } from '../../actors/roulette/RouletteUI.ts';
import { Drum } from './Drum.ts';
import { Position } from '../../managers/game-object-factory/constants.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../constants.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import { ImageLoadingKey } from '../../managers/game-object-factory/imageConstants.ts';
import { SHADOW_TAG } from '../Shadow.ts';

const DRUM_POSITION: Position = {
  x: 0,
  y: -150,
};

export class RouletteView extends Container {
  public drum: Drum;

  constructor(private scene: Phaser.Scene) {
    super(scene, SCREEN_HALF_W, SCREEN_HALF_H);
    this.create();
  }

  private create() {
    this.createBackground();

    this.drum = new Drum(this.scene, DRUM_POSITION);
    this.add(this.drum);
    this.scene.add.existing(this);
  }

  private createBackground() {
    const background = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.SHOP_BACKGROUND,
      position: {
        x: 0,
        y: 0,
      },
      scale: {
        x: 1,
        y: 1.08,
      },
    });
    background.setTint(0xcccccc);
    background.setInteractive();
    background.setName(SHADOW_TAG);
    this.add(background);
  }

  public show(playerBulletsFrames: RouletteBulletsType[]) {
    this.drum.showPlayerBullets(playerBulletsFrames);
  }
}
