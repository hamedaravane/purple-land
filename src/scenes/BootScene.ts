import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Minimal loading if needed
  }

  create(): void {
    this.scene.start('PreloadScene');
  }
}
