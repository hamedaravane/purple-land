import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load assets if needed
  }

  create() {
    this.scene.start('MainScene');
  }
}
