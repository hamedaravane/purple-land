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
  private readonly bottomGraphics: Phaser.GameObjects.Graphics;
  private readonly topContainer: Phaser.GameObjects.Container;
  private readonly topGraphics: Phaser.GameObjects.Graphics;
  private readonly icon?: Phaser.GameObjects.Image;
  private readonly labelText?: Phaser.GameObjects.Text;
  private readonly originalTopY: number;
  private readonly pressedTopY: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    colorName: KnownColor,
    iconKey?: string,
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

    this.topContainer = scene.add.container(0, 0);
    this.add(this.topContainer);

    this.topGraphics = scene.add.graphics();
    this.topGraphics.fillStyle(topColor);
    this.topGraphics.fillRoundedRect(-width / 2, 0, width, height * TOP_BUTTON_SCALE, cornerRadius);
    this.topContainer.add(this.topGraphics);

    if (iconKey) {
      this.icon = scene.add.image(0, 0, iconKey).setOrigin(0.5, 0);
      const iconScale = this.icon.height / 22;
      this.icon.setScale(iconScale);
      this.topContainer.add(this.icon);
    }

    if (label) {
      this.labelText = scene.add
        .text(0, 0, label, {
          fontFamily: 'LuckiestGuy',
          fontSize: '18px',
          color: '#FFFFFF',
        })
        .setOrigin(0.5, 0);
      this.topContainer.add(this.labelText);
      const { iconHeight, textSpacing } = this.icon
        ? { iconHeight: this.icon.displayHeight, textSpacing: 4 }
        : { iconHeight: 0, textSpacing: 8 };
      this.labelText.y = iconHeight + textSpacing;
    }

    this.originalTopY = this.topContainer.y;
    this.pressedTopY = this.originalTopY + height * TOP_BUTTON_POSITION_OFFSET;

    this.setSize(width, height);

    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);

    this.on('pointerdown', this.onPointerDown, this);
    this.on('pointerup', this.onPointerUp, this);
    this.on('pointerout', this.onPointerOut, this);

    scene.add.existing(this);
  }

  private onPointerDown() {
    this.topContainer.y = this.pressedTopY;
    this.bottomGraphics.y = this.pressedTopY;
    this.bottomGraphics.scaleY = TOP_BUTTON_SCALE;
  }

  private onPointerUp() {
    this.topContainer.y = this.originalTopY;
    this.bottomGraphics.y = this.originalTopY;
    this.bottomGraphics.scaleY = 1;
  }

  private onPointerOut() {
    this.topContainer.y = this.originalTopY;
    this.bottomGraphics.y = this.originalTopY;
    this.bottomGraphics.scaleY = 1;
  }
}
