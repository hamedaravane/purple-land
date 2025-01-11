export class Bubble extends Phaser.GameObjects.Ellipse {
  private readonly bubbleType: 'static' | 'shooting';
  private readonly _color: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    bubbleType: 'static' | 'shooting' = 'static',
    fillColor: number = 0xffffff,
  ) {
    super(scene, x, y, 25, 25, fillColor, 1);
    this.bubbleType = bubbleType;
    this._color = fillColor;
    scene.add.existing(this);

    if (bubbleType === 'shooting') {
      this.enablePhysics();
    }
  }

  public get color(): number {
    return this._color;
  }

  pop() {
    this.destroy();
  }

  shot(direction: { x: number; y: number }, speed: number = 600): void {
    if (this.bubbleType === 'shooting') {
      const directionX = direction.x - this.x;
      const directionY = direction.y - this.y;
      const magnitude = Math.sqrt(directionX ** 2 + directionY ** 2);

      if (magnitude > 0) {
        const normalizedX = directionX / magnitude;
        const normalizedY = directionY / magnitude;

        (this.body as Phaser.Physics.Arcade.Body).setVelocity(
          normalizedX * speed,
          normalizedY * speed,
        );
      }
    }
  }

  /**
   * Enable physics for the bubble.
   */
  enablePhysics() {
    if (!this.scene.physics.world) {
      console.error('Physics system not initialized in the scene.');
      return;
    }

    this.scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setVelocity(0, 0);
  }

  /**
   * Disable physics for the bubble.
   */
  disablePhysics() {
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setVelocity(0, 0);
      this.body.enable = false;
    }
  }
}
