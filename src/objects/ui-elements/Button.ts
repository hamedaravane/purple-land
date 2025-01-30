import {
  DEFAULT_BUTTON_CORNER_RADIUS,
  DEFAULT_BUTTON_HEIGHT,
  DEFAULT_BUTTON_WIDTH,
  TOP_BUTTON_POSITION_SCALE,
  TOP_BUTTON_SCALE,
} from '@constants';
import { darkenColor } from '@utils';
import { COLOR_MAP, KnownColor } from '@types';

export default class Button extends Phaser.GameObjects.Container {
  private readonly topGraphics: Phaser.GameObjects.Graphics;
  private readonly bottomGraphics: Phaser.GameObjects.Graphics;
  private readonly labelText?: Phaser.GameObjects.Text;

  private readonly originalTopY: number;
  private readonly pressedTopY: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    colorName: KnownColor,
    label?: string,
    width: number = DEFAULT_BUTTON_WIDTH,
    height: number = DEFAULT_BUTTON_HEIGHT,
    cornerRadius: number = DEFAULT_BUTTON_CORNER_RADIUS,
  ) {
    super(scene, x, y);

    const topColor = COLOR_MAP[colorName];
    const bottomColor = darkenColor(topColor);

    this.bottomGraphics = scene.add.graphics();
    this.drawRoundedRect(this.bottomGraphics, bottomColor, width, height, cornerRadius, 0, 0);
    this.add(this.bottomGraphics);

    this.topGraphics = scene.add.graphics();
    this.drawRoundedRect(this.topGraphics, topColor, width, height * TOP_BUTTON_SCALE, cornerRadius, 0, 0);
    this.add(this.topGraphics);

    if (label) {
      this.labelText = scene.add.text(0, 0, label, {
        fontFamily: 'LuckiestGuy',
        fontSize: '18px',
        color: '#FFFFFF',
      });
      this.labelText.setOrigin(0.5, 0.5);
      this.labelText.y = (height * TOP_BUTTON_SCALE) / 2;
      this.add(this.labelText);
    }

    this.originalTopY = this.topGraphics.y;
    this.pressedTopY = this.originalTopY + height * TOP_BUTTON_POSITION_SCALE;

    this.setSize(width, height);
    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);

    this.on('pointerdown', this.onPointerDown, this);
    this.on('pointerup', this.onPointerUp, this);
    this.on('pointerout', this.onPointerOut, this);

    scene.add.existing(this);
  }

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
    graphics.fillStyle(color);
    graphics.fillRoundedRect(-width / 2 + offsetX, offsetY, width, height, radius);
  }

  private onPointerDown(): void {
    this.topGraphics.y = this.pressedTopY;
    this.bottomGraphics.y = this.pressedTopY;
    this.bottomGraphics.scaleY = TOP_BUTTON_SCALE;
    if (this.labelText) {
      this.labelText.y += this.height * TOP_BUTTON_POSITION_SCALE;
    }
  }

  private onPointerUp(): void {
    this.topGraphics.y = this.originalTopY;
    this.bottomGraphics.y = this.originalTopY;
    this.bottomGraphics.scaleY = 1;
    if (this.labelText) {
      this.labelText.y -= this.height * TOP_BUTTON_POSITION_SCALE;
    }
  }

  private onPointerOut() {
    this.topGraphics.y = this.originalTopY;
    this.bottomGraphics.y = this.originalTopY;
    this.bottomGraphics.scaleY = 1;
  }
}
