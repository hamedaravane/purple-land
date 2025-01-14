import BubbleColors from '@constants/BubbleColors.ts';

export class Bubble extends Phaser.GameObjects.Sprite {
  private readonly bubbleType: 'static' | 'shooting';
  private readonly _color: string;
  public neighbors: Bubble[] = [];
  private readonly _diameter: number; // Store the target diameter

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    diameter: number, // Desired diameter of the bubble
    bubbleType: 'static' | 'shooting' = 'static',
    fillColor: keyof typeof BubbleColors = 'Red',
  ) {
    super(scene, x, y, `${fillColor}`);
    this.bubbleType = bubbleType;
    this._color = fillColor;
    this._diameter = diameter;

    this.scene.add.existing(this);

    // Adjust sprite scale to match the desired diameter
    this.setBubbleSize();

    // Initialize physics
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

  private setBubbleSize() {
    const originalWidth = this.width; // Original width of the sprite
    const originalHeight = this.height; // Original height of the sprite

    // Ensure the texture has been loaded and the size is correct
    if (originalWidth > 0 && originalHeight > 0) {
      const scaleFactor = this._diameter / originalWidth; // Calculate the scale factor
      this.setScale(scaleFactor); // Scale the sprite to match the desired diameter
    } else {
      // Fallback if texture hasn't been loaded yet
      this.once(Phaser.Loader.Events.COMPLETE, () => {
        const scaleFactor = this._diameter / this.width;
        this.setScale(scaleFactor);
      });
    }
  }

  private initPhysics() {
    this.scene.physics.add.existing(this);
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      const radius = this._diameter / 2; // Use target diameter for the physics body
      this.body.setCollideWorldBounds(true);
      this.body.setCircle(radius, -radius, -radius); // Adjust circle to match scaled bubble
      this.body.setVelocity(0, 0);
    }
  }
}
