import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.image('bg', 'assets/images/background/bg.png');
    this.load.atlas(
      'bubbles',
      'assets/images/bubbles/bubbles_spritesheet.png',
      'assets/images/bubbles/bubbles_spritesheet.json',
    );
  }

  create() {
    this.scene.start('GameScene');
  }
}
