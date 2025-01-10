export class Bubble extends Phaser.GameObjects.Sprite {
  private readonly bubbleType: 'static' | 'shooting';
  private readonly _color: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    bubbleType: 'static' | 'shooting' = 'static',
    color: number = 0xffffff,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    this.bubbleType = bubbleType;
    this._color = color;
    scene.add.existing(this);
  }

  public get color(): number {
    return this._color;
  }

  pop() {
    this.destroy();
  }

  shoot() {
    if (this.bubbleType === 'shooting') {
      this.scene.input.on('pointerdown', () => {});
    }
  }
}
