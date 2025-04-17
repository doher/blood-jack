import { Blackjack } from '../../actors/blackjack/Blackjack.ts';
import { BLACKJACK } from '../../actors/blackjack/constants.ts';
import { EventBus } from '../../EventBus.ts';
import { CardView } from '../../views/card-view/CardView.ts';
import { BlackjackMangerEvents, GameStates } from './constants.ts';

export class BlackjackManager {
  private currentState: GameStates;

  private blackjack: Blackjack;

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
    const playerCards = playerHand.getCards();
    const playerScore = playerHand.getValue();

    playerCards.forEach(({ suit, rank }, index) => {
      const card = new CardView(this.scene, { suit, rank });

      card.setPosition(960 + 100 * index, 950);
    });

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

    if (playerScore === BLACKJACK) {
      this.currentState = GameStates.PLAYER_WIN;
      return;
    }

    this.currentState = GameStates.PLAYER_TURN;
  }

  public playerTurn(): void {}

  public dealerTurn(): void {}

  private changeGameState(newState: GameStates) {
    this.currentState = newState;
  }
}
