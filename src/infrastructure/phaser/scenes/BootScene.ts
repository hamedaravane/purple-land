import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Preload assets here. e.g., bubble images, backgrounds
    this.load.image('bubble', 'assets/bubble.png');
  }

  create(): void {
    // Move to the main scene after loading
    this.scene.start('MainScene');
  }
}
