import { GameObjectDescription } from './constants.ts';

class GameObjectFactory {
  public createSprite = (
    scene: Phaser.Scene,
    layout: GameObjectDescription,
  ): Phaser.GameObjects.Sprite => {
    const image = scene.add.sprite(
      layout.position.x,
      layout.position.y,
      layout.key,
      layout.frame,
    );

    if (layout.origin) {
      image.setOrigin(layout.origin.x, layout.origin.y);
    }

    if (layout.tint) {
      image.setTint(
        layout.tint.topLeft,
        layout.tint.topRight,
        layout.tint.bottomLeft,
        layout.tint.bottomRight,
      );
    }

    if (layout.scale) {
      image.setScale(layout.scale.x, layout.scale.y);
    }

    if (layout.rotation) {
      image.setRotation(layout.rotation);
    }

    if (layout.blendMode) {
      image.setBlendMode(layout.blendMode);
    }

    return image;
  };
}

export const gameObjectFactory = new GameObjectFactory();
