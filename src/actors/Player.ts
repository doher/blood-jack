import { EventBus } from '../EventBus.ts';
import { SCALES_COSTS } from '../scenes/gameConstants.ts';
import { ShopEvent } from '../views/shop-view/constants.ts';
import { RouletteUI } from './roulette/RouletteUI.ts';
import { UIElementName, UI_Event } from '../views/ui/constants.ts';
import type { Blackjack } from './blackjack/Blackjack.ts';
import { BALANCES, BlackjackEvents, STAKE } from './blackjack/constants.ts';

const RUSSIAN_ROULETTE_ROUND = 2;

export class Player {
  public currentRoundIndex = -1;

  public playerBullets: number[] = [0, 1]; /// TODO ONLY DEV, need to be empty

  public dealerBullets: number[] = [0, 1]; /// TODO ONLY DEV, need to be empty

  constructor(
    private scene: Phaser.Scene,
    private blackjack: Blackjack,
    private rouletteUI: RouletteUI,
  ) {
    this.setupEventListeners();
    this.initRound();
  }

  private initRound(playerPurchasedBullets?: number) {
    this.currentRoundIndex += 1;

    if (playerPurchasedBullets) {
      this.playerBullets.push(playerPurchasedBullets);
    }

    /// TODO dev degud roullete
    this.currentRoundIndex = RUSSIAN_ROULETTE_ROUND;

    if (this.currentRoundIndex === RUSSIAN_ROULETTE_ROUND) {
      console.log('RUSSIAN_ROULETTE_ROUND START');
      this.initRouletteRound();

      return;
    }

    const needToResetShop = this.currentRoundIndex === 1;
    if (needToResetShop) {
      EventBus.emit(ShopEvent.RESET_SHOP);
    }

    EventBus.emit(
      UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.INCREASE_STAKE,
      this,
    );
    EventBus.emit(
      UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.DECREASE_STAKE,
      this,
    );
    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.DEAL, this);
    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.ALL_IN, this);

    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.HIT, this);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.DOUBLE, this);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.STAND, this);

    this.scene.time.delayedCall(50, () => {
      this.updateLabels();
    });
  }

  private initRouletteRound() {
    EventBus.emit(UI_Event.HIDE_BASE_UI, this);
    /// TODO dealer talk about REZNYA!!!!
    this.rouletteUI.show(this.playerBullets, this.dealerBullets);
  }

  private setupEventListeners() {
    EventBus.on(UIElementName.DECREASE_STAKE, this.handleDecreaseButton, this);
    EventBus.on(UIElementName.INCREASE_STAKE, this.handleIncreaseButton, this);
    EventBus.on(UIElementName.ALL_IN, this.handleAllInButton, this);
    EventBus.on(UIElementName.DEAL, this.handleDealButton, this);

    EventBus.on(UIElementName.HIT, this.handleHitButton, this);
    EventBus.on(UIElementName.STAND, this.handleStandButton, this);
    EventBus.on(UIElementName.DOUBLE, this.handleDoubleButton, this);

    EventBus.on(ShopEvent.SET_NEXT_ROUND, this.initRound, this);
  }

  private updateLabels() {
    this.updateBalanceLabel(
      UIElementName.PLAYER_BALANCE,
      BALANCES[this.currentRoundIndex],
    );
    this.updateBalanceLabel(
      UIElementName.DEALER_BALANCE,
      BALANCES[this.currentRoundIndex],
    );
    this.updateDealText(STAKE);
    this.updateShopPrices();
  }

  private updateBalanceLabel(
    balanceLabel: UIElementName.PLAYER_BALANCE | UIElementName.DEALER_BALANCE,
    newBalance: number,
  ) {
    EventBus.emit(
      UI_Event.UPDATE_TEXT_AT_ELEMENT_ + balanceLabel,
      `\$${newBalance}`,
    );
  }

  private updateDealText(newDeal: number) {
    const newDealText = `DEAL \n${newDeal}$`;

    EventBus.emit(
      UI_Event.UPDATE_TEXT_AT_ELEMENT_ + UIElementName.DEAL,
      newDealText,
    );
  }

  private updateShopPrices() {
    const getCurrentRoundScalesPrices = SCALES_COSTS[this.currentRoundIndex];

    const scaleBalancedNames = [
      UIElementName.SHOP_BUY_BAD,
      UIElementName.SHOP_BUY_SO_SO,
      UIElementName.SHOP_BUY_GOOD,
    ];

    getCurrentRoundScalesPrices.forEach((RoundScalePrice, index) => {
      EventBus.emit(
        UI_Event.UPDATE_TEXT_AT_ELEMENT_ + scaleBalancedNames[index],
        `BALANCE\n${RoundScalePrice}$`,
      );
    });
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
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.DEAL);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.DECREASE_STAKE);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.INCREASE_STAKE);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.ALL_IN);

    EventBus.emit(BlackjackEvents.DEAL);

    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.HIT);
    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.DOUBLE);
    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.STAND);
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
