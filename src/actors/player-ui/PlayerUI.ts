import { UiControlsFrame } from '../../managers/game-object-factory/imageConstants.ts';
import {
  Button,
  FAST_CLICK_SPEED,
  LOW_CLICK_SPEED,
} from '../../views/button/button.ts';
import { SCREEN_HALF_H, SCREEN_HALF_W } from '../../views/constants.ts';
import { Label } from '../../views/label/label.ts';
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
import { SoundLoadingKey } from '../../managers/sound-manager/constants.ts';
import Container = Phaser.GameObjects.Container;
import { Cursor } from '../../views/cursor/Cursor.ts';

export const enum UIEvent {
  DISABLE_ALL_BUTTONS = 'UIEvent_DISABLE_ALL_BUTTONS',
  DISABLE_BUTTON_ = 'UIEvent_DISABLE_BUTTON_',
  ENABLE_BUTTON_ = 'UIEvent_ENABLE_BUTTON_',
  UPDATE_TEXT_AT_ELEMENT_ = 'UIEvent_UPDATE_TEXT_AT_ELEMENT_',
}

export const enum UIElementName {
  DEAL = 'UIElementName_DEAL',
  DECREASE_STAKE = 'UIElementName_DECREASE_STAKE',
  INCREASE_STAKE = 'UIElementName_INCREASE_STAKE',
  ALL_IN = 'UIElementName_ALL_IN',
  STAND = 'UIElementName_STAND',
  DOUBLE = 'UIElementName_DOUBLE',
  HIT = 'UIElementName_HIT',
  SHOP = 'UIElementName_SHOP',
  PLAYER_BALANCE = 'UIElementName_PLAYER_BALANCE',
  DEALER_BALANCE = 'UIElementName_DEALER_BALANCE',
}

export class PlayerUI extends Container {
  public deal: Button;

  public increaseStake: Button;

  public decreaseStake: Button;

  public allin: Button;

  public stand: Button;

  public double: Button;

  public hit: Button;

  public shop: Button;

  public playerBalance: Label;

  public dealerBalance: Label;

  public cursor: Cursor;

  constructor(public scene: Phaser.Scene) {
    super(scene, SCREEN_HALF_W, SCREEN_HALF_H);
    this.create();
    this.createCursor();
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
        text: 'DEAL \n5', /// TODO add default stake here
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
        text: '- 5', /// TODO add default stake here
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

    this.allin = new Button(
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
        text: '5 +', /// TODO add default stake here
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
      UiControlsFrame.BLACK_BUTTON,
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
        text: '0$', /// TODO change to real value
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
        text: '0$', /// TODO change to real value
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

    this.add([
      this.deal,
      this.decreaseStake,
      this.allin,
      this.increaseStake,
      this.stand,
      this.double,
      this.hit,
      this.shop,
      this.playerBalance,
      this.dealerBalance,
    ]);

    this.scene.add.existing(this);
  }

  private createCursor() {
    this.cursor = new Cursor(this.scene);
  }
}
