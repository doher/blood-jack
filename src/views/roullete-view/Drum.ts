import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;
import { DragBullet } from './DragBullet.ts';
import {
  RouletteBulletsType,
  RouletteUI,
} from '../../actors/roulette/RouletteUI.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import {
  ImageLoadingKey,
  RouletteFrame,
} from '../../managers/game-object-factory/imageConstants.ts';
import { Position } from '../../managers/game-object-factory/constants.ts';
import { SCREEN_HALF_H } from '../constants.ts';

const BULLETS_POSITION: Position = {
  x: 0,
  y: 0,
};

const SLOTS_POSITION: Position[] = [
  {
    x: 72,
    y: 222,
  },
  {
    x: -123,
    y: 210,
  },
  {
    x: -230,
    y: 46,
  },
  {
    x: -170,
    y: -143,
  },
  {
    x: 13,
    y: -214,
  },
  {
    x: 181,
    y: -114,
  },
  {
    x: 209,
    y: 79,
  },
];

export class Drum extends Container {
  private drumBackground: Sprite;

  private isFullLoad = false;

  private dragBullets: DragBullet[] = [];

  private bulletsContainer: Container;

  private slots: Phaser.GameObjects.Arc[] = [];

  private readyDrumHolder: Container;

  private isDraggingDrum = false;

  private startAngle = 0;

  private lastAngle = 0;

  private startRotation = 0;

  private rotationSpeedFactor = 10;

  constructor(
    private scene: Phaser.Scene,
    drumPosition: Position,
  ) {
    super(scene, drumPosition.x, drumPosition.y);
    this.create();
    this.setupEventListeners();
    this.scene.add.existing(this);
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

    this.readyDrumHolder = this.scene.add.container(0, 0);
    this.readyDrumHolder.add(this.drumBackground);
    this.add(this.readyDrumHolder);
  }

  private setupEventListeners() {
    this.drumBackground.setInteractive();
    this.drumBackground.on(
      'pointerdown',
      () => {
        this.isDraggingDrum = true;
        this.startAngle = Phaser.Math.Angle.Between(
          this.drumBackground.x,
          this.drumBackground.y,
          this.scene.input.activePointer.x,
          this.scene.input.activePointer.y,
        );
        // Запоминаем текущее вращение спрайта
        this.startRotation = this.drumBackground.rotation;
      },
      this,
    );

    this.scene.input.on(
      'pointerup',
      () => {
        this.isDraggingDrum = false;
      },
      this,
    );
  }

  public handleDrumRotateByPlayer() {
    if (this.isDraggingDrum) {
      // Получаем позицию мыши
      const pointer = this.scene.input.activePointer;

      // Вычисляем угол между центром спрайта и позицией мыши
      const currentAngle = Phaser.Math.Angle.Between(
        this.drumBackground.x,
        this.drumBackground.y,
        pointer.x,
        pointer.y,
      );

      /// Вычисляем скорость движения мыши
      var angleChange = currentAngle - this.lastAngle;
      this.rotationSpeedFactor = Phaser.Math.Clamp(
        Math.abs(angleChange) * 10,
        1,
        3,
      );

      var angleDelta =
        (currentAngle - this.startAngle) * this.rotationSpeedFactor;
      // this.drumBackground.rotation = this.startRotation + angleDelta;
      // this.drumBackground.rotation = Phaser.Math.Angle.Normalize(
      //   this.drumBackground.rotation,
      // );

      this.readyDrumHolder.rotation = this.startRotation + angleDelta;
      this.readyDrumHolder.rotation = Phaser.Math.Angle.Normalize(
        this.readyDrumHolder.rotation,
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
      slots.push(slot);
      container.add(slot);
    }

    return slots;
  }

  public showPlayerBullets(playerBulletsFrames: RouletteBulletsType[]) {
    this.bulletsContainer = this.scene.add.container(
      BULLETS_POSITION.x,
      BULLETS_POSITION.y,
    );

    this.slots = this.createSlots(this.readyDrumHolder);

    playerBulletsFrames.forEach((playerBulletsFrame, index) => {
      this.createDragBullet(playerBulletsFrame, index, this.readyDrumHolder);
    });

    this.add(this.bulletsContainer);
  }

  private createDragBullet(
    playerBulletsFrame: RouletteBulletsType,
    index,
    newContainerIfDragComplete: Container,
  ) {
    let xOffset = 200;

    const bulletPosition = -505 + index * xOffset;

    const dragBullet = new DragBullet(
      this.scene,
      this.slots,
      playerBulletsFrame,
      {
        x: bulletPosition,
        y: 525,
      },
      newContainerIfDragComplete,
    );
    dragBullet.sprite.setScale(0.3, 0.3);
    this.bulletsContainer.add(dragBullet.sprite);
    this.dragBullets.push(dragBullet);
  }
}
