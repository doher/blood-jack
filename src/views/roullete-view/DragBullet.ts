import { DragElement } from '../DragElement.ts';
import {
  ImageLoadingKey,
  RouletteFrame,
} from '../../managers/game-object-factory/imageConstants.ts';
import { RouletteBulletsType } from '../../actors/roulette/RouletteUI.ts';
import { Position } from '../../managers/game-object-factory/constants.ts';
import Container = Phaser.GameObjects.Container;

export class DragBullet extends DragElement {
  constructor(
    private scene: Phaser.Scene,
    private slots: Phaser.GameObjects.Arc[],
    frame: RouletteBulletsType,
    position: Position,
    newContainerIfDragComplete: Container,
  ) {
    super(
      scene,
      slots,
      ImageLoadingKey.ROULETTE_UI,
      frame,
      position,
      newContainerIfDragComplete,
    );
  }

  protected create() {
    super.create();
  }

  protected setupEventListeners() {
    super.setupEventListeners();
  }
}
