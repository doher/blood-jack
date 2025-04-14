import { Scene } from 'phaser';
import { SceneManager } from '../managers/SceneManager.ts';
import { SceneType } from './constants.ts';

export class Menu extends Scene {
  private sceneManager: SceneManager;

  constructor() {
    super(SceneType.MENU);
  }

  public preload() {
    this.sceneManager = SceneManager.getInstance(this.game);
    console.log('Preload' + SceneType.MENU);
  }

  public create() {
    console.log('Load' + SceneType.GAME);
    this.sceneManager.start(SceneType.GAME);
  }
}
