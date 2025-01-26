interface ButtonConfig {
  text?: string;
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
  scale?: number;
  hoverScale?: number;
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
      scale = 0.8,
      hoverScale = 0.85,
      callback,
    } = config || {};

    const buttonImage = scene.add.image(0, 0, texture).setInteractive();
    buttonImage.setScale(scale);

    const defaultStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
    };
    const mergedStyle = { ...defaultStyle, ...textStyle };
    const buttonText = scene.add.text(0, 0, text, mergedStyle).setOrigin(0.5);

    buttonImage.on('pointerover', () => buttonImage.setScale(hoverScale));
    buttonImage.on('pointerout', () => buttonImage.setScale(scale));
    buttonImage.on('pointerdown', () => callback && callback());

    this.add([buttonImage, buttonText]);
    scene.add.existing(this);
  }
}
