import { ShopView } from '../views/shop-view/ShopView.ts';
import { EventBus } from '../EventBus.ts';
import { UI_Event, UIElementName } from '../views/ui/constants.ts';
import { ShopEvent } from '../views/shop-view/constants.ts';

export class ShopUI {
  private isActive = false;

  private shopView: ShopView;

  constructor(private scene: Phaser.Scene) {
    this.create();
    this.setupEventListeners();
    this.initShopControls();
    this.hide();
  }

  private create() {
    this.shopView = new ShopView(this.scene);

    this.isActive = false;
    this.shopView.setVisible(this.isActive);
  }

  private setupEventListeners() {
    EventBus.on(UIElementName.SHOP, this.show, this);
    EventBus.on(UIElementName.SHOP_BACK, this.hide, this);
    EventBus.on(ShopEvent.SET_NEXT_ROUND, this.resetShop, this);
    EventBus.on(ShopEvent.RESET_SHOP, this.initShopControls, this);
  }

  private initShopControls() {
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.SHOP_SUBMIT);
    EventBus.emit(UI_Event.DISABLE_UI_ELEMENT_ + UIElementName.SHOP_CANCEL);

    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.SHOP_BUY_BAD);
    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.SHOP_BUY_SO_SO);
    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.SHOP_BUY_GOOD);
    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.SHOP_BULLET_INFO);
    EventBus.emit(UI_Event.ENABLE_UI_ELEMENT_ + UIElementName.SHOP_BACK);
  }

  private show() {
    this.isActive = true;
    this.hideBaseButtons();
    this.shopView.setVisible(this.isActive);
    this.scene.tweens.add({
      targets: this.shopView,
      alpha: {
        from: 0,
        to: 1,
      },
      ease: Phaser.Math.Easing.Quintic.Out,
      duration: 300,
    });
  }

  private hideBaseButtons() {
    EventBus.emit(UI_Event.HIDE_BASE_UI);
  }

  private hide() {
    this.isActive = false;
    this.scene.tweens.add({
      targets: this.shopView,
      alpha: {
        from: 1,
        to: 0,
      },
      ease: Phaser.Math.Easing.Quintic.Out,
      duration: 300,
      onComplete: () => {
        this.shopView.setVisible(this.isActive);
      },
    });
    this.showBaseButtons();
  }

  private resetShop() {
    this.hide();
    this.shopView.resetShopView();
  }

  private showBaseButtons() {
    EventBus.emit(UI_Event.SHOW_BASE_UI);
  }
}
