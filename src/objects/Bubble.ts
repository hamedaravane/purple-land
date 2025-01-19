import { ColorObj } from '@constants/BubbleColors';
import { BubbleCluster } from '@objects/BubbleCluster';

export class Bubble extends Phaser.GameObjects.Sprite {
  private bubbleType: 'static' | 'shooting';
  private readonly _color: ColorObj;
  private readonly _diameter: number;
  public neighbors: Set<Bubble>;

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

    this.bubbleType = bubbleType;
    this._color = fillColor;
    this._diameter = diameter;
    this.neighbors = new Set();

    this.scene.add.existing(this);
    this.setBubbleSize();
    this.initPhysics();
  }

  /** Getter for the bubble's color */
  get color() {
    return this._color;
  }

  /** Change the bubble to static type */
  setStatic() {
    this.bubbleType = 'static';
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

  /** Fire the bubble in a specified direction */
  shot(direction: { x: number; y: number }, speed: number = 600) {
    if (this.bubbleType !== 'shooting') return;

    const velocity = new Phaser.Math.Vector2(
      direction.x - this.x,
      direction.y - this.y,
    )
      .normalize()
      .scale(speed);
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setVelocity(velocity.x, velocity.y);
    }
  }

  /** Disable the physics body of the bubble */
  disablePhysics() {
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setVelocity(0, 0);
      this.body.enable = false;
    }
  }

  /** Add a neighbor bubble */
  addNeighbor(bubble: Bubble) {
    this.neighbors.add(bubble);
  }

  /** Remove a neighbor bubble */
  removeNeighbor(bubble: Bubble) {
    this.neighbors.delete(bubble);
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

  /** Check overlap with another bubble */
  private isOverlapping(targetBubble: Bubble): boolean {
    const dx = this.x - targetBubble.x;
    const dy = this.y - targetBubble.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this._diameter;
  }

  /** Set the visual size of the bubble */
  private setBubbleSize() {
    if (this.width > 0) {
      const scaleFactor = this._diameter / this.width;
      this.setScale(scaleFactor);
    } else {
      this.once(Phaser.Loader.Events.COMPLETE, () => {
        const scaleFactor = this._diameter / this.width;
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
    this.neighbors.clear();
    super.destroy(...args);
  }
}
