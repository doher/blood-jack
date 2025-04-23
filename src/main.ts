import type { Types } from 'phaser';
import { Game, Scale } from 'phaser';
import { Boot } from './scenes/Boot';
import { MainGame } from './scenes/MainGame.ts';
import { Menu } from './scenes/Menu.ts';

const config: Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: 1920,
  height: 1080,
  parent: 'game-container',
  backgroundColor: '#283742',
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  scene: [Boot, Menu, MainGame],
};

export default new Game(config);
