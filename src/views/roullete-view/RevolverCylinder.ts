import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;
import { DragBullet } from './DragBullet.ts';
import { RouletteBulletsType } from '../../actors/roulette/RouletteUI.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import {
  ImageLoadingKey,
  RouletteFrame,
} from '../../managers/game-object-factory/imageConstants.ts';
import { Position } from '../../managers/game-object-factory/constants.ts';
import { EventBus } from '../../EventBus.ts';
import { RouletteEvent } from './constants.ts';

const BULLETS_POSITION: Position = {
  x: 0,
  y: 0,
};

const SLOTS_POSITION: Position[] = [
  {
    x: 80,
    y: 210,
  },
  {
    x: -115,
    y: 198,
  },
  {
    x: -222,
    y: 36,
  },
  {
    x: -162,
    y: -153,
  },
  {
    x: 21,
    y: -223,
  },
  {
    x: 190,
    y: -126,
  },
  {
    x: 217,
    y: 67,
  },
];

export const enum SlotElementName {
  EMPTY = 'EMPTY',
  FILL = 'FILL',
}

export const enum DataKey {
  LOADED_TO = 'LOADED_TO',
  INDEX = 'INDEX',
  TYPE = 'TYPE',
  DEALER_TYPE = 'DEALER_TYPE',
}

export class RevolverCylinder extends Container {
  public drumBackground: Sprite;

  public dragBullets: DragBullet[] = [];

  private bulletsContainer: Container;

  private slots: Phaser.GameObjects.Arc[] = [];

  public readyRevolverCylinderHolder: Container;

  private isDraggingRevolverCylinder = false;

  private startAngle = 0;

  private lastAngle = 0;

  private startRotation = 0;

  private rotationSpeedFactor = 10;

  private skull: Sprite;

  private loadedSlot: Map<number, SlotElementName> = new Map<
    number,
    SlotElementName
  >();

  constructor(
    private scene: Phaser.Scene,
    drumPosition: Position,
  ) {
    super(scene, drumPosition.x, drumPosition.y);
    this.create();
    this.setupEventListeners();
    this.scene.add.existing(this);
  }

