import Container = Phaser.GameObjects.Container;
import type { Position } from '../../managers/game-object-factory/constants.ts';

export class UiElement extends Container {
  public isActive = true;

  constructor(
    public scene: Phaser.Scene,
    private UiElementPosition: Position,
  ) {
    super(scene, UiElementPosition.x, UiElementPosition.y);
  }
}
