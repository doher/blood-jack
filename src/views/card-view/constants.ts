import type { Rank, Suit } from '../../actors/blackjack/constants.ts';
import { ImageLoadingKey } from '../../managers/game-object-factory/imageConstants.ts';

export type Config = {
  rank: Rank;
  suit: Suit;
  isClosed?: boolean;
};

export const ranksTexts: Record<Rank, string> = {
  TWO: '2',
  THREE: '3',
  FOUR: '4',
  FIVE: '5',
  SIX: '6',
  SEVEN: '7',
  EIGHT: '8',
  NINE: '9',
  TEN: '10',
  JACK: 'J',
  QUEEN: 'Q',
  KING: 'K',
  ACE: 'A',
};

export const suitsImages: Record<
  Suit,
  { image: ImageLoadingKey; smallImage: ImageLoadingKey }
> = {
  CLUBS: {
    image: ImageLoadingKey.CLUBS,
    smallImage: ImageLoadingKey.SMALL_CLUBS,
  },
  DIAMONDS: {
    image: ImageLoadingKey.DIAMONDS,
    smallImage: ImageLoadingKey.SMALL_DIAMONDS,
  },
  HEARTS: {
    image: ImageLoadingKey.HEARTS,
    smallImage: ImageLoadingKey.SMALL_HEARTS,
  },
  SPADES: {
    image: ImageLoadingKey.SPADES,
    smallImage: ImageLoadingKey.SMALL_SPADES,
  },
};
