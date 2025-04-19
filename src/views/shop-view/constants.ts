import { Position } from '../../managers/game-object-factory/constants.ts';

export const SHOP_BACK_BUTTON_POSITION: Position = {
  x: 0,
  y: 450,
};

export const SHOP_CANCEL_BUTTON_POSITION: Position = {
  x: -300,
  y: 450,
};

export const SHOP_SUBMIT_BUTTON_POSITION: Position = {
  x: 300,
  y: 450,
};

export const INFO_BULLET_START_POSITION: Position = {
  x: -800,
  y: 250,
};

export const SHOP_BUY_BAD_BUTTON_POSITION: Position = {
  x: -650,
  y: 75,
};

export const SHOP_BUY_SO_SO_BUTTON_POSITION: Position = {
  x: 0,
  y: 75,
};

export const SHOP_BUY_GOOD_BUTTON_POSITION: Position = {
  x: 650,
  y: 75,
};

export const enum ShopEvent {
  SET_NEXT_ROUND = 'ShopEvent_SET_NEXT_ROUND',
  RESET_SHOP = 'ShopEvent_RESET_SHOP',
}
