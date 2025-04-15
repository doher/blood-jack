import type { Rank, Suit } from './constants.ts';

export class Card {
  constructor(
    public readonly rank: Rank,
    public readonly value: number,
    public readonly suit: Suit,
  ) {}
}
