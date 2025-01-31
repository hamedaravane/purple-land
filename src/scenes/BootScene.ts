import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.image('bg', 'assets/images/background/bg.png');
    this.load.image('icon-shop', 'assets/images/ui/icons/shop.png');
    this.load.image('icon-coins', 'assets/images/ui/icons/coins.png');
    this.load.image('icon-gem', 'assets/images/ui/icons/gem.png');
    this.load.image('icon-crown', 'assets/images/ui/icons/crown.png');
    this.load.image('icon-bubble', 'assets/images/ui/icons/bubble.png');
    this.load.atlas(
      'bubbles',
      'assets/images/bubbles/bubbles_spritesheet.png',
      'assets/images/bubbles/bubbles_spritesheet.json',
    );
    this.load.atlas('ui', 'assets/images/ui/ui.png', 'assets/images/ui/ui.json');
  }

  create() {
    this.scene.start('MainScene');
  }
}
