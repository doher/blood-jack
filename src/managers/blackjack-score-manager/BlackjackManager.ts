import { Blackjack } from '../../actors/blackjack/Blackjack.ts';
import {
  BLACKJACK,
  BlackjackEvents,
  BlackjackResult,
  STAKE,
} from '../../actors/blackjack/constants.ts';
import type { Hand } from '../../actors/blackjack/Hand.ts';
import { EventBus } from '../../EventBus.ts';
import { CardView } from '../../views/card-view/CardView.ts';
import { ShopEvent } from '../../views/shop-view/constants.ts';
import { UI_Event, UIElementName } from '../../views/ui/constants.ts';
import { gameObjectFactory } from '../game-object-factory/GameObjectFactory.ts';
import {
  CARD_WIDTH,
  DEALER_HIT_THRESHOLD,
  MAX_FULL_VIEW_CARDS,
  NUMBER_OF_DECKS,
  textDescription,
} from './constants.ts';

import Text = Phaser.GameObjects.Text;
import Container = Phaser.GameObjects.Container;

export class BlackjackManager {
  public blackjack: Blackjack;

  private playerCards: CardView[] = [];

  private dealerCards: CardView[] = [];

  private playerScore: Text;

  private dealerScore: Text;

  private endGameRoundMessage: Text;

  constructor(private scene: Phaser.Scene) {
    this.blackjack = new Blackjack(scene, NUMBER_OF_DECKS);
    this.setupEventListeners();
    this.createGameTexts();
  }

  private createGameTexts(): void {
    this.endGameRoundMessage = gameObjectFactory.createText(
      this.scene,
      textDescription,
    );
    this.endGameRoundMessage.setPosition(960, 752);
    this.endGameRoundMessage.setVisible(false);

    this.playerScore = gameObjectFactory.createText(
      this.scene,
      textDescription,
    );
    this.playerScore.setPosition(830, 900);
    this.playerScore.setVisible(false);
    this.blackjack.playerCardsContainer.add(this.playerScore);

    this.dealerScore = gameObjectFactory.createText(
      this.scene,
      textDescription,
    );
    this.dealerScore.setPosition(830, 702);
    this.dealerScore.setVisible(false);
    this.blackjack.dealerCardsContainer.add(this.dealerScore);
  }

  private setupEventListeners(): void {
    EventBus.on(BlackjackEvents.DEAL, this.deal, this);
    EventBus.on(BlackjackEvents.HIT, this.playerHit, this);
    EventBus.on(BlackjackEvents.STAND, this.playerStand, this);
    EventBus.on(BlackjackEvents.DOUBLE, this.double, this);
    EventBus.on(ShopEvent.SET_NEXT_ROUND, this.clearGameRoundState, this);
  }

  private deal(): void {
    EventBus.emit(UI_Event.DISABLE_ALL_BUTTONS);

    this.clearGameRoundState();

    this.blackjack.deal();

    const currentPlayerBalanceValue = this.blackjack.playerBalance.value;
    const currentDealerBalanceValue = this.blackjack.dealerBalance.value;

    EventBus.emit(
      UI_Event.UPDATE_TEXT_AT_ELEMENT_ + UIElementName.PLAYER_BALANCE,
      `\$${currentPlayerBalanceValue}`,
    );
    EventBus.emit(
      UI_Event.UPDATE_TEXT_AT_ELEMENT_ + UIElementName.DEALER_BALANCE,
      `\$${currentDealerBalanceValue}`,
    );

    const playerHand = this.blackjack.getPlayerHand();
    this.playerScore.text = `${playerHand.getValue()}`;

    const dealerHand = this.blackjack.getDealerHand();
    this.dealerScore.text = `${dealerHand.getCards()[0].value}`;

    this.scene.time.delayedCall(500, () => {
      this.dealPlayerCards();
      this.dealDealerCards();

      this.playerScore.setVisible(true);
      this.dealerScore.setVisible(true);

      if (+this.playerScore.text === BLACKJACK) {
        this.scene.time.delayedCall(1_000, () => {
          EventBus.emit(UI_Event.DISABLE_ALL_BUTTONS);
          this.hideGameRoundControls();
          this.endGameRound(BlackjackResult.PLAYER_WIN);
        });
      } else {
        EventBus.emit(UI_Event.DISABLE_ALL_BUTTONS);
      }
    });
  }

