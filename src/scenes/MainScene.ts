import Phaser from 'phaser';
import Button from '@objects/ui-elements/Button.ts';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    const navBarHeight = 80;
    const navBarY = screenHeight - navBarHeight;

    this.add.rectangle(
      screenWidth / 2,
      navBarY + navBarHeight / 2,
      screenWidth,
      navBarHeight,
      0x333333,
    );

    const buttonWidth = 80;
    const buttonSpacing = 20;
    const buttonY = navBarY + navBarHeight / 2;

    const homeButton = new Button(
      this,
      screenWidth / 2 - buttonWidth * 2 - buttonSpacing,
      buttonY,
      'buttons',
      {
        text: 'Home',
        callback: () => this.handleNavigation('Home'),
      },
    );

    const inventoryButton = new Button(
      this,
      screenWidth / 2 - buttonWidth - buttonSpacing / 2,
      buttonY,
      'buttons',
      {
        text: 'Inventory',
        callback: () => this.handleNavigation('Inventory'),
      },
    );

    const settingsButton = new Button(
      this,
      screenWidth / 2 + buttonWidth + buttonSpacing / 2,
      buttonY,
      'buttons',
      {
        text: 'Settings',
        callback: () => this.handleNavigation('Settings'),
      },
    );

    const profileButton = new Button(
      this,
      screenWidth / 2 + buttonWidth * 2 + buttonSpacing,
      buttonY,
      'buttons',
      {
        text: 'Profile',
        callback: () => this.handleNavigation('Profile'),
      },
    );

    this.add.existing(homeButton);
    this.add.existing(inventoryButton);
    this.add.existing(settingsButton);
    this.add.existing(profileButton);
  }

  handleNavigation(destination: string) {
    console.log(`Navigating to ${destination}`);
    // Add your scene-switching logic here
  }
}
