export class Bubble extends Phaser.GameObjects.Sprite {
  private bubbleType: 'static' | 'shooting';
  private readonly _color: { label: string; color: number };
  public neighbors: Bubble[] = [];
  private readonly _diameter: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    diameter: number,
    bubbleType: 'static' | 'shooting' = 'static',
    texture: string = 'bubbles',
    fillColor: { label: string; color: number },
  ) {
    super(scene, x, y, texture, fillColor.label);
    this.bubbleType = bubbleType;
    this._color = fillColor;
    this._diameter = diameter;
    this.scene.add.existing(this);
    this.setBubbleSize();
    this.initPhysics();
  }

  get color() {
    return this._color;
  }

  setStatic() {
    this.bubbleType = 'static';
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

  private setBubbleSize() {
    const originalWidth = this.width;
    const originalHeight = this.height;
    if (originalWidth > 0 && originalHeight > 0) {
      const scaleFactor = this._diameter / originalWidth;
      this.setScale(scaleFactor);
    } else {
      this.once(Phaser.Loader.Events.COMPLETE, () => {
        const scaleFactor = this._diameter / this.width;
        this.setScale(scaleFactor);
      });
    }
  }

  private initPhysics() {
    this.scene.physics.add.existing(this);
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      const radius = this._diameter / 2;
      this.body.setCollideWorldBounds(true);
      this.body.setCircle(radius, -radius, -radius);
      this.body.setVelocity(0, 0);
    }
  }
}
