export type KnownColor = 'green' | 'yellow' | 'pink' | 'purple' | 'blue';

/** Map color names to their base (top) hex color */
const COLOR_MAP: Record<KnownColor, number> = {
  green: 0x67eb00,
  yellow: 0xffdb0a,
  pink: 0xfc8aff,
  purple: 0xc286ff,
  blue: 0x4cdafe,
};

/**
 * Darkens a numeric color by a given ratio (default 20%).
 */
function darkenColor(baseColor: number, ratio = 0.2): number {
  let r = (baseColor >> 16) & 0xff;
  let g = (baseColor >> 8) & 0xff;
  let b = baseColor & 0xff;

  r = Math.floor(r * (1 - ratio));
  g = Math.floor(g * (1 - ratio));
  b = Math.floor(b * (1 - ratio));

  return (r << 16) + (g << 8) + b;
}

/**
 * A fancy, rounded, “two-layer” button for Phaser 3
 * that takes a single color name and auto-calculates the darker color.
 */
export default class Button extends Phaser.GameObjects.Container {
  private topGraphics: Phaser.GameObjects.Graphics;
  private bottomGraphics: Phaser.GameObjects.Graphics;
  private labelText?: Phaser.GameObjects.Text;

  /** Original topGraphics y-position (for pressed-down animation) */
  private originalTopY: number;
  /** Pressed-down y-position */
  private pressedTopY: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    colorName: KnownColor,
    label?: string,
    width: number = 120,
    height: number = 50,
    cornerRadius: number = 12,
  ) {
    super(scene, x, y);

    const topColorHex = COLOR_MAP[colorName];
    const bottomColorHex = darkenColor(topColorHex, 0.25);

    this.bottomGraphics = scene.add.graphics();
    this.drawRoundedRect(this.bottomGraphics, bottomColorHex, width, height, cornerRadius, 0, 0);
    this.bottomGraphics.y = 3;
    this.add(this.bottomGraphics);

    this.topGraphics = scene.add.graphics();
    this.drawRoundedRect(this.topGraphics, topColorHex, width, height * 0.85, cornerRadius, 0, 0);
    this.add(this.topGraphics);

    if (label) {
      this.labelText = scene.add.text(0, 0, label, {
        fontFamily: 'LuckiestGuy',
        fontSize: '18px',
        color: '#FFFFFF',
      });
      this.labelText.setOrigin(0.5, 0.5);
      this.labelText.y = (height * 0.85) / 2;
      this.add(this.labelText);
    }

    this.originalTopY = this.topGraphics.y;
    this.pressedTopY = this.originalTopY + 5;

    this.setSize(width, height + 3);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, 0, width, height + 3),
      Phaser.Geom.Rectangle.Contains,
    );

    this.on('pointerdown', this.onPointerDown, this);
    this.on('pointerup', this.onPointerUp, this);
    this.on('pointerout', this.onPointerOut, this);

    scene.add.existing(this);
  }

  /**
   * Draws a filled rounded rectangle on a Graphics object
   * at local coords: center is (0,0).
   */
  private drawRoundedRect(
    graphics: Phaser.GameObjects.Graphics,
    color: number,
    width: number,
    height: number,
    radius: number,
    offsetX: number,
    offsetY: number,
  ) {
    graphics.clear();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(-width / 2 + offsetX, offsetY, width, height, radius);
  }

  private onPointerDown(): void {
    this.topGraphics.y = this.pressedTopY;
    if (this.labelText) {
      this.labelText.y += 5;
    }
  }

  private onPointerUp(): void {
    this.topGraphics.y = this.originalTopY;
    if (this.labelText) {
      this.labelText.y -= 5;
    }
  }

  private onPointerOut() {
    this.topGraphics.y = this.originalTopY;
  }
}
