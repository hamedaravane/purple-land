import { ColorObj, PINK } from '@constants/BubbleColors';
import Phaser from 'phaser';
import { Coordinate } from '@types';

export class Bubble extends Phaser.GameObjects.Sprite {
  isShooter: boolean;
  color: ColorObj;
  diameter: number;
  gridCoordinates: Coordinate;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    diameter: number,
    fillColor: ColorObj = PINK,
    isShooter: boolean = false,
    texture: string = 'bubbles',
  ) {
    super(scene, x, y, texture, fillColor.label);

    this.isShooter = isShooter;
    this.color = fillColor;
    this.diameter = diameter;

    this.setBubbleSize();
    this.initPhysics();
    this.scene.add.existing(this);
  }

  shot(direction: { x: number; y: number }, speed: number = 600) {
    if (!this.isShooter) return;
    const deltaX = direction.x - this.x;
    const deltaY = direction.y - this.y;
    const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (magnitude > 0) {
      const normalizeX = deltaX / magnitude;
      const normalizeY = deltaY / magnitude;

      (this.body as Phaser.Physics.Arcade.Body).setVelocity(
        normalizeX * speed,
        normalizeY * speed,
      );
    }
  }

  snapTo(x: number, y: number): void {
    this.scene.tweens.add({
      targets: this,
      x,
      y,
      duration: 100,
      ease: 'Power2',
    });
    this.setPosition(x, y);
  }

  private setBubbleSize() {
    if (this.width > 0) {
      const scaleFactor = this.diameter / this.width;
      this.setScale(scaleFactor);
    } else {
      this.once(Phaser.Loader.Events.COMPLETE, () => {
        const scaleFactor = this.diameter / this.width;
        this.setScale(scaleFactor);
      });
    }
  }

  private initPhysics() {
    this.scene.physics.add.existing(this);
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setCollideWorldBounds(true);
      this.body.setVelocity(0, 0);
      this.body.setBounce(1, 1);
    }
  }
}
