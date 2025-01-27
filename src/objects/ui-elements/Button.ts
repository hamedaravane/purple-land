type ColorStyle = 'blue' | 'pink' | 'yellow' | 'purple' | 'green';
type State = 'unpressed' | 'pressed';
type Shape = 'rect' | 'circle' | 'square';
type CornerRadius = 'sharp' | 'rounded';

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
  config: ButtonConfig;
  sprite: Phaser.GameObjects.Sprite;
  text: Phaser.GameObjects.Text;
  constructor(scene: Phaser.Scene, x: number, y: number, config: ButtonConfig) {
    super(scene, x, y);
    this.config = config;

    this.sprite = new Phaser.GameObjects.Sprite(
      scene,
      0,
      0,
      'ui',
      generateButton(this.config),
    );
    const defaultTextStyles: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'LuckiestGuy',
      fontSize: 16,
      color: '#ffffff',
      align: 'center',
      shadow: { offsetY: 2, color: '#00000030', blur: 0, fill: true },
    };
    this.text = new Phaser.GameObjects.Text(
      scene,
      0,
      -5,
      'PLAY',
      defaultTextStyles,
    ).setOrigin(0.5, 0.5);
    this.add([this.sprite, this.text]);
    scene.add.existing(this);

    scene.input.on('pointerdown', () => {
      this.pressButton();
    });
    scene.input.on('pointerup', () => {
      this.unpressedButton();
    });
  }

  private pressButton() {
    this.sprite.setFrame(generateButton({ ...this.config, state: 'pressed' }));
    this.text.y = -2;
  }

  private unpressedButton() {
    this.sprite.setFrame(
      generateButton({ ...this.config, state: 'unpressed' }),
    );
    this.text.y = -5;
  }
}
