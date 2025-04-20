import type { TextDescription } from '../game-object-factory/constants.ts';

export const NUMBER_OF_DECKS = 4;
export const MAX_FULL_VIEW_CARDS = 7;
export const CARD_WIDTH = 100;

export const textDescription: TextDescription = {
  text: '0',
  position: {
    x: 0,
    y: 0,
  },
  fontSize: 80,
  origin: {
    x: 0.5,
    y: 0.5,
  },
  color: 'white',
};

export const DEALER_HIT_THRESHOLD = 17;
