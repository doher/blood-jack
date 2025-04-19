import Container = Phaser.GameObjects.Container;
import { BulletsSideView, ShopBulletsType } from './BulletsSideView.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../constants.ts';
import { ScaleBalance } from './ScaleBalance.ts';
import { Shadow, SHADOW_TAG } from '../Shadow.ts';
import { Button, LOW_CLICK_SPEED } from '../ui/button/button.ts';
import { Label } from '../ui/label/label.ts';
import {
  ImageLoadingKey,
  UiControlsFrame,
} from '../../managers/game-object-factory/imageConstants.ts';
import { UIElementName } from '../ui/constants.ts';
import { SoundLoadingKey } from '../../managers/sound-manager/constants.ts';
import {
  INFO_BULLET_START_POSITION,
  SHOP_BACK_BUTTON_POSITION,
  SHOP_BUY_BAD_BUTTON_POSITION,
  SHOP_BUY_GOOD_BUTTON_POSITION,
  SHOP_BUY_SO_SO_BUTTON_POSITION,
  SHOP_CANCEL_BUTTON_POSITION,
  SHOP_SUBMIT_BUTTON_POSITION,
} from './constants.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';

export const SCALE_TYPES = [
  [ShopBulletsType.RED, ShopBulletsType.RED, ShopBulletsType.YELLOW],
  [ShopBulletsType.RED, ShopBulletsType.GREEN, ShopBulletsType.YELLOW],
  [ShopBulletsType.GREEN, ShopBulletsType.GREEN, ShopBulletsType.YELLOW],
];

export const SCALE_EVENTS = [
  UIElementName.SHOP_BUY_BAD,
  UIElementName.SHOP_BUY_SO_SO,
  UIElementName.SHOP_BUY_GOOD,
];

const SCALES_OFFSET_X = [-650, 0, 650];
const SCALES_POSITION_Y = -260;

type InfoLabelType = {
  type: ShopBulletsType;
  text: string;
  backType:
    | UiControlsFrame.GREEN_BUTTON
    | UiControlsFrame.RED_BUTTON
    | UiControlsFrame.YELLOW_BUTTON;
  textColor: string;
};

const INFO_LABELS_TYPES: InfoLabelType[] = [
  {
    type: ShopBulletsType.RED,
    text: 'LIVE',
    backType: UiControlsFrame.RED_BUTTON,
    textColor: 'red',
  },
  {
    type: ShopBulletsType.YELLOW,
    text: '???',
    backType: UiControlsFrame.YELLOW_BUTTON,
    textColor: 'black',
  },
  {
    type: ShopBulletsType.GREEN,
    text: 'BLANK',
    backType: UiControlsFrame.GREEN_BUTTON,
    textColor: 'green',
  },
];

export class ShopView extends Container {
  private shadow: Shadow;

  private scaleBalances: ScaleBalance[] = [];

  private backButton: Button;

  private buyBad: Button;

  private buySoSo: Button;

  private buyGood: Button;

  private submit: Button;

  private cancel: Button;

  constructor(private scene: Phaser.Scene) {
    super(scene, SCREEN_HALF_W, SCREEN_HALF_H);
    this.create();
  }

  private create() {
    // this.shadow = new Shadow(this.scene);
    // this.add(this.shadow);

    this.createBackground();

    SCALE_TYPES.forEach((scaleType, index) => {
      const xOffset = SCALES_OFFSET_X[index];
      const triggerEvent = SCALE_EVENTS[index];
      const scaleBalance = new ScaleBalance(
        this.scene,
        {
          x: xOffset,
          y: SCALES_POSITION_Y,
        },
        scaleType,
        index,
        triggerEvent,
      );
      this.add(scaleBalance);
      this.scaleBalances.push(scaleBalance);
    });

    this.createButtons();
    this.createInfoLabels();

    this.scene.add.existing(this);
  }

  resetShopView() {
    this.scaleBalances.forEach((scaleBalance) => {
      scaleBalance.reset();
    });
  }

