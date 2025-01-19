import { Aimer } from '@objects/Aimer';
import { BubbleCluster } from '@objects/BubbleCluster.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';
import { Bubble } from '@objects/Bubble.ts';

export default class GameScene extends Phaser.Scene {
  private shootingBubble: Bubble;
  private aimer: Aimer;
  private cols: number;
  private rows: number;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.cols = 15;
    this.rows = 10;
    const background = new Phaser.GameObjects.Sprite(this, 0, 0, 'background');
    this.add.existing(background);
    new BubbleCluster(
      this,
      this.cols,
      this.rows,
      'bubbles',
      this.scale.width / this.cols,
    );
    this.spawnShootingBubble();
  }

  private spawnShootingBubble() {
    if (this.shootingBubble) this.shootingBubble.destroy();
    if (this.aimer) this.aimer.destroy();
    this.shootingBubble = new Bubble(
      this,
      this.scale.width / 2,
      this.scale.height - 100,
      this.scale.width / this.cols,
      'shooting',
      'bubbles',
      getBubbleColor(),
    );
    new Aimer(this, this.shootingBubble);
  }
}
