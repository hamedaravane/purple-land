import Phaser from 'phaser';

export class Bubble extends Phaser.Physics.Arcade.Sprite {
  public color: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    color: string,
  ) {
    super(scene, x, y, texture);
    this.color = color;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setCircle(this.width / 2);
    (this.body as Phaser.Physics.Arcade.Body).setImmovable(true);
  }

  public pop(): void {
    // Example pop effect
    this.scene.add.tween({
      targets: this,
      scale: 0,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      },
    });
  }
}
