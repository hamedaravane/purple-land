import {
  DEFAULT_BUTTON_CORNER_RADIUS,
  DEFAULT_BUTTON_HEIGHT,
  DEFAULT_BUTTON_WIDTH,
  TOP_BUTTON_POSITION_OFFSET,
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
    this.bottomGraphics.fillStyle(bottomColor);
    this.bottomGraphics.fillRoundedRect(-width / 2, 0, width, height, cornerRadius);
    this.add(this.bottomGraphics);

    this.topGraphics = scene.add.graphics();
    this.topGraphics.fillStyle(topColor);
    this.topGraphics.fillRoundedRect(-width / 2, 0, width, height * TOP_BUTTON_SCALE, cornerRadius);
    this.add(this.topGraphics);

    if (label) {
      this.labelText = scene.add.text(0, (height * TOP_BUTTON_SCALE) / 2, label, {
        fontFamily: 'LuckiestGuy',
        fontSize: '18px',
        color: '#FFFFFF',
      });
      this.labelText.setOrigin(0.5);
      this.add(this.labelText);
    }

    this.originalTopY = this.topGraphics.y;
    this.pressedTopY = this.originalTopY + height * TOP_BUTTON_POSITION_OFFSET;

    this.setSize(width, height * 1.5);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, 0, width, height * 1.5),
      Phaser.Geom.Rectangle.Contains,
    );

    this.on('pointerdown', this.onPointerDown, this);
    this.on('pointerup', this.onPointerUp, this);
    this.on('pointerout', this.onPointerOut, this);

    scene.add.existing(this);
  }

  private onPointerDown() {
    this.topGraphics.y = this.pressedTopY;
    this.bottomGraphics.y = this.pressedTopY;
    this.bottomGraphics.scaleY = TOP_BUTTON_SCALE;
    if (this.labelText) {
      this.labelText.y += this.height * TOP_BUTTON_POSITION_OFFSET;
    }
  }

  private onPointerUp() {
    this.topGraphics.y = this.originalTopY;
    this.bottomGraphics.y = this.originalTopY;
    this.bottomGraphics.scaleY = 1;
    if (this.labelText) {
      this.labelText.y -= this.height * TOP_BUTTON_POSITION_OFFSET;
    }
  }

  private onPointerOut() {
    this.topGraphics.y = this.originalTopY;
    this.bottomGraphics.y = this.originalTopY;
    this.bottomGraphics.scaleY = 1;
  }
}
