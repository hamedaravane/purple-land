interface ToggleSwitchConfig {
  width?: number;
  height?: number;
  initialState?: boolean;
  onColor?: number;
  offColor?: number;
  circleScale?: number;
  onToggle?: (isOn: boolean) => void;
  minWidth?: number;
  minHeight?: number;
}

export default class ToggleSwitch extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private toggleCircle: Phaser.GameObjects.Ellipse;
  private isOn: boolean;
  private onColor: number;
  private offColor: number;
  private onToggle?: (isOn: boolean) => void;

  constructor(scene: Phaser.Scene, x: number, y: number, config?: ToggleSwitchConfig) {
    super(scene, x, y);

    const {
      width = 60,
      height = 30,
      initialState = false,
      onColor = 0x00ff00,
      offColor = 0xff0000,
      circleScale = 0.8,
      onToggle,
      minWidth = 48,
      minHeight = 48,
    } = config || {};

    const finalWidth = Math.max(width, minWidth);
    const finalHeight = Math.max(height, minHeight);

    this.isOn = initialState;
    this.onColor = onColor;
    this.offColor = offColor;
    this.onToggle = onToggle;

    this.background = scene.add
      .rectangle(0, 0, finalWidth, finalHeight, this.isOn ? onColor : offColor)
      .setOrigin(0.5);

    const diameter = finalHeight * circleScale;
    this.toggleCircle = scene.add
      .ellipse(this.isOn ? finalWidth / 4 : -finalWidth / 4, 0, diameter, diameter, 0xffffff)
      .setOrigin(0.5);

    this.background.setInteractive().on('pointerdown', () => this.setToggle(!this.isOn));

    this.add([this.background, this.toggleCircle]);
    scene.add.existing(this);
  }

  setToggle(value: boolean) {
    this.isOn = value;
    this.background.setFillStyle(this.isOn ? this.onColor : this.offColor);
    this.toggleCircle.x = this.isOn ? this.background.width / 4 : -this.background.width / 4;
    this.onToggle && this.onToggle(this.isOn);
  }

  isToggled() {
    return this.isOn;
  }
}
