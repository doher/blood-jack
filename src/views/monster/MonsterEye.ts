import type { Position } from '../../managers/game-object-factory/constants.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import { ImageLoadingKey } from '../../managers/game-object-factory/imageConstants.ts';
import { SoundLoadingKey } from '../../managers/sound-manager/constants.ts';
import { SoundManager } from '../../managers/sound-manager/SoundManager.ts';
import { MonsterObjectsId } from './constants.ts';

import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;

export class MonsterEye extends Container {
  private gameObjectsMap = new Map<string, Phaser.GameObjects.GameObject>();

  public eyeBack: Sprite;

  public eyeTop: Sprite;

  private maxDistance = 20;

  private eyeSpeed = 0.3;

  private eyeTopScaleWhenHover = 0.5;

  private eyeTopDefaultScale = 0.7;

  constructor(
    public scene: Phaser.Scene,
    position: Position,
  ) {
    super(scene, position.x, position.y);
    this.createGameObjects();
  }

  private createGameObjects() {
    this.eyeBack = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.EYE_BACK,
      position: {
        x: 0,
        y: 0,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
      scale: {
        x: 1,
        y: 0.8,
      },
    });
    this.eyeBack.setInteractive().on('pointerdown', () => this.eyeBlink());
    this.gameObjectsMap.set(MonsterObjectsId.EYE_BACK, this.eyeBack);

    this.eyeTop = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.EYE_TOP,
      position: {
        x: 0,
        y: 0,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });
    this.gameObjectsMap.set(MonsterObjectsId.EYE_TOP, this.eyeTop);
    this.rotation = 0.05;
    this.add([this.eyeBack, this.eyeTop]);
  }

  private eyeBlink() {
    SoundManager.getInstance().play(SoundLoadingKey.DEALER_CLICK, false, true);

    this.scene.tweens.add({
      targets: this,
      scaleY: 0.4,
      duration: 135,
      yoyo: true,
      repeat: 0,
      onComplete: () => {
        this.setScale(1);
      },
    });
  }

  public handlePlayerCursor() {
    const mouse = this.scene.input.activePointer;
    const irisCenter = new Phaser.Math.Vector2(950, 310);

    const toMouse = new Phaser.Math.Vector2(mouse.x, mouse.y).subtract(
      irisCenter,
    );

    if (toMouse.length() > 0) {
      const direction = toMouse.clone().normalize();
      const distance = Math.min(toMouse.length(), this.maxDistance);

      const edgeThreshold = 0.9;
      if (distance > this.maxDistance * edgeThreshold) {
        direction.scale(edgeThreshold);
      }

      const targetPosition = irisCenter.add(direction.scale(distance));

      const currentPosition = new Phaser.Math.Vector2(
        this.eyeTop.x,
        this.eyeTop.y,
      );
      const newPosition = currentPosition.lerp(targetPosition, this.eyeSpeed);

      const pupilPos = new Phaser.Math.Vector2(950, 310);
      const mousePos = new Phaser.Math.Vector2(mouse.x, mouse.y);
      const distanceEye = pupilPos.distance(mousePos);

      const mouseOnEye = distanceEye < 50;
      let noise = new Phaser.Math.Vector2(0, 0);
      if (mouseOnEye) {
        noise = new Phaser.Math.Vector2(
          Phaser.Math.Between(-1, 1),
          Phaser.Math.Between(-1, 1),
        );
      }
      this.eyeTop.setPosition(
        newPosition.x + noise.x - 286,
        newPosition.y + noise.y - 95,
      );

      const scaleEye = mouseOnEye
        ? this.eyeTopScaleWhenHover
        : this.eyeTopDefaultScale;
      this.eyeTop.scaleX = Phaser.Math.Linear(
        this.eyeTop.scaleX,
        scaleEye,
        0.1,
      );
      this.eyeTop.scaleY = Phaser.Math.Linear(
        this.eyeTop.scaleY,
        scaleEye,
        0.1,
      );
    }
  }
}
