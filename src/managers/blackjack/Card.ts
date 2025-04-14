import { Rank, Suit } from '@managers/blackjack/constants.ts';

export class Card {
  constructor(
    public readonly rank: Rank,
    public readonly value: number,
    public readonly suit: Suit,
  ) {}
}
