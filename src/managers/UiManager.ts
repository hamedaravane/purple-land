import { NAVBAR_BUTTON_SPACING_MULTIPLIER, NAVBAR_SCALE } from '@constants';
import Button from '@objects/ui-elements/Button.ts';
import { KnownColor } from '@types';

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
    const navbarHeight = this.screenHeight * NAVBAR_SCALE;
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
      { label: 'earn', iconKey: 'icon-bubble', color: 'pink' },
      { label: 'score', iconKey: 'icon-crown', color: 'purple' },
      { label: 'shop', iconKey: 'icon-shop', color: 'blue' },
      { label: 'level', iconKey: 'icon-gem', color: 'yellow' },
    ];
    const buttonCount = buttons.length;

    const buttonSpacing = this.screenWidth / (buttonCount + 1);
    buttons.forEach((btn, index) => {
      const xPos = (index + 1) * buttonSpacing - centerX;
      const yPos = -navbarHeight / NAVBAR_BUTTON_SPACING_MULTIPLIER;
      const button = new Button(
        this.scene,
        xPos,
        yPos,
        btn.color as KnownColor,
        btn.iconKey,
        btn.label,
        60,
        56,
      );
      this.bottomNavigation.add(button);
    });

    this.topNavigation = new Phaser.GameObjects.Container(this.scene, centerX, 0);
    this.contentContainer = new Phaser.GameObjects.Container(this.scene, centerX, 0);
    this.scene.add.existing(this.bottomNavigation);
    this.scene.add.existing(this.topNavigation);
    this.scene.add.existing(this.contentContainer);
  }
}
