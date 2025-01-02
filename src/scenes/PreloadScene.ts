import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    // Example: load images, spritesheets, audio
    // this.load.image('orb', 'assets/orb.png');
    // this.load.image('glitchWave', 'assets/glitchWave.png');
  }

  create(): void {
    this.scene.start('MainScene');
  }
}