  private dealPlayerCards() {
    const playerHand = this.blackjack.getPlayerHand();
    const playerCards = playerHand.getCards();
    const playerCardsContainer = this.blackjack.playerCardsContainer;
    const numbersOfCard = this.playerCards.length;
    const yOffset = 950;

    if (numbersOfCard) {
      this.addNextCardToHandView(
        playerHand,
        this.playerCards,
        playerCardsContainer,
        yOffset,
      );

      return;
    }

    playerCards.forEach(({ suit, rank }, index) => {
      const card = new CardView(this.scene, { suit, rank });
      card.setPosition(960 + CARD_WIDTH * index, 950);

      this.blackjack.playerCardsContainer.add(card);
      this.playerCards.push(card);
    });
  }

  private addNextCardToHandView(
    hand: Hand,
    cardViews: CardView[],
    cardsContainer: Container,
    yOffest: number,
  ): void {
    const cards = hand.getCards();
    const numbersOfCard = cardViews.length;

    if (numbersOfCard) {
      const isFullViewCards = numbersOfCard >= MAX_FULL_VIEW_CARDS;
      const { suit, rank } = cards[numbersOfCard];
      const xOffset = isFullViewCards ? CARD_WIDTH / 4 : CARD_WIDTH / 2;

      const lastOpenedCard = new CardView(this.scene, {
        suit,
        rank,
      });
      lastOpenedCard.setPosition(960 + CARD_WIDTH * numbersOfCard, yOffest);

      cardsContainer.add(lastOpenedCard);
      cardViews.push(lastOpenedCard);

      if (isFullViewCards) {
        cardViews.forEach((card, index) =>
          card.setPosition(960 + (CARD_WIDTH / 2) * index, card.y),
        );
      }

      if (numbersOfCard === MAX_FULL_VIEW_CARDS) {
        cardsContainer.setPosition(cardsContainer.x + 150, cardsContainer.y);
      }

      cardsContainer.setPosition(cardsContainer.x - xOffset, cardsContainer.y);

      return;
    }
  }

  private dealDealerCards(): void {
    const dealerHand = this.blackjack.getDealerHand();
    const dealerCards = dealerHand.getCards();
    const dealerCardsContainer = this.blackjack.dealerCardsContainer;
    const numbersOfCard = this.dealerCards.length;
    const yOffset = 650;

    if (numbersOfCard) {
      this.addNextCardToHandView(
        dealerHand,
        this.dealerCards,
        dealerCardsContainer,
        yOffset,
      );

      return;
    }

    dealerCards.forEach(({ suit, rank }, index) => {
      const card = new CardView(this.scene, {
        suit,
        rank,
        isClosed: index === 1,
      });
      card.setPosition(960 + CARD_WIDTH * index, 650);

      this.blackjack.dealerCardsContainer.add(card);

      this.dealerCards.push(card);
    });
  }

  private double(): void {
    this.blackjack.double();

    EventBus.emit(
      UI_Event.UPDATE_TEXT_AT_ELEMENT_ + UIElementName.PLAYER_BALANCE,
      `\$${this.blackjack.playerBalance.value}`,
    );
    EventBus.emit(
      UI_Event.UPDATE_TEXT_AT_ELEMENT_ + UIElementName.DEALER_BALANCE,
      `\$${this.blackjack.dealerBalance.value}`,
    );

    this.playerHit();

    const playerHand = this.blackjack.getPlayerHand();

    if (!playerHand.isBust()) {
      this.playerStand();
    }
  }

  private playerHit(): void {
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.DOUBLE);

    this.blackjack.hit();
    this.dealPlayerCards();

    const playerHand = this.blackjack.getPlayerHand();
    const playerScore = playerHand.getValue();
    this.playerScore.text = `${playerHand.getValue()}`;

    if (playerScore === BLACKJACK) {
      this.playerStand();
    }

