import { BlackjackResult } from '@managers/blackjack/blackjackEnums.ts';
import { Deck } from '@managers/blackjack/Deck.ts';
import { Hand } from '@managers/blackjack/Hand.ts';

const START_CARD_AMOUNT = 2;
const DEALER_HIT_THRESHOLD = 17;

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

    for (let amount = 0; amount < START_CARD_AMOUNT; amount += 1) {
      this.playerHand.addCard(this.deck.drawCard());
      this.dealerHand.addCard(this.deck.drawCard());
    }
  }

  public hitPlayer(): void {
    this.playerHand.addCard(this.deck.drawCard());
  }

  public playDealer(): void {
    while (this.dealerHand.getValue() < DEALER_HIT_THRESHOLD) {
      this.dealerHand.addCard(this.deck.drawCard());
    }
  }

  public determineResult(): BlackjackResult {
    if (this.playerHand.isBust()) {
      return BlackjackResult.DEALER_WIN;
    }

    if (this.dealerHand.isBust()) {
      return BlackjackResult.PLAYER_WIN;
    }

    const playerValue = this.playerHand.getValue();
    const dealerValue = this.dealerHand.getValue();

    if (playerValue > dealerValue) {
      return BlackjackResult.PLAYER_WIN;
    }

    if (dealerValue > playerValue) {
      return BlackjackResult.DEALER_WIN;
    }

    return BlackjackResult.PUSH;
  }

  public getPlayerHand(): Hand {
    return this.playerHand;
  }

  public getDealerHand(): Hand {
    return this.dealerHand;
  }
}
