import Phaser from 'phaser';
import { UiManager } from '@managers/UiManager.ts';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    new UiManager(this);
  }
}
