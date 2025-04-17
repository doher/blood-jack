import { EventBus } from '../../EventBus.ts';
import {
  BlackjackMangerEvents,
  GameStates,
} from '../../managers/blackjack-score-manager/constants.ts';
import { Balance } from './Balance.ts';
import {
  BlackjackEvents,
  BlackjackResult,
  DEFAULT_BALANCE,
  STAKE,
} from './constants.ts';
import { Deck } from './Deck.ts';
import { Hand } from './Hand.ts';

const START_CARD_AMOUNT = 2;
const DEALER_HIT_THRESHOLD = 17;

export class Blackjack {
  private deck: Deck;

  private readonly playerHand: Hand;

  private readonly dealerHand: Hand;

  private readonly playerBalance: Balance;

  private readonly dealerBalance: Balance;

  private currentStake: number = 0;

  constructor(numberOfDecks: number = 1) {
    this.deck = new Deck(numberOfDecks);

    this.playerHand = new Hand();
    this.dealerHand = new Hand();

    this.playerBalance = new Balance(DEFAULT_BALANCE);
    this.dealerBalance = new Balance(DEFAULT_BALANCE);

    this.setupEventListeners();
  }

  public setupEventListeners() {
    EventBus.on(BlackjackEvents.DEAL, this.deal, this);
  }

  public deal(): void {
    this.playerBalance.bet(this.currentStake);
    this.dealerBalance.bet(this.currentStake);

    this.playerHand.clear();
    this.dealerHand.clear();

    for (let amount = 0; amount < START_CARD_AMOUNT; amount += 1) {
      this.playerHand.addCard(this.deck.drawCard());
      this.dealerHand.addCard(this.deck.drawCard());
    }
  }

  public hit(): void {
    // todo: disable double button
    this.playerHand.addCard(this.deck.drawCard());
  }

  public stand(): void {
    // todo: disable hit, double, stand buttons

    EventBus.emit(
      BlackjackMangerEvents.CHANGE_GAME_STATE,
      GameStates.DEALER_TURN,
    );
  }

  public double(): void {
    const doubledStake = this.currentStake * 2;

    if (this.playerBalance.value - doubledStake < 0) {
      // todo: dealer says something
      return;
    }

    if (this.dealerBalance.value - doubledStake < 0) {
      // todo: dealer says something
      return;
    }

    this.hit();
    this.stand();
  }

  public increaseStake(): void {
    if (this.currentStake + STAKE > this.dealerBalance.value) {
      // todo: dealer says something
      return;
    }

    if (this.currentStake + STAKE === this.playerBalance.value) {
      this.currentStake += STAKE;
      // todo: disable increase and all in buttons
      return;
    }

    if (this.currentStake + STAKE > this.playerBalance.value) {
      // todo: disable increase and all in buttons
      return;
    }

    this.currentStake += STAKE;
  }

  public decreaseStake(): void {
    if (this.currentStake - STAKE === 0) {
      this.currentStake -= STAKE;
      // todo: disable decrease button
      return;
    }

    if (this.currentStake - STAKE < 0) {
      // todo: disable decrease button
      return;
    }

    this.currentStake -= STAKE;
  }

  public allIn(): void {
    if (this.playerBalance.value > this.dealerBalance.value) {
      // todo: dealer says something
      return;
    }

    // todo: dealer says something
    this.currentStake = this.playerBalance.value;
  }

  public playDealerTurn(): void {
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
