import Container = Phaser.GameObjects.Container;
import { Shadow } from '../Shadow.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import { TurnType } from './RouletteView.ts';
import { EventBus } from '../../EventBus.ts';
import { UI_Event, UIElementName } from '../ui/constants.ts';

export class SwitchRoundTypeShadow extends Container {
  private shadow: Shadow;

  private currentRoundTypeText: Phaser.GameObjects.Text;

  constructor(private scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.create();
  }

  private create() {
    this.shadow = new Shadow(this.scene, 1);

    this.currentRoundTypeText = gameObjectFactory.createText(this.scene, {
      fontSize: 150,
      color: 'white',
      position: {
        x: 0,
        y: 0,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
    });

    this.shadow.setAlpha(0);
    this.currentRoundTypeText.setAlpha(0);

    this.add([this.shadow, this.currentRoundTypeText]);
  }

  public showTurn(
    turnType: TurnType,
    callBack: () => void,
    changeCylinder: () => void,
  ) {
    this.currentRoundTypeText.text = turnType;

    this.scene.tweens.add({
      targets: this.shadow,
      ease: Phaser.Math.Easing.Linear,
      duration: 1000,
      alpha: 1,
      onComplete: () => {
        changeCylinder();

        if (turnType === TurnType.PLAYER) {
          EventBus.emit(
            UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.ROULETTE_SHOOT,
          );
        }

        this.scene.tweens.add({
          targets: this.currentRoundTypeText,
          ease: Phaser.Math.Easing.Linear,
          duration: 500,
          alpha: 1,
          onComplete: () => {
            this.scene.tweens.add({
              delay: 500,
              targets: [this.shadow],
              ease: Phaser.Math.Easing.Linear,
              duration: 1000,
              alpha: 0,
              onStart: () => {
                this.scene.tweens.add({
                  targets: [this.currentRoundTypeText],
                  ease: Phaser.Math.Easing.Linear,
                  duration: 150,
                  alpha: 0,
                });
              },
              onComplete: () => {
                this.scene.time.delayedCall(100, () => {
                  callBack();
                });
              },
            });
          },
        });
      },
    });
  }
}
