import { Card } from './Card.ts';
import { Rank, Suit } from './constants.ts';

const rankValues: Array<{ rank: Rank; value: number }> = [
  { rank: Rank.TWO, value: 2 },
  { rank: Rank.THREE, value: 3 },
  { rank: Rank.FOUR, value: 4 },
  { rank: Rank.FIVE, value: 5 },
  { rank: Rank.SIX, value: 6 },
  { rank: Rank.SEVEN, value: 7 },
  { rank: Rank.EIGHT, value: 8 },
  { rank: Rank.NINE, value: 9 },
  { rank: Rank.TEN, value: 10 },
  { rank: Rank.JACK, value: 10 },
  { rank: Rank.QUEEN, value: 10 },
  { rank: Rank.KING, value: 10 },
  { rank: Rank.ACE, value: 1 },
];

export class Deck {
  private cards: Card[] = [];

  private suits: Suit[] = [Suit.SPADES, Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS];

  constructor(private numberOfDecks: number) {
    this.init();
    this.shuffle();
  }

  public drawCard(): Card {
    if (this.cards.length === 0) {
      this.init();
      this.shuffle();
    }

    return this.cards.shift() as Card;
  }

  private init() {
    this.cards = [];

    for (let deck = 0; deck < this.numberOfDecks; deck += 1) {
      for (const { rank, value } of rankValues) {
        for (const suit of this.suits) {
          this.cards.push(new Card(rank, value, suit));
        }
      }
    }
  }

  private shuffle() {
    for (let card = this.cards.length - 1; card > 0; card -= 1) {
      const random = Math.floor(Math.random() * (card + 1));
      [this.cards[card], this.cards[random]] = [
        this.cards[random],
        this.cards[card],
      ];
    }
  }
}
