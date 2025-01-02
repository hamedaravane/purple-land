import Phaser from 'phaser';
import { config } from './config/GameConfig';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MainScene } from './scenes/MainScene';

class PurpleLandGame extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add('BootScene', BootScene);
    this.scene.add('PreloadScene', PreloadScene);
    this.scene.add('MainScene', MainScene);
    this.scene.start('BootScene');
    this.initTelegramIntegration();
  }

  private initTelegramIntegration(): void {
    window.Telegram.WebApp.ready();

    document.body.style.backgroundColor = window.Telegram.WebApp.themeParams.bg_color || '#0f022a';

    window.Telegram.WebApp.MainButton.setParams({
      text: 'Start Game',
      color: '#4CAF50',
      text_color: '#FFFFFF',
    });

    window.Telegram.WebApp.MainButton.show();
    window.Telegram.WebApp.MainButton.onClick(() => {
      console.log('Main Button Clicked');
      window.Telegram.WebApp.MainButton.hide();
      this.scene.start('MainScene');
    });
  }
}

window.addEventListener('load', () => {
  new PurpleLandGame();
});
