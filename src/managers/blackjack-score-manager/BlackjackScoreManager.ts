import type { Dealer } from '../../actors/Dealer.ts';
import type { Player } from '../../actors/Player.ts';

export class BlackjackScoreManager {
  constructor(
    private player: Player,
    private dealer: Dealer,
  ) {}
}
