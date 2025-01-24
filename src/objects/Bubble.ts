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
    color: ColorObj = PINK,
    isShooter: boolean = false,
    texture: string = 'bubbles',
  ) {
    super(scene, x, y, texture, color.label);

    this.isShooter = isShooter;
    this.color = color;
    this.diameter = diameter;

    this.setBubbleSize();
    this.initPhysics();
    this.scene.add.existing(this);
  }

  /**
   * @description Fires a shot in a given direction with a specified speed.
   * - Think of this like aiming and shooting an arrow at a specific point. The arrow figures out how far and in what direction
   *   it needs to travel, then adjusts its velocity so it travels at the desired speed in that direction.
   * To learn more about the math and geometry behind this, check out:
   * https://en.wikipedia.org/wiki/Unit_vector
   * and https://en.wikipedia.org/wiki/Pythagorean_theorem
   *
   * @param {Object} direction - The target direction to shoot towards. It is an object with `x` and `y` coordinates.
   * @param {number} [speed=600] - The speed at which the shot should travel. Defaults to 600 if not provided.
   * @author Hamed Arghavan
   * @note If `magnitude` is 0 (e.g., the direction is exactly at the shooter's position), no shot will be fired.
   */
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

  override setPosition(x: number, y: number) {
    this.scene.tweens.add({
      targets: this,
      x,
      y,
      duration: 100,
      ease: 'Power2',
    });
    return super.setPosition(x, y);
  }

  setBubbleSize() {
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
