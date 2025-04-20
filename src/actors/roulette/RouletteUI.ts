import { RouletteView } from '../../views/roullete-view/RouletteView.ts';
import { RouletteFrame } from '../../managers/game-object-factory/imageConstants.ts';
import type { Blackjack } from '../blackjack/Blackjack.ts';

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

  constructor(
    private scene: Phaser.Scene,
    private blackjack: Blackjack,
  ) {
    this.create();
    this.setupEventListeners();
  }

  private create() {
    this.rouletteView = new RouletteView(this.scene, this.blackjack);
    this.rouletteView.setVisible(false);
  }

  private setupEventListeners() {}

  public show(playerBullets: number[], dealerBullets: number[]) {
    this.rouletteView.setVisible(true);

    const bulletsFromFirstRound = 0;
    const bulletsFromSecondRound = 1;

    const playerBulletsFrames: RouletteBulletsType[] = [
      RouletteBulletsType.YELLOW,
      ...SCALE_TYPES[playerBullets[bulletsFromFirstRound]],
      ...SCALE_TYPES[playerBullets[bulletsFromSecondRound]],
    ];

    const dealerBulletsFrames: RouletteBulletsType[] = [
      RouletteBulletsType.YELLOW,
      ...SCALE_TYPES[playerBullets[bulletsFromFirstRound]],
      ...SCALE_TYPES[playerBullets[bulletsFromSecondRound]],
    ];

    this.rouletteView.show(playerBulletsFrames, dealerBulletsFrames);
  }
}
