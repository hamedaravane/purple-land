import { ColorObj } from '@constants/BubbleColors';
import { BubbleCluster } from '@objects/BubbleCluster';
import Phaser from 'phaser';

export class Bubble extends Phaser.GameObjects.Sprite {
  public _bubbleType: 'static' | 'shooting';
  private readonly _color: ColorObj;
  private readonly _width: number;
  private _gridCoordinates: { col: number; row: number } | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    diameter: number,
    bubbleType: 'static' | 'shooting' = 'static',
    texture: string = 'bubbles',
    fillColor: ColorObj,
  ) {
    super(scene, x, y, texture, fillColor.label);

    this._bubbleType = bubbleType;
    this._color = fillColor;
    this._width = diameter;

    this.scene.add.existing(this);
    this.setBubbleSize();
    this.initPhysics();
  }

  get gridCoordinates(): { col: number; row: number } {
    if (this._gridCoordinates === null)
      throw new Error('Grid coordinates not set');
    return this._gridCoordinates;
  }

  set gridCoordinates(value: { col: number; row: number }) {
    this._gridCoordinates = value;
  }

  get color() {
    return this._color;
  }

  shot(direction: { x: number; y: number }, speed: number = 600) {
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

  checkCollision(cluster: BubbleCluster): Bubble | null {
    for (const targetBubble of cluster.getBubbles()) {
      if (this.isOverlapping(targetBubble)) {
        return targetBubble;
      }
    }
    return null;
  }

  snapTo(x: number, y: number): void {
    this.scene.tweens.add({
      targets: this,
      x,
      y,
      duration: 100,
      ease: 'Power2',
    });
  }

  private isOverlapping(targetBubble: Bubble): boolean {
    const dx = this.x - targetBubble.x;
    const dy = this.y - targetBubble.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < this._width;
  }

  private setBubbleSize() {
    if (this.width > 0) {
      const scaleFactor = this._width / this.width;
      this.setScale(scaleFactor);
    } else {
      this.once(Phaser.Loader.Events.COMPLETE, () => {
        const scaleFactor = this._width / this.width;
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

  public destroy(...args: any[]) {
    super.destroy(...args);
  }
}
