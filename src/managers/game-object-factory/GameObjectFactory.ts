import { GameObjectDescription } from './constants.ts';

class GameObjectFactory {
  public createSprite = (
    scene: Phaser.Scene,
    layout: GameObjectDescription,
  ): Phaser.GameObjects.Sprite => {
    const sprite = scene.add.sprite(
      layout.position.x,
      layout.position.y,
      layout.key,
      layout.frame,
    );

    if (layout.origin) {
      sprite.setOrigin(layout.origin.x, layout.origin.y);
    }

    if (layout.tint) {
      sprite.setTint(
        layout.tint.topLeft,
        layout.tint.topRight,
        layout.tint.bottomLeft,
        layout.tint.bottomRight,
      );
    }

    if (layout.scale) {
      sprite.setScale(layout.scale.x, layout.scale.y);
    }

    if (layout.rotation) {
      sprite.setRotation(layout.rotation);
    }

    if (layout.blendMode) {
      sprite.setBlendMode(layout.blendMode);
    }

    return sprite;
  };
}

export const gameObjectFactory = new GameObjectFactory();
