import type { Position } from '../../managers/game-object-factory/constants.ts';

import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;

export class UiElement extends Container {
  public isActive = true;

  public textField: Text;

  constructor(
    public scene: Phaser.Scene,
    UiElementPosition: Position,
  ) {
    super(scene, UiElementPosition.x, UiElementPosition.y);
  }

  public handleDisable(immediately?: boolean): void {
    this.isActive = false;

    if (immediately) {
      this.setVisible(this.isActive);
      return;
    }

    this.scene.add.tween({
      targets: this,
      duration: 150,
      alpha: {
        from: 1,
        to: 0,
      },
      ease: Phaser.Math.Easing.Expo.In,
      onComplete: () => {
        this.setVisible(this.isActive);
      },
    });
  }

  public handleEnable() {
    this.setVisible(true);

    this.scene.add.tween({
      targets: this,
      duration: 150,
      alpha: 1,
      ease: Phaser.Math.Easing.Expo.In,
      onComplete: () => {
        this.isActive = true;
      },
    });
  }

  public handleTextUpdate(newText: string) {
    this.textField.setText(newText);
    this.onChangeText();
  }

  private onChangeText(): void {
    this.scene.tweens.add({
      targets: this.textField,
      scale: {
        from: 1,
        to: 1.1,
      },
      ease: Phaser.Math.Easing.Cubic.InOut,
      yoyo: true,
      duration: 100,
    });
  }
}
