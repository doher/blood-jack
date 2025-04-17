import { Blackjack } from '../../actors/blackjack/Blackjack.ts';
import {
  BLACKJACK,
  BlackjackEvents,
} from '../../actors/blackjack/constants.ts';
import { EventBus } from '../../EventBus.ts';
import { CardView } from '../../views/card-view/CardView.ts';
import { BlackjackMangerEvents, GameStates } from './constants.ts';

export class BlackjackManager {
  public blackjack: Blackjack;

  private currentState: GameStates;

  constructor(private scene: Phaser.Scene) {
    this.blackjack = new Blackjack(4);
    this.currentState = GameStates.IDLE;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    EventBus.on(
      BlackjackMangerEvents.CHANGE_GAME_STATE,
      this.changeGameState,
      this,
    );

    EventBus.on(BlackjackEvents.DEAL, this.deal, this);
    EventBus.on(BlackjackEvents.HIT, this.playerTurn, this);
    EventBus.on(BlackjackEvents.STAND, this.dealerTurn, this);
    EventBus.on(BlackjackEvents.DOUBLE, this.dealerTurn, this);
  }

  public handleGameStates() {
    if (this.currentState === GameStates.IDLE) {
      // todo: idle logic
      this.currentState = GameStates.START_GAME;
    }

    if (this.currentState === GameStates.START_GAME) {
      // todo: start game logic
      this.deal();
    }

    if (this.currentState === GameStates.PLAYER_TURN) {
      this.playerTurn();
      // todo: player turn logic
    }

    if (this.currentState === GameStates.PLAYER_WIN) {
      this.dealerTurn();
      // todo: player win logic
    }
  }

  private deal(): void {
    this.blackjack.deal();

    const playerHand = this.blackjack.getPlayerHand();
    const playerScore = playerHand.getValue();

    this.dealPlayerCards();
    this.dealDealerCards();

    if (playerScore === BLACKJACK) {
      this.currentState = GameStates.PLAYER_WIN;
      return;
    }

    this.currentState = GameStates.PLAYER_TURN;
  }

  private dealPlayerCards() {
    const playerHand = this.blackjack.getPlayerHand();
    const playerCards = playerHand.getCards();

    playerCards.forEach(({ suit, rank }, index) => {
      const card = new CardView(this.scene, { suit, rank });
      card.setPosition(960 + 100 * index, 950);
    });
  }

  private dealDealerCards() {
    const dealerHand = this.blackjack.getDealerHand();
    const dealerCards = dealerHand.getCards();

    dealerCards.forEach(({ suit, rank }, index) => {
      const card = new CardView(this.scene, {
        suit,
        rank,
        isClosed: index === 1,
      });

      card.setPosition(960 + 100 * index, 650);
    });
  }

  public playerTurn(): void {
    this.blackjack.hit();
    /// TODO rerender player cards
  }

  public dealerTurn(): void {
    console.log('dealerTurn');
    this.blackjack.stand();
  }

  private changeGameState(newState: GameStates) {
    this.currentState = newState;
  }
}
