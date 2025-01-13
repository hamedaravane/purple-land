export class Bubble extends Phaser.GameObjects.Ellipse {
  private readonly bubbleType: 'static' | 'shooting';
  private readonly _color: number;
  public neighbors: Bubble[] = [];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    diameter: number,
    bubbleType: 'static' | 'shooting' = 'static',
    fillColor: number = 0xffffff,
  ) {
    super(scene, x, y, diameter, diameter, fillColor, 1);
    this.bubbleType = bubbleType;
    this._color = fillColor;
    this.scene.add.existing(this);
    this.initPhysics();
  }

  get color() {
    return this._color;
  }

  setStatic() {
    (this as any).bubbleType = 'static';
  }

  pop() {
    this.destroy();
  }

  fall() {
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.enable = true;
      this.body.setVelocityY(200);
    }
  }

  shot(direction: { x: number; y: number }, speed: number = 600) {
    if (this.bubbleType !== 'shooting') return;
    const dx = direction.x - this.x;
    const dy = direction.y - this.y;
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    if (magnitude > 0) {
      const nx = dx / magnitude;
      const ny = dy / magnitude;
      (this.body as Phaser.Physics.Arcade.Body).setVelocity(
        nx * speed,
        ny * speed,
      );
    }
  }

  disablePhysics() {
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setVelocity(0, 0);
      this.body.enable = false;
    }
  }

  addNeighbor(bubble: Bubble) {
    if (!this.neighbors.includes(bubble)) {
      this.neighbors.push(bubble);
    }
  }

  removeNeighbor(bubble: Bubble) {
    const index = this.neighbors.indexOf(bubble);
    if (index !== -1) {
      this.neighbors.splice(index, 1);
    }
  }

  private initPhysics() {
    this.scene.physics.add.existing(this);
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setCollideWorldBounds(true);
      this.body.setCircle(this.width / 2);
      this.body.setVelocity(0, 0);
    }
  }
}
