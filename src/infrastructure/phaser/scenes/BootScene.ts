import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {}

  create(): void {
    // Move to the main scene after loading
    this.scene.start('MainScene');
  }
}
