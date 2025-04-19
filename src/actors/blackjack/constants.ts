export const BLACKJACK = 21;

export const enum Suit {
  CLUBS = 'CLUBS',
  DIAMONDS = 'DIAMONDS',
  HEARTS = 'HEARTS',
  SPADES = 'SPADES',
}

export const enum Rank {
  ACE = 'ACE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
  SEVEN = 'SEVEN',
  EIGHT = 'EIGHT',
  NINE = 'NINE',
  TEN = 'TEN',
  JACK = 'JACK',
  QUEEN = 'QUEEN',
  KING = 'KING',
}

export const enum BlackjackResult {
  PLAYER_WIN = 'PLAYER_WIN',
  DEALER_WIN = 'DEALER_WIN',
  PUSH = 'PUSH',
}

export const enum BlackjackEvents {
  DEAL = 'BlackjackEvents_DEAL',
  DECREASE = 'BlackjackEvents_DECREASE',
  INCREASE = 'BlackjackEvents_INCREASE',
  HIT = 'BlackjackEvents_HIT',
  STAND = 'BlackjackEvents_STAND',
  DOUBLE = 'BlackjackEvents_DOUBLE',
  ALL_IN = 'BlackjackEvents_ALL_IN',
}

export const DEFAULT_BALANCE = 500;
export const LAST_ROUND_BALANCE = 1000;

export const BALANCES = [DEFAULT_BALANCE, LAST_ROUND_BALANCE];

export const STAKE = 5;