  public startShootRotation(targetAngel: number) {
    this.scene.tweens.add({
      targets: this.readyRevolverCylinderHolder,
      angle: 360 * 10 + targetAngel,
      duration: 3800,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        console.log('RouletteEvent.SHOOT');
        EventBus.emit(RouletteEvent.SHOOT);
      },
    });
  }

  public showDealerCylinder(angle: number) {
    this.readyRevolverCylinderHolder.angle = angle;
    this.dragBullets.forEach((dragBullet) => {
      const textureFrame = dragBullet.sprite.getData(DataKey.DEALER_TYPE);
      dragBullet.sprite.setTexture(ImageLoadingKey.ROULETTE_UI, textureFrame);
    });
  }

  public showPlayerCylinder(angle: number) {
    this.readyRevolverCylinderHolder.angle = angle;
    this.dragBullets.forEach((dragBullet) => {
      const textureFrame = dragBullet.sprite.getData(DataKey.TYPE);
      dragBullet.sprite.setTexture(ImageLoadingKey.ROULETTE_UI, textureFrame);
    });
  }

  private create() {
    this.drumBackground = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.ROULETTE_UI,
      frame: RouletteFrame.DRUM,
      position: {
        x: 0,
        y: 0,
      },
      scale: {
        x: 5,
        y: 5,
      },
    });

    this.skull = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.ROULETTE_UI,
      frame: RouletteFrame.SKULL_INDICATOR,
      position: {
        x: 0,
        y: -350,
      },
      scale: {
        x: 0.8,
        y: 0.8,
      },
    });

    this.readyRevolverCylinderHolder = this.scene.add.container(0, 0);
    this.readyRevolverCylinderHolder.name = 'ReadyDrumHolder';
    this.readyRevolverCylinderHolder.add(this.drumBackground);
    this.add([this.readyRevolverCylinderHolder, this.skull]);
  }

  private setupEventListeners() {
    this.drumBackground.setInteractive();
    this.drumBackground.on(
      'pointerdown',
      () => {
        this.isDraggingRevolverCylinder = true;
        this.startAngle = Phaser.Math.Angle.Between(
          this.drumBackground.x,
          this.drumBackground.y,
          this.scene.input.activePointer.x,
          this.scene.input.activePointer.y,
        );

        this.startRotation = this.drumBackground.rotation;
      },
      this,
    );

    this.scene.input.on(
      'pointerup',
      () => {
        this.isDraggingRevolverCylinder = false;
      },
      this,
    );

    EventBus.on(RouletteEvent.FILL_SLOT, this.fillSlot, this);
    EventBus.on(RouletteEvent.UN_FILL_SLOT, this.unFillSlot, this);
  }

  private fillSlot(numberOfSlot: number) {
    this.loadedSlot.set(numberOfSlot, SlotElementName.FILL);
    this.slots[numberOfSlot].setName(SlotElementName.FILL);
    this.checkFullDrum();
  }

  private unFillSlot(numberOfSlot: number, sprite: Phaser.GameObjects.Arc) {
    sprite.setData(DataKey.LOADED_TO, -1);
    this.loadedSlot.set(numberOfSlot, SlotElementName.EMPTY);
    this.slots[numberOfSlot].setName(SlotElementName.EMPTY);
    this.checkFullDrum();
  }

  private checkFullDrum() {
    let currentLoadedSlots = 0;

    this.loadedSlot.forEach((slot) => {
      if (slot === SlotElementName.FILL) {
        currentLoadedSlots += 1;
      }
    });

    console.log(currentLoadedSlots);
    console.log(SLOTS_POSITION.length);
    if (currentLoadedSlots === SLOTS_POSITION.length) {
      this.dragBullets.forEach((dragBullet) => {
        dragBullet.sprite.disableInteractive();
      });
      EventBus.emit(RouletteEvent.FULL_DRUM_LOADED);
    }
  }

  public handleDrumRotateByPlayer() {
    if (this.isDraggingRevolverCylinder) {
      const pointer = this.scene.input.activePointer;

      const currentAngle = Phaser.Math.Angle.Between(
        this.drumBackground.x,
        this.drumBackground.y,
        pointer.x,
        pointer.y,
      );

      const angleChange = currentAngle - this.lastAngle;
      this.rotationSpeedFactor = Phaser.Math.Clamp(
        Math.abs(angleChange) * 10,
        1,
        3,
      );

      const angleDelta =
        (currentAngle - this.startAngle) * this.rotationSpeedFactor;

      this.readyRevolverCylinderHolder.rotation +=
        (this.startRotation + angleDelta) / 15;
      this.readyRevolverCylinderHolder.rotation = Phaser.Math.Angle.Normalize(
        this.readyRevolverCylinderHolder.rotation,
      );

      this.lastAngle = currentAngle;
    }
  }

  private createSlots(
    container: Phaser.GameObjects.Container,
  ): Phaser.GameObjects.Arc[] {
    const slots: Phaser.GameObjects.Arc[] = [];

    for (let slotIndex = 0; slotIndex < SLOTS_POSITION.length; slotIndex += 1) {
      const slotPosition = SLOTS_POSITION[slotIndex];
      const slot = this.scene.add.circle(
        slotPosition.x,
        slotPosition.y,
        65,
        0x6666ff,
      );
      slot.setData(DataKey.INDEX, slotIndex);
      slot.setName(SlotElementName.EMPTY);
      this.loadedSlot.set(slotIndex, SlotElementName.EMPTY);
      slot.setVisible(false);
      slots.push(slot);
      container.add(slot);
    }

    return slots;
  }

  public showPlayerBullets(
    playerBulletsFrames: RouletteBulletsType[],
    dealerBulletsFrames: RouletteBulletsType[],
  ) {
    this.bulletsContainer = this.scene.add.container(
      BULLETS_POSITION.x,
      BULLETS_POSITION.y,
    );

    this.slots = this.createSlots(this.readyRevolverCylinderHolder);

    playerBulletsFrames.forEach((playerBulletsFrame, index) => {
      this.createDragBullet(
        playerBulletsFrame,
        dealerBulletsFrames[index],
        index,
        this.readyRevolverCylinderHolder,
      );
    });

    this.add(this.bulletsContainer);
  }

  private createDragBullet(
    playerBulletsFrame: RouletteBulletsType,
    dealerBulletsFrame: RouletteBulletsType,
    index,
    newContainerIfDragComplete: Container,
  ) {
    let xOffset = 200;

    const bulletPosition = -600 + index * xOffset;

    const dragBullet = new DragBullet(
      this.scene,
      this.slots,
      playerBulletsFrame,
      {
        x: bulletPosition,
        y: 525,
      },
      this.bulletsContainer,
      newContainerIfDragComplete,
    );
    dragBullet.sprite.setData(DataKey.TYPE, playerBulletsFrame);
    dragBullet.sprite.setData(DataKey.DEALER_TYPE, dealerBulletsFrame);
    dragBullet.sprite.setScale(0.3, 0.3);
    this.dragBullets.push(dragBullet);
  }
}
