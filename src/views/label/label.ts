import { UIEvent } from '../../actors/player-ui/PlayerUI.ts';
import { EventBus } from '../../EventBus.ts';
import type {
  Position,
  Scale,
  TextDescription,
} from '../../managers/game-object-factory/constants.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import type { UiControlsFrame } from '../../managers/game-object-factory/imageConstants.ts';
import { ImageLoadingKey } from '../../managers/game-object-factory/imageConstants.ts';

import Sprite = Phaser.GameObjects.Sprite;
import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;

export class Label extends Container {
  public background: Sprite;

  public textField: Text;

  constructor(
    public scene: Phaser.Scene,
    private labelPosition: Position,
    private frame: UiControlsFrame,
    private labelScale: Scale,
    private labelName: string,
    private textDescription: TextDescription,
    usePreFx?: boolean,
  ) {
    super(scene, labelPosition.x, labelPosition.y);
    this.create(usePreFx);
    this.setupEventListeners();
  }

  private create(usePreFx?: boolean) {
    this.background = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.UI_CONTROLS,
      frame: this.frame,
      position: {
        x: 0,
        y: 0,
      },
    });
    this.add(this.background);

    this.textField = gameObjectFactory.createText(
      this.scene,
      this.textDescription,
    );

    if (usePreFx) {
      this.background.preFX?.addShine(0.5, 0.5, 6);
    }

    this.add(this.textField);

    this.setScale(this.labelScale.x, this.labelScale.y);
    this.setPosition(this.labelPosition.x, this.labelPosition.y);
  }

  private setupEventListeners() {
    EventBus.on(
      UIEvent.UPDATE_TEXT_AT_ELEMENT_ + this.labelName,
      this.handleTextUpdate,
      this,
    );
  }

  private handleTextUpdate(newText: string) {
    this.textField.setText(newText);
    this.onChangeText();
    console.log('handleTextUpdate = ' + newText);
  }

  private onChangeText() {
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
