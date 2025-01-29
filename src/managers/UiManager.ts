import Button, { ColorStyle } from '@objects/ui-elements/Button.ts';

export class UiManager {
  private readonly scene: Phaser.Scene;
  private readonly screenWidth: number;
  private readonly screenHeight: number;
  private readonly bottomNavigation: Phaser.GameObjects.Container;
  private readonly topNavigation: Phaser.GameObjects.Container;
  private readonly contentContainer: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.screenWidth = this.scene.scale.width;
    this.screenHeight = this.scene.scale.height;
    const navbarHeight = this.screenHeight * 0.12;
    console.log(navbarHeight);
    const centerX = this.screenWidth / 2;
    const centerY = this.screenHeight / 2;
    this.scene.add.image(centerX, centerY, 'bg');
    this.bottomNavigation = new Phaser.GameObjects.Container(
      this.scene,
      centerX,
      this.screenHeight - navbarHeight / 2,
    );
    const bottomNavRect = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      this.screenWidth,
      navbarHeight,
      0x999999,
      5,
    ).setBlendMode(Phaser.BlendModes.MULTIPLY);
    this.bottomNavigation.add(bottomNavRect);
    const buttons = [
      { label: '1', color: 'pink' },
      { label: '2', color: 'purple' },
      { label: '3', color: 'blue' },
      { label: '4', color: 'yellow' },
    ];
    const buttonCount = buttons.length;

    const buttonSpacing = this.screenWidth / (buttonCount + 1);
    buttons.forEach((btn, index) => {
      const xPos = (index + 1) * buttonSpacing - centerX;
      const button = new Button(this.scene, btn.label, xPos, -10, {
        colorStyle: btn.color as ColorStyle,
        state: 'unpressed',
        shape: 'square',
      });
      this.bottomNavigation.add(button);
    });

    this.topNavigation = new Phaser.GameObjects.Container(
      this.scene,
      centerX,
      0,
    );
    this.contentContainer = new Phaser.GameObjects.Container(
      this.scene,
      centerX,
      0,
    );
    this.scene.add.existing(this.bottomNavigation);
    this.scene.add.existing(this.topNavigation);
    this.scene.add.existing(this.contentContainer);
  }
}
