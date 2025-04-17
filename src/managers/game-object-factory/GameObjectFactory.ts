import type { SpriteDescription, TextDescription } from './constants.ts';
import type { BitmapTextDescription } from './constants.ts';

class GameObjectFactory {
  public createBitmapText = (
    scene: Phaser.Scene,
    layout: BitmapTextDescription,
  ): Phaser.GameObjects.BitmapText => {
    const bitmapText = scene.add.bitmapText(
      layout.position.x,
      layout.position.y,
      layout.font,
      layout.text,
      layout.size,
      layout.align,
    );

    if (layout.origin) {
      bitmapText.setOrigin(layout.origin.x, layout.origin.y);
    }

    if (layout.tint) {
      bitmapText.setTint(
        layout.tint.topLeft,
        layout.tint.topRight,
        layout.tint.bottomLeft,
        layout.tint.bottomRight,
      );
    }

    if (layout.rotation) {
      bitmapText.setRotation(layout.rotation);
    }

    return bitmapText;
  };

  public createSprite = (
    scene: Phaser.Scene,
    layout: SpriteDescription,
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

    if (layout.hide) {
      sprite.setVisible(false);
    }

    return sprite;
  };

  public createText(
    scene: Phaser.Scene,
    layout: TextDescription,
  ): Phaser.GameObjects.Text {
    const textField = scene.add.text(layout.position.x, layout.position.y, '');

    if (layout.origin) {
      textField.setOrigin(layout.origin.x, layout.origin.y);
    }

    if (layout.fontSize) {
      textField.setFontSize(layout.fontSize);
    }

    if (layout.color) {
      textField.setColor(layout.color);
    }

    if (layout.fontFamily) {
      textField.setFontFamily(layout.fontFamily);
    }

    if (layout.stroke) {
      textField.setStroke(layout.stroke, 3);
    }

    if (layout.maxLines) {
      textField.setMaxLines(layout.maxLines);
    }

    if (layout.hide) {
      textField.setVisible(false);
    }

    if (layout.letterSpacing) {
      textField.setLetterSpacing(layout.letterSpacing);
    }

    if (layout.text) {
      textField.text = layout.text;
    }

    return textField;
  }
}

export const gameObjectFactory = new GameObjectFactory();
