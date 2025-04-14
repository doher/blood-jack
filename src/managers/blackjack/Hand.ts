import { Card } from '@managers/blackjack/Card.ts';
import { Rank } from '@managers/blackjack/constants.ts';

const BLACKJACK = 21;

export class Hand {
  private cards: Card[] = [];

  public addCard(card: Card) {
    this.cards.push(card);
  }

  public getCards(): Card[] {
    return this.cards;
  }

  public clear(): void {
    this.cards = [];
  }

  public getValue(): number {
    let total = 0;
    let acesCount = 0;

    for (const card of this.cards) {
      total += card.value;

      if (card.rank === Rank.ACE) {
        acesCount += 1;
      }
    }

    while (acesCount > 0) {
      if (total + 10 <= BLACKJACK) {
        total += 10;
      }

      acesCount -= 1;
    }

    return total;
  }

  public isBust(): boolean {
    return this.getValue() > BLACKJACK;
  }
}
