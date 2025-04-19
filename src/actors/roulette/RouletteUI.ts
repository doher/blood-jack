import { RouletteEvent } from './constants.ts';
import { EventBus } from '../../EventBus.ts';
import { RouletteView } from '../../views/roullete-view/RouletteView.ts';
import {
  RouletteFrame,
  ShopFrame,
} from '../../managers/game-object-factory/imageConstants.ts';
import { ShopBulletsType } from '../../views/shop-view/BulletsSideView.ts';

export const enum RouletteBulletsType {
  RED = RouletteFrame.ROULETTE_BULLET_RED,
  YELLOW = RouletteFrame.ROULETTE_BULLET_YELLOW,
  GREEN = RouletteFrame.ROULETTE_BULLET_GREEN,
}

export const SCALE_TYPES = [
  [
    RouletteBulletsType.RED,
    RouletteBulletsType.RED,
    RouletteBulletsType.YELLOW,
  ],
  [
    RouletteBulletsType.RED,
    RouletteBulletsType.GREEN,
    RouletteBulletsType.YELLOW,
  ],
  [
    RouletteBulletsType.GREEN,
    RouletteBulletsType.GREEN,
    RouletteBulletsType.YELLOW,
  ],
];

export class RouletteUI {
  public rouletteView: RouletteView;

  constructor(private scene: Phaser.Scene) {
    this.create();
    this.setupEventListeners();
  }

  private create() {
    this.rouletteView = new RouletteView(this.scene);
  }

  private setupEventListeners() {
    EventBus.on(RouletteEvent.SHOW_ROULETTE_SCREEN, this.show, this);
  }

  private show(playerBullets: number[]) {
    const bulletsFromFirstRound = 0;
    const bulletsFromSecondRound = 1;

    const playerBulletsFrames: RouletteBulletsType[] = [
      ...SCALE_TYPES[playerBullets[bulletsFromFirstRound]],
      ...SCALE_TYPES[playerBullets[bulletsFromSecondRound]],
    ];

    this.rouletteView.show(playerBulletsFrames);
  }
}
