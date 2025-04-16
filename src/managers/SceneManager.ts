export class SceneManager {
  private game: Phaser.Game;

  private static instance: SceneManager | null = null;

  private constructor(game: Phaser.Game) {
    this.game = game;
  }

  public static getInstance(game: Phaser.Game): SceneManager {
    if (SceneManager.instance) {
      return SceneManager.instance;
    }

    SceneManager.instance = new SceneManager(game);
    return SceneManager.instance;
  }

  /**
   * Start scene (current wil be stopped)
   * @param key - sceneKey
   * @param data - extra data to add to a scene
   */
  public start(key: string, data?: object): void {
    this.game.scene.start(key, data);
  }

  /**
   * Switch scene (current not be stopped)
   * @param from - from sceneKey
   * @param to - to sceneKey
   * @param data - extra data to add to a scene
   */
  public switchTo(from: string, to: string, data?: object): void {
    this.game.scene.switch(from, to, data);
  }

  public pauseCurrent(): void {
    const current = this.game.scene.getScenes(true)[0];
    if (current) {
      current.scene.pause();
    }
  }

  public resume(key?: string): void {
    if (key) {
      this.game.scene.resume(key);
    } else {
      const current = this.game.scene.getScenes(true)[0];
      if (current) {
        current.scene.resume();
      }
    }
  }
}
