interface ButtonConfig {
  text?: string;
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
  minWidth?: number;
  minHeight?: number;
  callback?: () => void;
}

export default class Button extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    config?: ButtonConfig,
  ) {
    super(scene, x, y);

    const {
      text = '',
      textStyle,
      minWidth = 48,
      minHeight = 48,
      callback,
    } = config || {};

    const buttonImage = scene.add.image(0, 0, texture).setInteractive();
    const scaleX = minWidth / buttonImage.width;
    const scaleY = minHeight / buttonImage.height;
    const finalScale = Math.max(scaleX, scaleY);
    buttonImage.setScale(finalScale);

    const defaultStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    };
    const mergedStyle = { ...defaultStyle, ...textStyle };
    const buttonText = scene.add.text(0, 0, text, mergedStyle).setOrigin(0.5);

    buttonImage.on('pointerdown', () => callback && callback());

    this.add([buttonImage, buttonText]);
    scene.add.existing(this);
  }
}
