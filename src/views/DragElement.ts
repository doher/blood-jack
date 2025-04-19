import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.GameObjects.Sprite;
import Pointer = Phaser.Input.Pointer;
import { Position } from '../managers/game-object-factory/constants.ts';
import { gameObjectFactory } from '../managers/game-object-factory/GameObjectFactory.ts';
import { ImageLoadingKey } from '../managers/game-object-factory/imageConstants.ts';
import { RouletteBulletsType } from '../actors/roulette/RouletteUI.ts';
import Container = Phaser.GameObjects.Container;

export class DragElement {
  protected isDragging = false;

  public sprite: Sprite;

  protected spriteDefaultPosition: Position;
  constructor(
    private scene: Phaser.Scene,
    private slots: Phaser.GameObjects.Arc[],
    private loadingKey: ImageLoadingKey,
    private frame: RouletteBulletsType,
    private position: Position,
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

  protected onStartDrag() {
    this.isDragging = true;
  }

  protected onDrag(gameObject: GameObject, dragX: number, dragY: number) {
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
    });

    for (let slotIndex = 0; slotIndex < this.slots.length; slotIndex += 1) {
      const slot = this.slots[slotIndex];

      const distance = Phaser.Math.Distance.Between(
        this.sprite.x,
        this.sprite.y,
        slot.x,
        slot.y,
      );

      console.log('this.sprite.x = ' + this.sprite.x);
      console.log('this.sprite.y = ' + this.sprite.y);
      console.log('slot.x = ' + slot.x);
      console.log('slot.y = ' + slot.y);

      console.log(distance);
      console.log(this.sprite.scaleY);
      console.log(slot.radius);
      console.log(this.sprite.scaleY + slot.radius);

      if (distance < this.sprite.scaleY + slot.radius) {
        this.sprite.x = slot.x;
        this.sprite.y = slot.y;
        this.completeDrag(true);
        return;
      }
    }
    this.completeDrag(false);
  }

  private completeDrag(isDragToSlot: boolean) {
    if (isDragToSlot) {
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

    console.log(this);

    this.scene.tweens.add({
      targets: this.sprite,
      x: this.spriteDefaultPosition.x,
      y: this.spriteDefaultPosition.y,
      duration: 500,
      ease: 'Power2',
    });
  }
}
