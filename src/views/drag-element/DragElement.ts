import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.GameObjects.Sprite;
import Pointer = Phaser.Input.Pointer;
import { Position } from '../../managers/game-object-factory/constants.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import { ImageLoadingKey } from '../../managers/game-object-factory/imageConstants.ts';
import { RouletteBulletsType } from '../../actors/roulette/RouletteUI.ts';
import Container = Phaser.GameObjects.Container;
import { EventBus } from '../../EventBus.ts';
import { RouletteEvent } from '../roullete-view/constants.ts';
import { DataKey, SlotElementName } from '../roullete-view/RevolverCylinder.ts';

const enum DragElementName {
  IDLE = 'IDLE',
  IN_SLOT = 'IN_SLOT',
}

export class DragElement {
  public sprite: Sprite;

  protected isDragging = false;

  protected spriteDefaultPosition: Position;

  protected isDragCompleteToSlot = false;

  protected isTweenSetupComplete = false;

  private firstParentContainer: Container;

  constructor(
    private scene: Phaser.Scene,
    private slots: Phaser.GameObjects.Arc[],
    private loadingKey: ImageLoadingKey,
    private frame: RouletteBulletsType,
    private position: Position,
    private firstParentContainer: Container,
    private newContainerIfDragComplete?: Container,
  ) {
    this.create();
    this.initDragElement();
    this.setupEventListeners();
  }

  protected create() {
    this.sprite = gameObjectFactory.createSprite(this.scene, {
      key: this.loadingKey,
      frame: this.frame,
      position: {
        x: this.position.x,
        y: this.position.y,
      },
    });
    this.firstParentContainer.add(this.sprite);
  }

  protected initDragElement() {
    this.spriteDefaultPosition = {
      x: this.sprite.x,
      y: this.sprite.y,
    };
    this.sprite.setInteractive();
    this.scene.input.setDraggable(this.sprite);
  }

  protected setupEventListeners() {
    this.sprite.on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
      () => {
        if (this.isDragCompleteToSlot) {
          this.setToIdleStatePointerDown();
        }
      },
      this,
    );

    this.sprite.on(
      Phaser.Input.Events.GAMEOBJECT_POINTER_OVER,
      () => {
        if (this.isDragCompleteToSlot) {
          this.setToIdleStatePointerOver();
        }
      },
      this,
    );

    this.sprite.on(Phaser.Input.Events.DRAG_START, this.onStartDrag, this);
    this.scene.input.on(
      Phaser.Input.Events.DRAG,
      (
        pointer: Pointer,
        gameObject: GameObject,
        dragX: number,
        dragY: number,
      ) => this.onDrag(gameObject, dragX, dragY),
      this,
    );
    this.sprite.on(Phaser.Input.Events.DRAG_END, this.onStopDrag, this);
  }

  private setToIdleStatePointerDown() {
    this.firstParentContainer.add(this.sprite);
    this.sprite.x = this.spriteDefaultPosition.x;
    this.sprite.y = this.spriteDefaultPosition.y;
    this.scene.time.delayedCall(500, () => {});
  }

  private setToIdleStatePointerOver() {}

  protected onStartDrag() {
    this.isDragging = true;
  }

  protected onDrag(gameObject: GameObject, dragX: number, dragY: number) {
    if (gameObject.name === DragElementName.IN_SLOT) {
      return;
    }

    (gameObject as Sprite).x = dragX;
    (gameObject as Sprite).y = dragY;
  }

  protected onStopDrag() {
    this.isDragging = false;

    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        if (this.isDragCompleteToSlot) {
          if (this.isTweenSetupComplete) {
            this.scene.time.delayedCall(50, () => {
              this.isTweenSetupComplete = false;
              this.isDragCompleteToSlot = false;
              this.sprite.setName(DragElementName.IDLE);
              const slotIndex = this.sprite.getData(DataKey.LOADED_TO);
              EventBus.emit(RouletteEvent.UN_FILL_SLOT, slotIndex, this.sprite);
            });
          }
          this.isTweenSetupComplete = true;
        }
      },
    });

    for (let slotIndex = 0; slotIndex < this.slots.length; slotIndex += 1) {
      const slot = this.slots[slotIndex];

      let distance = Phaser.Math.Distance.Between(
        this.sprite.x,
        this.sprite.y,
        slot.x,
        slot.y,
      );

      if (this.newContainerIfDragComplete) {
        const container = this.newContainerIfDragComplete;
        const containerAngle = -container.rotation;
        const containerScale = container.scale;

        const offsetX = (this.sprite.x - container.x) * containerScale;
        const offsetY = (this.sprite.y - container.y) * containerScale;

        const rotatedX =
          container.x +
          offsetX * Math.cos(containerAngle) -
          offsetY * Math.sin(containerAngle);
        const rotatedY =
          container.y +
          offsetX * Math.sin(containerAngle) +
          offsetY * Math.cos(containerAngle);

        distance = Phaser.Math.Distance.Between(
          rotatedX,
          rotatedY,
          slot.x,
          slot.y,
        );
      }

      if (distance < this.sprite.scaleY + slot.radius) {
        if (slot.name === SlotElementName.FILL) {
          this.completeDrag(false);
          return;
        }

        const slotIndex = slot.getData(DataKey.INDEX);

        this.sprite.x = slot.x;
        this.sprite.y = slot.y;
        this.sprite.setData(DataKey.LOADED_TO, slotIndex);
        console.log('DEV+LOAD+TO INDEX = ', slotIndex);

        EventBus.emit(RouletteEvent.FILL_SLOT, slotIndex);
        this.completeDrag(true);
        return;
      }
    }
    this.completeDrag(false);
  }

  private completeDrag(isDragToSlot: boolean) {
    if (!this.firstParentContainer) {
      this.firstParentContainer = this.sprite.parentContainer;
    }

    if (isDragToSlot) {
      this.setUpToSlot();
      if (this.newContainerIfDragComplete) {
        this.newContainerIfDragComplete.add(this.sprite);
      }
      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 200,
        yoyo: true,
        onComplete: () => {
          this.sprite.setScale(0.3);
        },
      });
      return;
    }

    this.firstParentContainer.add(this.sprite);

    this.sprite.x = this.spriteDefaultPosition.x;
    this.sprite.y = this.spriteDefaultPosition.y;
  }

  private setUpToSlot() {
    this.isDragCompleteToSlot = true;
    this.sprite.setName(DragElementName.IN_SLOT);
  }
}
