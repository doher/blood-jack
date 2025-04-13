import { Card } from '@actors/blackjack/Card.ts';

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

      if (card.rank === 'A') {
        acesCount += 1;
      }
    }

    while (acesCount > 0) {
      if (total + 10 <= 21) {
        total += 10;
      }

      acesCount -= 1;
    }

    return total;
  }

  public isBust(): boolean {
    return this.getValue() > 21;
  }
}
