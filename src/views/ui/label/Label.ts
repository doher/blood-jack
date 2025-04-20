import { EventBus } from '../../../EventBus.ts';
import type {
  Position,
  Scale,
  TextDescription,
} from '../../../managers/game-object-factory/constants.ts';
import { gameObjectFactory } from '../../../managers/game-object-factory/GameObjectFactory.ts';
import type { UiControlsFrame } from '../../../managers/game-object-factory/imageConstants.ts';
import { ImageLoadingKey } from '../../../managers/game-object-factory/imageConstants.ts';
import { UI_Event } from '../constants.ts';
import { UiElement } from '../UiElement.ts';

import Sprite = Phaser.GameObjects.Sprite;

export class Label extends UiElement {
  public background: Sprite;

  constructor(
    public scene: Phaser.Scene,
    private labelPosition: Position,
    private frame: UiControlsFrame,
    private labelScale: Scale,
    private labelName: string,
    private textDescription: TextDescription,
    usePreFx?: boolean,
    private additionalSprite?: Sprite,
    private additionalSpritePosition?: Position,
    private backgroundAdditional?: Sprite,
  ) {
    super(scene, labelPosition);
    this.create(usePreFx);
    this.setupEventListeners();
  }

  private create(usePreFx?: boolean) {
    if (this.backgroundAdditional) {
      this.add(this.backgroundAdditional);
    }

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

    if (this.additionalSprite && this.additionalSpritePosition) {
      this.add(this.additionalSprite);
      this.additionalSprite.setPosition(
        this.additionalSpritePosition.x,
        this.additionalSpritePosition.y,
      );
    }

    this.add(this.textField);

    this.setScale(this.labelScale.x, this.labelScale.y);
    this.setPosition(this.labelPosition.x, this.labelPosition.y);
  }

  private setupEventListeners() {
    EventBus.on(
      UI_Event.UPDATE_TEXT_AT_ELEMENT_ + this.labelName,
      this.handleTextUpdate,
      this,
    );

    const disableEvent = UI_Event.DISABLE_UI_ELEMENT_ + this.labelName;
    EventBus.on(disableEvent, this.handleDisable, this);

    const enableEvent = UI_Event.ENABLE_UI_ELEMENT_ + this.labelName;
    EventBus.on(enableEvent, this.handleEnable, this);
  }
}
