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

import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;
import Sprite = Phaser.GameObjects.Sprite;
import { SoundLoadingKey } from '../../managers/sound-manager/constants.ts';
import { SoundManager } from '../../managers/sound-manager/SoundManager.ts';

export const LOW_CLICK_SPEED = 120;
export const FAST_CLICK_SPEED = 35;

export class Button extends Container {
  public background: Sprite;

  public textField: Text;

  public isActive = true;

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
    super(scene, buttonPosition.x, buttonPosition.y);
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

    EventBus.on(UIEvent.DISABLE_ALL_BUTTONS, this.handleControls, this);

    EventBus.on(
      UIEvent.UPDATE_TEXT_AT_ELEMENT_ + this.buttonName,
      this.handleTextUpdate,
      this,
    );

    const disableEvent = UIEvent.DISABLE_BUTTON_ + this.buttonName;
    EventBus.on(disableEvent, this.handleButtonDisable, this);

    const enableEvent = UIEvent.ENABLE_BUTTON_ + this.buttonName;
    EventBus.on(enableEvent, this.handleButtonEnable, this);
  }

  private handleControls() {
    this.isControlsEnabled = !this.isControlsEnabled;
    console.log('this.isControlsEnabled = ' + this.isControlsEnabled);
  }

  private handleButtonDisable() {
    this.isActive = false;
    this.setVisible(this.isActive);
    console.log('handleButtonDisable = ' + this.isActive);
  }

  private handleButtonEnable() {
    this.isActive = true;
    this.setVisible(this.isActive);
    console.log('handleButtonEnable = ' + this.isActive);
  }

  private handleTextUpdate(newText: string) {
    this.textField.setText(newText);
    this.onChangeButtonText();
    console.log('handleTextUpdate = ' + newText);
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

    console.log('Click = ' + this.buttonName);

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
        EventBus.emit(this.buttonName);
      },
      onComplete: () => {
        this.isClicked = false;
      },
    });
  }
}
