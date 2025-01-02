import Phaser from 'phaser';

export class Orb extends Phaser.GameObjects.Ellipse {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 20, 20, 0xff00ff); // Magenta orb
    scene.add.existing(this);

    // You can add glow or pulse animations in the future
    this.setAlpha(0.9);
  }

  public activate() {
    // Make sure the orb is active and visible
    this.setActive(true);
    this.setVisible(true);
  }

  public collect() {
    // Hide or destroy the orb after collection
    this.destroy();
  }
}
