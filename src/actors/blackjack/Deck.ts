import { Card, Rank, Suit } from '@actors/blackjack/Card.ts';

export class Deck {
  private cards: Card[] = [];

  private ranks: Array<{ rank: Rank; value: number }> = [
    { rank: '2', value: 2 },
    { rank: '3', value: 3 },
    { rank: '4', value: 4 },
    { rank: '5', value: 5 },
    { rank: '6', value: 6 },
    { rank: '7', value: 7 },
    { rank: '8', value: 8 },
    { rank: '9', value: 9 },
    { rank: '10', value: 10 },
    { rank: 'J', value: 10 },
    { rank: 'Q', value: 10 },
    { rank: 'K', value: 10 },
    { rank: 'A', value: 1 },
  ];

  private suits: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];

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
      for (const { rank, value } of this.ranks) {
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
