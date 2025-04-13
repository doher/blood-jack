export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank =
  | 'A'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K';

export class Card {
  constructor(
    public rank: Rank,
    public value: number,
    public suit: Suit,
  ) {}
}
