import { EventBus } from '../../EventBus.ts';
import { Balance } from './Balance.ts';
import {
  BlackjackEvents,
  BlackjackResult,
  DEFAULT_BALANCE,
  STAKE,
} from './constants.ts';
import { Deck } from './Deck.ts';
import { Hand } from './Hand.ts';

import Container = Phaser.GameObjects.Container;

const START_CARD_AMOUNT = 2;

export class Blackjack extends Container {
  public playerCardsContainer: Container;

  public dealerCardsContainer: Container;

  public currentStake: number = STAKE;

  public readonly playerBalance: Balance;

  public readonly dealerBalance: Balance;

  private deck: Deck;

  private readonly playerHand: Hand;

  private readonly dealerHand: Hand;
  constructor(
    public scene: Phaser.Scene,
    numberOfDecks: number = 1,
  ) {
    super(scene, 0, 0);

    this.scene.add.existing(this);

    this.playerCardsContainer = this.scene.add.container(0, 0);
    this.dealerCardsContainer = this.scene.add.container(0, 0);
    this.add([this.playerCardsContainer, this.dealerCardsContainer]);

    this.deck = new Deck(numberOfDecks);

    this.playerHand = new Hand();
    this.dealerHand = new Hand();

    this.playerBalance = new Balance(DEFAULT_BALANCE);
    this.dealerBalance = new Balance(DEFAULT_BALANCE);

    this.setupEventListeners();
  }

  public setupEventListeners() {
    /// TODO bring to manager
    EventBus.on(BlackjackEvents.DECREASE, this.decreaseStake, this);
    EventBus.on(BlackjackEvents.INCREASE, this.increaseStake, this);
    EventBus.on(BlackjackEvents.ALL_IN, this.allIn, this);
  }

  public deal(): void {
    // todo: disable deal button
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
    this.playerHand.addCard(this.deck.drawCard());
  }

  public stand(): void {
    this.dealerHit();
  }

  public double(): void {
    const doubledStake = this.currentStake * 2;

    if (this.playerBalance.value - doubledStake < STAKE) {
      // todo: dealer says something
      return;
    }

    if (this.dealerBalance.value - doubledStake < STAKE) {
      // todo: dealer says something
      return;
    }

    this.playerBalance.bet(this.currentStake);
    this.dealerBalance.bet(this.currentStake);

    this.currentStake = doubledStake;
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
    if (this.currentStake - STAKE === STAKE) {
      this.currentStake -= STAKE;
      // todo: disable decrease button
      return;
    }

    if (this.currentStake - STAKE < STAKE) {
      // todo: disable decrease button
      return;
    }

    this.currentStake -= STAKE;
  }

  public allIn(): void {
    if (this.playerBalance.value > this.dealerBalance.value) {
      this.currentStake = this.dealerBalance.value;
      // todo: dealer says something
      return;
    }

    // todo: dealer says something
    this.currentStake = this.playerBalance.value;
  }

  private dealerHit(): void {
    this.dealerHand.addCard(this.deck.drawCard());
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
