interface DialogBoxConfig {
  width?: number;
  height?: number;
  message?: string;
  hasCloseButton?: boolean;
  onClose?: () => void;
  backgroundColor?: number;
  backgroundAlpha?: number;
  strokeColor?: number;
  strokeThickness?: number;
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
  closeIconTexture?: string;
}

export default class DialogBox extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;
  private closeButton?: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config?: DialogBoxConfig,
  ) {
    super(scene, x, y);

    const {
      width = 300,
      height = 150,
      message = '',
      hasCloseButton = true,
      onClose,
      backgroundColor = 0x000000,
      backgroundAlpha = 0.8,
      strokeColor = 0xffffff,
      strokeThickness = 2,
      textStyle,
      closeIconTexture = 'close-icon',
    } = config || {};

    this.background = scene.add
      .rectangle(0, 0, width, height, backgroundColor, backgroundAlpha)
      .setOrigin(0.5);
    this.background.setStrokeStyle(strokeThickness, strokeColor);

    const style = {
      fontSize: '16px',
      color: '#ffffff',
      wordWrap: { width: width - 20 },
      align: 'center',
      ...textStyle,
    };
    this.text = scene.add.text(0, 0, message, style).setOrigin(0.5);

    this.add([this.background, this.text]);

    if (hasCloseButton) {
      this.closeButton = scene.add
        .image(width / 2 - 20, -height / 2 + 20, closeIconTexture)
        .setInteractive()
        .setScale(0.5);
      this.closeButton.on('pointerdown', () => {
        onClose && onClose();
        this.destroy();
      });
      this.add(this.closeButton);
    }

    scene.add.existing(this);
  }

  setMessage(message: string) {
    this.text.setText(message);
  }
}
