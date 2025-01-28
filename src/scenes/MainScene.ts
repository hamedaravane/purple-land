import Phaser from 'phaser';
import Button from '@objects/ui-elements/Button.ts';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    // const navBarHeight = 80;
    // const navBarY = screenHeight - navBarHeight;
    // this.add.rectangle(
    //   screenWidth / 2,
    //   navBarY + navBarHeight / 2,
    //   screenWidth,
    //   navBarHeight,
    //   0x333333,
    // );

    // const buttonWidth = 80;
    // const buttonSpacing = 20;
    // const buttonY = navBarY + navBarHeight / 2;

    this.add.image(screenWidth / 2, screenHeight / 2, 'bg');

    new Button(this, 'Hello', screenWidth / 2, screenHeight / 2, {
      colorStyle: 'green',
      state: 'unpressed',
      cornerRadius: 'rounded',
      shape: 'rect',
    });

    // this.add.existing(homeButton);
    // this.add.existing(inventoryButton);
    // this.add.existing(settingsButton);
    // this.add.existing(profileButton);
  }

  handleNavigation(destination: string) {
    console.log(`Navigating to ${destination}`);
    // Add your scene-switching logic here
  }
}
