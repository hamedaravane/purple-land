import Phaser from 'phaser';
import { Bubble } from '@objects/Bubble.ts';
import { Aimer } from '@objects/Aimer.ts';

export default class GameScene extends Phaser.Scene {
  private shootingBubble: Bubble;
  // private aimer: Aimer;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.shootingBubble = new Bubble(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height - 100,
      '',
      'shooting',
    );
    new Aimer(this, this.shootingBubble);
  }
}
