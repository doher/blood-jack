import type { Blackjack } from '../../actors/blackjack/Blackjack.ts';
import { EventBus } from '../../EventBus.ts';
import { gameObjectFactory } from '../../managers/game-object-factory/GameObjectFactory.ts';
import {
  ImageLoadingKey,
  UiControlsFrame,
} from '../../managers/game-object-factory/imageConstants.ts';
import { SoundLoadingKey } from '../../managers/sound-manager/constants.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../constants.ts';
import { SHADOW_TAG } from '../Shadow.ts';
import { Button, LOW_CLICK_SPEED } from '../ui/button/Button.ts';
import { UIElementName } from '../ui/constants.ts';
import { Label } from '../ui/label/Label.ts';
import { ShopBulletsType } from './BulletsSideView.ts';
import {
  INFO_BULLET_START_POSITION,
  SHOP_BACK_BUTTON_POSITION,
  SHOP_BUY_BAD_BUTTON_POSITION,
  SHOP_BUY_GOOD_BUTTON_POSITION,
  SHOP_BUY_SO_SO_BUTTON_POSITION,
  SHOP_CANCEL_BUTTON_POSITION,
  SHOP_SUBMIT_BUTTON_POSITION,
} from './constants.ts';
import { ScaleBalance } from './ScaleBalance.ts';

import Container = Phaser.GameObjects.Container;

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

export const INFO_LABELS_TYPES: InfoLabelType[] = [
  {
    type: ShopBulletsType.RED,
    text: 'LIVE',
    backType: UiControlsFrame.RED_BUTTON,
    textColor: 'red',
  },
  {
    type: ShopBulletsType.YELLOW,
    text: '50%50',
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
  private scaleBalances: ScaleBalance[] = [];

  private backButton: Button;

  private buyBad: Button;

  private buySoSo: Button;

  private buyGood: Button;

  private submit: Button;

  private cancel: Button;

  private helpText: Phaser.GameObjects.Text;
  constructor(
    public scene: Phaser.Scene,
    private blackjack: Blackjack,
  ) {
    super(scene, SCREEN_HALF_W, SCREEN_HALF_H);
    this.create();
    this.setupEventListeners();
  }

  private create() {
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
        this.blackjack,
      );
      this.add(scaleBalance);
      this.scaleBalances.push(scaleBalance);
    });

    this.createButtons();
    this.createInfoLabels();

    this.helpText = gameObjectFactory.createText(this.scene, {
      fontSize: 22,
      position: {
        x: 0,
        y: 275,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
      text:
        'Keep a Balance... In chasing of the best bullet pack, you can end up with nothing. ;(\n' +
        'But also keep in mind that the dealer will try to buy the best bullet pack.\n' +
        "Maybe it's worth leaving him without any money at all?\n",
      letterSpacing: 0,
      lineSpacing: 8,
    });

    this.add([this.helpText]);

    this.scene.add.existing(this);
  }

  private setupEventListeners() {
    EventBus.on(UIElementName.SHOP_SUBMIT, this.hideHelpText, this);
  }

  private hideHelpText() {
    this.helpText.setVisible(false);
  }

  public resetShopView() {
    this.helpText.setVisible(true);

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
        text: 'BACK',
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
      SoundLoadingKey.SHOP_BUY,
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
        fontSize: 55,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.SHOP_BUY_BAD,
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
        fontSize: 60,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.SHOP_BUY_SO_SO,
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
        fontSize: 66,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.SHOP_BUY_GOOD,
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
