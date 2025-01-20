import { ColorObj } from '@constants/BubbleColors';
import { BubbleCluster } from '@objects/BubbleCluster';
import Phaser from 'phaser';

export enum NeighborPositions {
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  LEFT,
  RIGHT,
  TOP_LEFT,
  TOP_RIGHT,
}

export class Bubble extends Phaser.GameObjects.Sprite {
  private _bubbleType: 'static' | 'shooting';
  private readonly _color: ColorObj;
  private readonly _width: number;
  private _neighbors: Map<NeighborPositions, Bubble | null | 1>;

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

  /** Getter for the bubble's color */
  get color() {
    return this._color;
  }

  get bubbleType(): 'static' | 'shooting' {
    return this._bubbleType;
  }

  set bubbleType(value: 'static' | 'shooting') {
    this._bubbleType = value;
  }

  get neighbors(): Map<NeighborPositions, Bubble | null | 1> {
    return this._neighbors;
  }

  assignNeighbor(position: NeighborPositions, value: Bubble | null | 1) {
    this._neighbors.set(position, value);
  }

  /** Pop the bubble and clean up references */
  pop() {
    this.destroy();
  }

  /** Make the bubble fall with physics */
  fall() {
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.enable = true;
      this.body.setVelocityY(200);
    }
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

  /** Check if this bubble collides with any in the given cluster */
  checkCollision(cluster: BubbleCluster): Bubble | null {
    for (const targetBubble of cluster.getBubbles()) {
      if (this.isOverlapping(targetBubble)) {
        return targetBubble;
      }
    }
    return null;
  }

  /** Snap the bubble to a specified position */
  snapTo(x: number, y: number): void {
    this.scene.tweens.add({
      targets: this,
      x,
      y,
      duration: 100,
      ease: 'Power2',
    });
  }

  /** Check overlap with another bubble */
  private isOverlapping(targetBubble: Bubble): boolean {
    const dx = this.x - targetBubble.x;
    const dy = this.y - targetBubble.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < this._width;
  }

  /** Set the visual size of the bubble */
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

  /** Initialize physics for the bubble */
  private initPhysics() {
    this.scene.physics.add.existing(this);
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setCollideWorldBounds(true);
      this.body.setVelocity(0, 0);
      this.body.setBounce(1, 1);
    }
  }

  /** Cleanup when the bubble is destroyed */
  public destroy(...args: any[]) {
    this._neighbors.clear();
    super.destroy(...args);
  }
}
