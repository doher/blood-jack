import { EventBus } from '../EventBus.ts';
import { SCALES_COSTS } from '../scenes/gameConstants.ts';
import { MainGame } from '../scenes/MainGame.ts';
import { ShopEvent } from '../views/shop-view/constants.ts';
import { RouletteUI } from './roulette/RouletteUI.ts';
import { UIElementName, UI_Event } from '../views/ui/constants.ts';
import type { Blackjack } from './blackjack/Blackjack.ts';
import { BALANCES, BlackjackEvents, STAKE } from './blackjack/constants.ts';
import { AnimationPlayingKey } from '../managers/animation-manager/AnimationManager.ts';
import { DealerEvents } from './dealer/constants.ts';
import { STOP_RAIN_SOUND } from '../views/Rain.ts';

const RUSSIAN_ROULETTE_ROUND = 2;

export class Player {
  public playerBullets: number[] = [];

  public dealerBullets: number[] = [];

  constructor(
    private scene: Phaser.Scene,
    private blackjack: Blackjack,
    private rouletteUI: RouletteUI,
  ) {
    this.setupEventListeners();
    this.initRound();
  }

  private initRound(
    playerPurchasedBullets?: number,
    dealerPurchasedBullets?: number,
  ) {
    MainGame.currentRoundIndex += 1;

    if (playerPurchasedBullets !== undefined) {
      this.playerBullets.push(playerPurchasedBullets);
    }

    if (dealerPurchasedBullets !== undefined) {
      this.dealerBullets.push(dealerPurchasedBullets);
    }

    /// TODO dev degud roullete
    // MainGame.currentRoundIndex = RUSSIAN_ROULETTE_ROUND;

    if (MainGame.currentRoundIndex === RUSSIAN_ROULETTE_ROUND) {
      this.hideFullPlayerUi();
      this.scene.time.delayedCall(1000, () => {
        EventBus.emit(
          DealerEvents.TALK_WITH_TEXT,
          [
            'The time for Russian roulette has come.',
            'I hope you buy the best cartridges.',
          ],
          AnimationPlayingKey.DEALER_ANGRY_TALK_PLAY,
        );

        this.scene.time.delayedCall(14300, () => {
          EventBus.emit(DealerEvents.SMILE);
          this.scene.time.delayedCall(3700, () => {
            this.initRouletteRound();
          });
        });
      });

      return;
    }

    const needToResetShop = MainGame.currentRoundIndex === 1;
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

  private hideFullPlayerUi() {
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.SHOP, true);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.DEAL, true);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.ALL_IN, true);
    EventBus.emit(
      UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.INCREASE_STAKE,
      true,
    );
    EventBus.emit(
      UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.DECREASE_STAKE,
      true,
    );
    EventBus.emit(
      UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.DECREASE_STAKE,
      true,
    );
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.STAND, true);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.HIT, true);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.DOUBLE, true);
    EventBus.emit(
      UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.PLAYER_BALANCE,
      true,
    );
    EventBus.emit(
      UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.DEALER_BALANCE,
      true,
    );
  }

  private initRouletteRound() {
    EventBus.emit(UI_Event.HIDE_BASE_UI, this);

    EventBus.emit(STOP_RAIN_SOUND);
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
    const balance = BALANCES[MainGame.currentRoundIndex];

    this.updateBalanceLabel(UIElementName.PLAYER_BALANCE, balance);
    this.updateBalanceLabel(UIElementName.DEALER_BALANCE, balance);

    this.blackjack.playerBalance.value = balance;
    this.blackjack.dealerBalance.value = balance;

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
    const newDealText = `DEAL \n$${newDeal}`;

    EventBus.emit(
      UI_Event.UPDATE_TEXT_AT_ELEMENT_ + UIElementName.DEAL,
      newDealText,
    );
  }

  private updateShopPrices() {
    const getCurrentRoundScalesPrices =
      SCALES_COSTS[MainGame.currentRoundIndex];

    const scaleBalancedNames = [
      UIElementName.SHOP_BUY_BAD,
      UIElementName.SHOP_BUY_SO_SO,
      UIElementName.SHOP_BUY_GOOD,
    ];

    getCurrentRoundScalesPrices.forEach((roundScalePrice, index) => {
      EventBus.emit(
        UI_Event.UPDATE_TEXT_AT_ELEMENT_ + scaleBalancedNames[index],
        `$${roundScalePrice}`,
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
