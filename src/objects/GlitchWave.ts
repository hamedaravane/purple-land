import Phaser from 'phaser';
import { Player } from './Player';

export class GlitchWave extends Phaser.GameObjects.Rectangle {
  private speed: number = 20; // Speed at which the wave advances
  private waveHeight: number = 100; // Wave thickness

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, scene.scale.width, 100, 0xff00ff, 0.4);
    scene.add.existing(this);

    this.setOrigin(0, 1);
  }

  public updateWave(delta: number) {
    // Move the wave upward
    const deltaSpeed = (this.speed * delta) / 1000;
    this.y -= deltaSpeed;
  }

  public checkPlayerCollision(player: Player): boolean {
    // Basic bounding box check
    const waveTop = this.y - this.waveHeight;
    return player.y < waveTop;
    // if player.y is above the wave top => collision
  }
}
