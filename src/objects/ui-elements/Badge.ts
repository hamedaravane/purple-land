interface BadgeConfig {
  size?: number;
  count?: number;
  backgroundColor?: number;
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
  minSize?: number;
}

export default class Badge extends Phaser.GameObjects.Container {
  private badgeBackground: Phaser.GameObjects.Ellipse;
  private badgeText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, config?: BadgeConfig) {
    super(scene, x, y);

    const { size = 30, count = 0, backgroundColor = 0xff0000, textStyle, minSize = 48 } = config || {};

    const finalSize = Math.max(size, minSize);

    this.badgeBackground = scene.add.ellipse(0, 0, finalSize, finalSize, backgroundColor).setOrigin(0.5);

    const defaultStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'LuckiestGuy',
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
    };
    const mergedStyle = { ...defaultStyle, ...textStyle };
    this.badgeText = scene.add.text(0, 0, count.toString(), mergedStyle).setOrigin(0.5);

    this.add([this.badgeBackground, this.badgeText]);
    scene.add.existing(this);
  }

  setCount(count: number) {
    this.badgeText.setText(count.toString());
  }

  hideBadge() {
    this.setVisible(false);
  }

  showBadge() {
    this.setVisible(true);
  }
}
