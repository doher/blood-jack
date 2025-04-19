import type { Position } from '../../managers/game-object-factory/constants.ts';

const STAKE_BUTTONS_X_OFFSET = 200;

export const ALL_IN_BUTTON_POSITION: Position = {
  x: 0,
  y: 400,
};

export const DECREASE_BUTTON_POSITION: Position = {
  x: ALL_IN_BUTTON_POSITION.x - STAKE_BUTTONS_X_OFFSET,
  y: 400,
};

export const INCREASE_BUTTON_POSITION: Position = {
  x: ALL_IN_BUTTON_POSITION.x + STAKE_BUTTONS_X_OFFSET,
  y: 400,
};

export const STAND_BUTTON_POSITION: Position = {
  x: -525,
  y: 400,
};

export const DOUBLE_BUTTON_POSITION: Position = {
  x: 550,
  y: 400,
};

export const HIT_BUTTON_POSITION: Position = {
  x: 545,
  y: 200,
};

export const SHOP_BUTTON_POSITION: Position = {
  x: -800,
  y: -450,
};

export const PLAYER_BALANCE_POSITION: Position = {
  x: -800,
  y: 400,
};

export const DEALER_BALANCE_POSITION: Position = {
  x: 305,
  y: -125,
};
