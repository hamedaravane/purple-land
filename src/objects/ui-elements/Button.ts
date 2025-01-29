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
  config: ButtonConfig;
  sprite: Phaser.GameObjects.Sprite;
  text: Phaser.GameObjects.Text;
  constructor(
    scene: Phaser.Scene,
    text: string,
    x: number,
    y: number,
    config: ButtonConfig,
  ) {
    super(scene, x, y);
    this.config = config;
    this.sprite = new Phaser.GameObjects.Sprite(
      scene,
      0,
      0,
      'ui',
      generateButton(this.config),
    );

    // this.setSpriteSize();
    const defaultTextStyles: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'LuckiestGuy',
      fontSize: 20,
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

    scene.input.on('pointerdown', () => {
      this.pressButton();
    });
    scene.input.on('pointerup', () => {
      this.unpressedButton();
    });
  }

  private pressButton() {
    this.sprite.setFrame(generateButton({ ...this.config, state: 'pressed' }));
    this.text.y = -1;
  }

  private unpressedButton() {
    this.sprite.setFrame(
      generateButton({ ...this.config, state: 'unpressed' }),
    );
    this.text.y = -5;
  }

  // private setSpriteSize() {
  //   const { width, height } = this.config;
  //   const horizontalScale = width / this.sprite.width;
  //   const verticalScale = height / this.sprite.height;
  //   this.sprite.setScale(horizontalScale, verticalScale);
  // }
}