  private createBackground() {
    const background = gameObjectFactory.createSprite(this.scene, {
      key: ImageLoadingKey.SHOP_BACKGROUND,
      position: {
        x: 0,
        y: 0,
      },
      scale: {
        x: 1,
        y: 1.08,
      },
    });
    background.setTint(0xcccccc);
    background.setInteractive();
    background.setName(SHADOW_TAG);
    this.add(background);
  }

  private createButtons() {
    this.backButton = new Button(
      this.scene,
      SHOP_BACK_BUTTON_POSITION,
      UiControlsFrame.GRAY_BUTTON,
      {
        x: 0.8,
        y: 0.8,
      },
      UIElementName.SHOP_BACK,
      {
        text: 'BACK.(ESC)',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 45,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.STAND,
    );

    this.cancel = new Button(
      this.scene,
      SHOP_CANCEL_BUTTON_POSITION,
      UiControlsFrame.RED_BUTTON,
      {
        x: 0.6,
        y: 0.6,
      },
      UIElementName.SHOP_CANCEL,
      {
        text: 'CANCEL',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 60,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.STAND,
    );

    this.submit = new Button(
      this.scene,
      SHOP_SUBMIT_BUTTON_POSITION,
      UiControlsFrame.GREEN_BUTTON,
      {
        x: 0.6,
        y: 0.6,
      },
      UIElementName.SHOP_SUBMIT,
      {
        text: 'SUBMIT',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 60,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.STAND,
    );

    this.buyBad = new Button(
      this.scene,
      SHOP_BUY_BAD_BUTTON_POSITION,
      UiControlsFrame.RED_BUTTON,
      {
        x: 0.6,
        y: 0.6,
      },
      UIElementName.SHOP_BUY_BAD,
      {
        text: 'BUY',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 45,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.SHOP, /// TODO add bullets sounds
    );

    this.buySoSo = new Button(
      this.scene,
      SHOP_BUY_SO_SO_BUTTON_POSITION,
      UiControlsFrame.YELLOW_BUTTON,
      {
        x: 0.6,
        y: 0.6,
      },
      UIElementName.SHOP_BUY_SO_SO,
      {
        text: 'BUY',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 48,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.SHOP, /// TODO add bullets sounds
    );

    this.buyGood = new Button(
      this.scene,
      SHOP_BUY_GOOD_BUTTON_POSITION,
      UiControlsFrame.GREEN_BUTTON,
      {
        x: 0.6,
        y: 0.6,
      },
      UIElementName.SHOP_BUY_GOOD,
      {
        text: 'BUY',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 52,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.SHOP, /// TODO add bullets sounds
    );

    this.add([
      this.backButton,
      this.cancel,
      this.submit,
      this.buyBad,
      this.buySoSo,
      this.buyGood,
    ]);
  }

  private createInfoLabels() {
    INFO_LABELS_TYPES.forEach((infoLabelType, index) => {
      const bulletSprite = gameObjectFactory.createSprite(this.scene, {
        key: ImageLoadingKey.UI_SHOP,
        frame: infoLabelType.type,
        position: {
          x: 0,
          y: 0,
        },
      });

      const additionalBackground = gameObjectFactory.createSprite(this.scene, {
        key: ImageLoadingKey.UI_CONTROLS,
        frame: infoLabelType.backType,
        position: {
          x: 0,
          y: 0,
        },
      });

      const infoLabel = new Label(
        this.scene,
        {
          x: INFO_BULLET_START_POSITION.x,
          y: INFO_BULLET_START_POSITION.y + index * 100,
        },
        UiControlsFrame.GRAY_TEXT_BOX,
        {
          x: 0.6,
          y: 0.6,
        },
        UIElementName.SHOP_BULLET_INFO,
        {
          text: infoLabelType.text,
          position: {
            x: 0,
            y: 0,
          },
          fontSize: 60,
          origin: {
            x: 0.5,
            y: 0.5,
          },
          color: infoLabelType.textColor,
        },
        false,
        bulletSprite,
        {
          x: -200,
          y: 0,
        },
        additionalBackground,
      );

      this.add(infoLabel);
    });
  }
}