    if (playerHand.isBust()) {
      this.hideGameRoundControls();
      this.endGameRound(BlackjackResult.DEALER_WIN);
    }
  }

  private playerStand(): void {
    this.hideGameRoundControls();

    this.scene.time.delayedCall(1_000, () => {
      const dealerHand = this.blackjack.getDealerHand();
      const dealerCards = dealerHand.getCards();
      const hiddenCard = this.dealerCards.pop();

      this.scene.tweens.add({
        targets: hiddenCard,
        scaleX: 0,
        duration: 300,
        ease: 'Linear',
        onComplete: () => {
          hiddenCard?.destroy();

          const suit = dealerCards[1].suit;
          const rank = dealerCards[1].rank;

          const faceUpCard = new CardView(this.scene, {
            suit,
            rank,
          });
          faceUpCard.setPosition(960 + CARD_WIDTH, 650);
          faceUpCard.setScale(0, 1);

          this.dealerCards.push(faceUpCard);
          this.blackjack.dealerCardsContainer.add(faceUpCard);

          this.scene.tweens.add({
            targets: faceUpCard,
            scaleX: 1,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
              const dealerScore = dealerHand.getValue();

              this.dealerScore.text = `${dealerScore}`;

              this.checkDealerOutcome(dealerHand);
            },
          });
        },
      });
    });
  }

  private dealerHit(): void {
    this.scene.time.delayedCall(3_500, () => {
      this.blackjack.stand();

      const dealerHand = this.blackjack.getDealerHand();
      const dealerScore = dealerHand.getValue();

      this.dealerScore.text = `${dealerScore}`;

      this.dealDealerCards();
      this.checkDealerOutcome(dealerHand);
    });
  }

  private checkDealerOutcome(dealerHand: Hand): void {
    const dealerScore = dealerHand.getValue();

    if (dealerHand.isBust()) {
      this.endGameRound(BlackjackResult.PLAYER_WIN);
      return;
    }

    if (dealerScore > +this.playerScore.text) {
      this.endGameRound(BlackjackResult.DEALER_WIN);
      return;
    }

    if (dealerScore < DEALER_HIT_THRESHOLD) {
      this.dealerHit();
      return;
    }

    this.endGameRound(this.blackjack.determineResult());
  }

  private enableUIStakeElements(): void {
    this.scene.time.delayedCall(5_000, () => {
      this.endGameRoundMessage.setVisible(false);

      EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.DEAL);
      EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.INCREASE_STAKE);
      EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.DECREASE_STAKE);
      EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.ALL_IN);
    });
  }

  private resetGameAfterDelay(): void {
    this.scene.time.delayedCall(1_000, () => {
      this.blackjack.currentStake = STAKE;

      EventBus.emit(
        UI_Event.UPDATE_TEXT_AT_ELEMENT_ + UIElementName.DEAL,
        `DEAL \n${this.blackjack.currentStake}$`,
      );

      this.endGameRoundMessage.setVisible(true);

      this.playerScore.setVisible(false);
      this.dealerScore.setVisible(false);

      this.playerCards.forEach((card) => card.destroy());
      this.dealerCards.forEach((card) => card.destroy());

      this.blackjack.playerCardsContainer.setPosition(0, 0);
      this.blackjack.dealerCardsContainer.setPosition(0, 0);
    });
  }

  private clearGameRoundState(): void {
    const playerHand = this.blackjack.getPlayerHand();
    const dealerHand = this.blackjack.getDealerHand();

    playerHand.clear();
    dealerHand.clear();

    this.playerScore.text = '0';
    this.dealerScore.text = '0';
    this.endGameRoundMessage.text = '';

    this.playerScore.setVisible(false);
    this.dealerScore.setVisible(false);
    this.endGameRoundMessage.setVisible(false);

    this.playerCards = [];
    this.dealerCards = [];
  }

  private hideGameRoundControls(): void {
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.HIT);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.DOUBLE);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.STAND);
  }

  private endGameRound(message: BlackjackResult): void {
    this.endGameRoundMessage.text = message;

    let currentPlayerBalanceValue = this.blackjack.playerBalance.value;
    let currentDealerBalanceValue = this.blackjack.dealerBalance.value;

    if (message === BlackjackResult.PLAYER_WIN) {
      currentPlayerBalanceValue += 2 * this.blackjack.currentStake;
    }

    if (message === BlackjackResult.DEALER_WIN) {
      currentDealerBalanceValue += 2 * this.blackjack.currentStake;
    }

    if (message === BlackjackResult.PUSH) {
      currentPlayerBalanceValue += this.blackjack.currentStake;
      currentDealerBalanceValue += this.blackjack.currentStake;
    }

    this.scene.time.delayedCall(1_500, () => {
      EventBus.emit(
        UI_Event.UPDATE_TEXT_AT_ELEMENT_ + UIElementName.PLAYER_BALANCE,
        `\$${currentPlayerBalanceValue}`,
      );
      EventBus.emit(
        UI_Event.UPDATE_TEXT_AT_ELEMENT_ + UIElementName.DEALER_BALANCE,
        `\$${currentDealerBalanceValue}`,
      );

      this.blackjack.playerBalance.value = currentPlayerBalanceValue;
      this.blackjack.dealerBalance.value = currentDealerBalanceValue;
    });

    this.resetGameAfterDelay();

    if (currentPlayerBalanceValue === 0 || currentDealerBalanceValue === 0) {
      return;
    }

    this.enableUIStakeElements();
  }
}
