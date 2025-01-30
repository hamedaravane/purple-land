export type ColorStyle = 'blue' | 'pink' | 'yellow' | 'purple' | 'green';
export type State = 'unpressed' | 'pressed';
export type Shape = 'rect' | 'circle' | 'square';
export type CornerRadius = 'sharp' | 'rounded';

interface ButtonConfig {
  colorStyle: ColorStyle;
  state: State;
  shape: Shape;
  cornerRadius?: CornerRadius;
}

function generateButton(config: ButtonConfig) {
  const { colorStyle, state, shape } = config;
  const cornerRadius = config.cornerRadius ? `-${config.cornerRadius}` : '';
  return `${colorStyle}-${state}-${shape}${cornerRadius}`;
}

export default class Button extends Phaser.GameObjects.Container {
  private readonly config: ButtonConfig;
  private readonly sprite: Phaser.GameObjects.Sprite;
  private readonly text: Phaser.GameObjects.Text;
  private readonly callback?: () => void;

  constructor(
    scene: Phaser.Scene,
    text: string,
    x: number,
    y: number,
    config: ButtonConfig,
    callback?: () => void,
  ) {
    super(scene, x, y);

    this.config = config;
    this.callback = callback;

    this.sprite = new Phaser.GameObjects.Sprite(
      scene,
      0,
      0,
      'ui',
      generateButton(this.config),
    );

    const defaultTextStyles: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'LuckiestGuy',
      fontSize: '20px',
      color: '#ffffff',
      align: 'center',
      shadow: { offsetY: 2, color: '#00000030', blur: 0, fill: true },
    };

    this.text = new Phaser.GameObjects.Text(
      scene,
      0,
      -5,
      text,
      defaultTextStyles,
    ).setOrigin(0.5, 0.5);

    this.add([this.sprite, this.text]);
    scene.add.existing(this);

    this.setInteractive(
      new Phaser.Geom.Rectangle(
        -this.sprite.width / 2,
        -this.sprite.height / 2,
        this.sprite.width,
        this.sprite.height,
      ),
      Phaser.Geom.Rectangle.Contains,
    );

    this.on('pointerdown', this.pressButton, this);
    this.on('pointerup', this.unpressedButton, this);
    this.on('pointerout', this.resetButton, this);
  }

  private pressButton() {
    this.sprite.setFrame(generateButton({ ...this.config, state: 'pressed' }));
    this.text.setY(-1);
  }

  private unpressedButton() {
    this.sprite.setFrame(
      generateButton({ ...this.config, state: 'unpressed' }),
    );
    this.text.setY(-5);

    if (this.callback) {
      this.callback();
    }
  }

  private resetButton() {
    this.sprite.setFrame(
      generateButton({ ...this.config, state: 'unpressed' }),
    );
    this.text.setY(-5);
  }
}
