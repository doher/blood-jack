import { EventBus } from '../EventBus.ts';
import type { Blackjack } from './blackjack/Blackjack.ts';
import {
  BlackjackEvents,
  DEFAULT_BALANCE,
  STAKE,
} from './blackjack/constants.ts';
import { UIElementName, UIEvent } from './player-ui/PlayerUI.ts';

export class Player {
  constructor(
    private scene: Phaser.Scene,
    private blackjack: Blackjack,
  ) {
    this.setupEventListeners();
    this.initRound();
  }

  private initRound() {
    EventBus.emit(UIEvent.DISABLE_BUTTON_ + UIElementName.HIT);
    EventBus.emit(UIEvent.DISABLE_BUTTON_ + UIElementName.DOUBLE);
    EventBus.emit(UIEvent.DISABLE_BUTTON_ + UIElementName.STAND);

    this.scene.time.delayedCall(50, () => {
      this.updateLabels();
    });
  }

  private setupEventListeners() {
    EventBus.on(UIElementName.DECREASE_STAKE, this.handleDecreaseButton, this);
    EventBus.on(UIElementName.INCREASE_STAKE, this.handleIncreaseButton, this);
    EventBus.on(UIElementName.ALL_IN, this.handleAllInButton, this);
    EventBus.on(UIElementName.DEAL, this.handleDealButton, this);

    EventBus.on(UIElementName.HIT, this.handleHitButton, this);
    EventBus.on(UIElementName.STAND, this.handleStandButton, this);
    EventBus.on(UIElementName.DOUBLE, this.handleDoubleButton, this);
  }

  private updateLabels() {
    this.updateBalanceLabel(UIElementName.PLAYER_BALANCE, DEFAULT_BALANCE);
    this.updateBalanceLabel(UIElementName.DEALER_BALANCE, DEFAULT_BALANCE);
    this.updateDealText(STAKE);
  }

  private updateBalanceLabel(
    balanceLabel: UIElementName.PLAYER_BALANCE | UIElementName.DEALER_BALANCE,
    newBalance: number,
  ) {
    EventBus.emit(
      UIEvent.UPDATE_TEXT_AT_ELEMENT_ + balanceLabel,
      `\$${newBalance}`,
    );
  }

  private updateDealText(newDeal: number) {
    const newDealText = `DEAL \n${newDeal}$`;

    EventBus.emit(
      UIEvent.UPDATE_TEXT_AT_ELEMENT_ + UIElementName.DEAL,
      newDealText,
    );
  }

  private handleDecreaseButton() {
    EventBus.emit(BlackjackEvents.DECREASE);
    this.updateDealText(this.blackjack.currentStake);
  }

  private handleIncreaseButton() {
    EventBus.emit(BlackjackEvents.INCREASE);
    this.updateDealText(this.blackjack.currentStake);
  }

  private handleAllInButton() {
    EventBus.emit(BlackjackEvents.ALL_IN);
    this.updateDealText(this.blackjack.currentStake);
  }

  private handleDealButton() {
    EventBus.emit(UIEvent.DISABLE_BUTTON_ + UIElementName.DEAL);
    EventBus.emit(UIEvent.DISABLE_BUTTON_ + UIElementName.DECREASE_STAKE);
    EventBus.emit(UIEvent.DISABLE_BUTTON_ + UIElementName.INCREASE_STAKE);
    EventBus.emit(UIEvent.DISABLE_BUTTON_ + UIElementName.ALL_IN);

    EventBus.emit(BlackjackEvents.DEAL);

    EventBus.emit(UIEvent.ENABLE_BUTTON_ + UIElementName.HIT);
    EventBus.emit(UIEvent.ENABLE_BUTTON_ + UIElementName.DOUBLE);
    EventBus.emit(UIEvent.ENABLE_BUTTON_ + UIElementName.STAND);
  }

  private handleHitButton() {
    EventBus.emit(BlackjackEvents.HIT);
  }

  private handleStandButton() {
    EventBus.emit(BlackjackEvents.STAND);
  }

  private handleDoubleButton() {
    EventBus.emit(BlackjackEvents.DOUBLE);
  }
}
