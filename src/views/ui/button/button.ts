import { EventBus } from '../../../EventBus.ts';
import type {
  Position,
  Scale,
  TextDescription,
} from '../../../managers/game-object-factory/constants.ts';
import { gameObjectFactory } from '../../../managers/game-object-factory/GameObjectFactory.ts';
import type { UiControlsFrame } from '../../../managers/game-object-factory/imageConstants.ts';
import { ImageLoadingKey } from '../../../managers/game-object-factory/imageConstants.ts';
import type { SoundLoadingKey } from '../../../managers/sound-manager/constants.ts';
import { SoundManager } from '../../../managers/sound-manager/SoundManager.ts';
import { UI_Event } from '../constants.ts';
import { UiElement } from '../uiElement.ts';

import Text = Phaser.GameObjects.Text;
import Sprite = Phaser.GameObjects.Sprite;

export const LOW_CLICK_SPEED = 100;
export const FAST_CLICK_SPEED = 35;

export class Button extends UiElement {
  public background: Sprite;

  public textField: Text;

  public isControlsEnabled = true;

  private isClicked = false;

  constructor(
    public scene: Phaser.Scene,
    private buttonPosition: Position,
    private frame: UiControlsFrame,
    private buttonScale: Scale,
    private buttonName: string,
    textDescription?: TextDescription,
    private clickSpeed = FAST_CLICK_SPEED,
    private clickSound?: SoundLoadingKey,
    usePreFx?: boolean,
  ) {
    super(scene, buttonPosition);
    this.create(textDescription, usePreFx);
    this.setupEventListeners();
  }

  private create(textDescription?: TextDescription, usePreFx?: boolean) {
    this.background = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.UI_CONTROLS,
      frame: this.frame,
      position: {
        x: 0,
        y: 0,
      },
    });
    this.add(this.background);

    if (textDescription) {
      this.textField = gameObjectFactory.createText(
        this.scene,
        textDescription,
      );

      if (usePreFx) {
        this.background.preFX?.addShine(0.5, 0.5, 6);
      }

      this.add(this.textField);
    }

    this.setScale(this.buttonScale.x, this.buttonScale.y);
    this.setPosition(this.buttonPosition.x, this.buttonPosition.y);
  }

  private setupEventListeners() {
    this.background
      .setInteractive()
      .on('pointerdown', () => this.onClickEffect());

    EventBus.on(UI_Event.DISABLE_ALL_BUTTONS, this.handleControls, this);

    EventBus.on(
      UI_Event.UPDATE_TEXT_AT_ELEMENT_ + this.buttonName,
      this.handleTextUpdate,
      this,
    );

    const disableEvent = UI_Event.DISABLE_UI_ELEMENT_ + this.buttonName;
    EventBus.on(disableEvent, this.handleButtonDisable, this);

    const enableEvent = UI_Event.ENABLE_UI_ELEMENT_ + this.buttonName;
    EventBus.on(enableEvent, this.handleButtonEnable, this);
  }

  private handleControls() {
    this.isControlsEnabled = !this.isControlsEnabled;
  }

  public handleButtonDisable(immediately?: boolean) {
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

  public handleButtonEnable() {
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

  private handleTextUpdate(newText: string) {
    this.textField.setText(newText);
    this.onChangeButtonText();
  }

  private onChangeButtonText() {
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

  private onClickEffect() {
    if (this.isClicked) {
      return;
    }

    this.isClicked = true;

    if (!this.isControlsEnabled) {
      return;
    }

    if (!this.isActive) {
      return;
    }

    this.scene.tweens.add({
      targets: this,
      scale: {
        from: this.buttonScale.x,
        to: this.buttonScale.x + this.buttonScale.x / 12,
      },
      ease: Phaser.Math.Easing.Cubic.InOut,
      yoyo: true,
      duration: this.clickSpeed,
      onStart: () => {
        if (this.clickSound) {
          SoundManager.getInstance().play(this.clickSound, false, true);
        }
        this.scene.time.delayedCall(this.clickSpeed / 2, () =>
          EventBus.emit(this.buttonName),
        );
      },
      onComplete: () => {
        this.isClicked = false;
      },
    });
  }
}
