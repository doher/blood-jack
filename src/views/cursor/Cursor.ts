import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import { ImageLoadingKey } from '../../managers/game-object-factory/imageConstants.ts';
import { SHADOW_TAG } from '../Shadow.ts';

import Sprite = Phaser.GameObjects.Sprite;
import Container = Phaser.GameObjects.Container;
import GameObject = Phaser.GameObjects.GameObject;
import { EventBus } from '../../EventBus.ts';

type AvailableCursorTexture =
  | ImageLoadingKey.CURSOR_CLICK
  | ImageLoadingKey.CURSOR_POINT
  | ImageLoadingKey.CURSOR_IDLE;

const HAND_OFFSET_Y = 40;
const ARM_OFFSET_Y = 1620;

export const HIDE_CURSOR = 'HIDE_CURSOR';
export const HIDE__DEFAULT_CURSOR = 'HIDE__DEFAULT_CURSOR';
export class Cursor extends Container {
  private cursorHand: Sprite;

  private cursorArm: Sprite;

  private isPointer = false;

  constructor(public scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.create();
    EventBus.once(HIDE_CURSOR, () => {
      this.setVisible(false);
    });

    EventBus.once(HIDE__DEFAULT_CURSOR, () => {
      this.setVisible(true);
    });
  }

  private create() {
    this.scene.input.setDefaultCursor('none');

    this.cursorHand = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.CURSOR_IDLE,
      scale: {
        x: 1,
        y: 1,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
      position: {
        x: 0,
        y: HAND_OFFSET_Y,
      },
    });

    this.cursorArm = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.ARM,
      scale: {
        x: 1,
        y: 1,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
      position: {
        x: 0,
        y: ARM_OFFSET_Y,
      },
    });

    this.add([this.cursorArm, this.cursorHand]);
    this.scene.add.existing(this);

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.scene.input.on(
      'pointerdown',
      (_pointer: unknown, target: GameObject) => {
        this.changeCursorTexture(ImageLoadingKey.CURSOR_CLICK, target);
      },
    );

    this.scene.input.on(
      'pointerup',
      (_pointer: unknown, target: GameObject) => {
        if (this.isPointer) {
          this.changeCursorTexture(ImageLoadingKey.CURSOR_POINT, target);
          return;
        }
        this.changeCursorTexture(ImageLoadingKey.CURSOR_IDLE, target);
      },
    );

    this.scene.input.on(
      Phaser.Input.Events.GAMEOBJECT_OVER,
      (_pointer: unknown, target: GameObject) => {
        this.isPointer = this.changeCursorTexture(
          ImageLoadingKey.CURSOR_POINT,
          target,
        );
      },
    );

    this.scene.input.on(Phaser.Input.Events.GAMEOBJECT_OUT, () => {
      this.isPointer = false;
      this.changeCursorTexture(ImageLoadingKey.CURSOR_IDLE);
    });
  }

  private changeCursorTexture(
    textureKey: AvailableCursorTexture,
    target?: GameObject,
  ) {
    if (target?.name === SHADOW_TAG) {
      return false;
    }

    if (this.cursorHand.texture.key === textureKey) {
      return false;
    }

    this.cursorHand.setTexture(textureKey);
    return true;
  }

  public handlePlayerMouse() {
    const input = this.scene.input;
    this.setPosition(input.x, input.y);

    const mouseX = input.x;
    const mouseY = input.y;

    const angleArm = Phaser.Math.Angle.Between(0, 600, mouseX, mouseY);
    this.setRotation(angleArm);
  }
}
