import { Deck } from '@actors/blackjack/Deck.ts';
import { Hand } from '@actors/blackjack/Hand.ts';

export type BlackjackResult = 'PLAYER_WIN' | 'DEALER_WIN' | 'PUSH';

export class Blackjack {
  private deck: Deck;

  private readonly playerHand: Hand;

  private readonly dealerHand: Hand;

  constructor(numberOfDecks: number = 1) {
    this.deck = new Deck(numberOfDecks);
    this.playerHand = new Hand();
    this.dealerHand = new Hand();
  }

  public startGame(): void {
    this.playerHand.clear();
    this.dealerHand.clear();

    for (let numberOfCard = 0; numberOfCard < 2; numberOfCard += 1) {
      this.playerHand.addCard(this.deck.drawCard());
      this.dealerHand.addCard(this.deck.drawCard());
    }
  }

  public hitPlayer(): void {
    this.playerHand.addCard(this.deck.drawCard());
  }

  public dealerPlay(): void {
    while (this.dealerHand.getValue() < 17) {
      this.dealerHand.addCard(this.deck.drawCard());
    }
  }

  public determineResult(): BlackjackResult {
    if (this.playerHand.isBust()) {
      return 'DEALER_WIN';
    }

    if (this.dealerHand.isBust()) {
      return 'PLAYER_WIN';
    }

    const playerValue = this.playerHand.getValue();
    const dealerValue = this.dealerHand.getValue();

    if (playerValue > dealerValue) {
      return 'PLAYER_WIN';
    }

    if (dealerValue > playerValue) {
      return 'DEALER_WIN';
    }

    return 'PUSH';
  }

  public getPlayerHand(): Hand {
    return this.playerHand;
  }

  public getDealerHand(): Hand {
    return this.dealerHand;
  }
}
