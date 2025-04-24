import { EventBus } from '../../EventBus.ts';
import { UiControlsFrame } from '../../managers/game-object-factory/imageConstants.ts';
import { SoundLoadingKey } from '../../managers/sound-manager/constants.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../../views/constants.ts';
import { UI_Event, UIElementName } from '../../views/ui/constants.ts';
import { Label } from '../../views/ui/label/Label.ts';
import type { UiElement } from '../../views/ui/UiElement.ts';
import {
  ALL_IN_BUTTON_POSITION,
  DEALER_BALANCE_POSITION,
  DECREASE_BUTTON_POSITION,
  DOUBLE_BUTTON_POSITION,
  HIT_BUTTON_POSITION,
  INCREASE_BUTTON_POSITION,
  PLAYER_BALANCE_POSITION,
  SHOP_BUTTON_POSITION,
  STAND_BUTTON_POSITION,
} from './constants.ts';

import Container = Phaser.GameObjects.Container;
import {
  Button,
  FAST_CLICK_SPEED,
  LOW_CLICK_SPEED,
} from '../../views/ui/button/Button.ts';

export class PlayerUI extends Container {
  public deal: Button;

  public increaseStake: Button;

  public decreaseStake: Button;

  public allIn: Button;

  public stand: Button;

  public double: Button;

  public hit: Button;

  public shop: Button;

  public playerBalance: Label;

  public dealerBalance: Label;

  private baseUIElements: UiElement[] = [];

  constructor(public scene: Phaser.Scene) {
    super(scene, SCREEN_HALF_W, SCREEN_HALF_H);
    this.create();
    this.setupEventListeners();
  }

  private create() {
    this.deal = new Button(
      this.scene,
      { x: 0, y: 200 },
      UiControlsFrame.GRAY_BUTTON,
      {
        x: 1,
        y: 1,
      },
      UIElementName.DEAL,
      {
        text: 'DEAL \n5',
        position: {
          x: 20,
          y: 0,
        },
        fontSize: 70,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.CARD_GIVEAWAY,
    );

    this.decreaseStake = new Button(
      this.scene,
      DECREASE_BUTTON_POSITION,
      UiControlsFrame.RED_BUTTON,
      {
        x: 0.5,
        y: 0.5,
      },
      UIElementName.DECREASE_STAKE,
      {
        text: '- 25',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 100,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      FAST_CLICK_SPEED,
      SoundLoadingKey.DECREASE,
    );

    this.allIn = new Button(
      this.scene,
      ALL_IN_BUTTON_POSITION,
      UiControlsFrame.YELLOW_BUTTON,
      {
        x: 0.55,
        y: 0.55,
      },
      UIElementName.ALL_IN,
      {
        text: 'ALL IN',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 70,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.ALL_IN,
    );

    this.increaseStake = new Button(
      this.scene,
      INCREASE_BUTTON_POSITION,
      UiControlsFrame.GREEN_BUTTON,
      {
        x: 0.5,
        y: 0.5,
      },
      UIElementName.INCREASE_STAKE,
      {
        text: '25 +',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 100,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      FAST_CLICK_SPEED,
      SoundLoadingKey.INCREASE,
    );

    this.stand = new Button(
      this.scene,
      STAND_BUTTON_POSITION,
      UiControlsFrame.RED_BUTTON,
      {
        x: 0.7,
        y: 0.7,
      },
      UIElementName.STAND,
      {
        text: 'STAND',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 70,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.STAND,
    );

    this.double = new Button(
      this.scene,
      DOUBLE_BUTTON_POSITION,
      UiControlsFrame.YELLOW_BUTTON,
      {
        x: 0.7,
        y: 0.7,
      },
      UIElementName.DOUBLE,
      {
        text: 'DOUBLE',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 70,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.CARD_GIVEAWAY,
    );

    this.hit = new Button(
      this.scene,
      HIT_BUTTON_POSITION,
      UiControlsFrame.GREEN_BUTTON,
      {
        x: 0.65,
        y: 0.65,
      },
      UIElementName.HIT,
      {
        text: 'HIT',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 100,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'black',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.CARD_GIVEAWAY,
    );

    this.shop = new Button(
      this.scene,
      SHOP_BUTTON_POSITION,
      UiControlsFrame.YELLOW_BUTTON,
      {
        x: 0.65,
        y: 0.65,
      },
      UIElementName.SHOP,
      {
        text: 'SHOP',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 115,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'red',
      },
      LOW_CLICK_SPEED,
      SoundLoadingKey.SHOP,
      true,
    );

    this.playerBalance = new Label(
      this.scene,
      PLAYER_BALANCE_POSITION,
      UiControlsFrame.GRAY_TEXT_BOX,
      {
        x: 0.7,
        y: 0.7,
      },
      UIElementName.PLAYER_BALANCE,
      {
        text: '0$',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 90,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'green',
      },
    );

    this.dealerBalance = new Label(
      this.scene,
      DEALER_BALANCE_POSITION,
      UiControlsFrame.GRAY_TEXT_BOX,
      {
        x: 0.7,
        y: 0.7,
      },
      UIElementName.DEALER_BALANCE,
      {
        text: '0$',
        position: {
          x: 0,
          y: 0,
        },
        fontSize: 90,
        origin: {
          x: 0.5,
          y: 0.5,
        },
        color: 'red',
      },
    );

    const elements: UiElement[] = [
      this.deal,
      this.decreaseStake,
      this.allIn,
      this.increaseStake,
      this.stand,
      this.double,
      this.hit,
      this.shop,
      this.playerBalance,
      this.dealerBalance,
    ];

    this.add([...elements]);
    this.baseUIElements.push(...elements);

    this.scene.add.existing(this);
  }

  private setupEventListeners() {
    EventBus.on(UI_Event.HIDE_BASE_UI, this.handleHideBaseUI, this);
    EventBus.on(UI_Event.SHOW_BASE_UI, this.handleShowBaseUI, this);
  }

  private handleHideBaseUI() {
    this.baseUIElements.forEach((baseUIElement) => {
      if (baseUIElement.isActive) {
        baseUIElement.setVisible(false);
      }
    });
  }

  private handleShowBaseUI() {
    this.baseUIElements.forEach((baseUIElement) => {
      if (baseUIElement.isActive) {
        baseUIElement.setVisible(true);
      }
    });
  }
}
