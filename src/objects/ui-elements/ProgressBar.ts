interface ProgressBarConfig {
  width?: number;
  height?: number;
  backgroundColor?: number;
  fillColor?: number;
  initialProgress?: number;
}

export default class ProgressBar extends Phaser.GameObjects.Container {
  private barBackground: Phaser.GameObjects.Rectangle;
  private barFill: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config?: ProgressBarConfig,
  ) {
    super(scene, x, y);

    const {
      width = 200,
      height = 48,
      backgroundColor = 0x808080,
      fillColor = 0x00ff00,
      initialProgress = 0,
    } = config || {};

    this.barBackground = scene.add
      .rectangle(0, 0, width, height, backgroundColor)
      .setOrigin(0.5);
    this.barFill = scene.add
      .rectangle(-width / 2, 0, 0, height, fillColor)
      .setOrigin(0, 0.5);

    this.add([this.barBackground, this.barFill]);
    scene.add.existing(this);
    this.setProgress(initialProgress);
  }

  setProgress(value: number) {
    const totalWidth = this.barBackground.width;
    this.barFill.width = Phaser.Math.Clamp(value, 0, 1) * totalWidth;
  }
}
