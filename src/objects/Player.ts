// Player.ts

import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private moveDistance = 50;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // 1. Call Sprite constructor with 'scene'
    super(scene, x, y, '');

    // 2. Add the sprite to the scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // 3. Optionally create a rectangle or load an image
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x8f00ff, 1);
    graphics.fillRect(0, 0, 30, 30);
    graphics.generateTexture('playerRect', 30, 30);
    graphics.destroy();

    this.setTexture('playerRect');
    this.setOrigin(0.5);
  }

  public moveForward(): void {
    this.y -= this.moveDistance;
  }
}
