import { getBubbleColor } from '@utils/ColorUtils.ts';
import { Bubble } from '@objects/Bubble.ts';
import { Aimer } from '@objects/Aimer.ts';
import { BubbleCluster } from '@objects/BubbleCluster.ts';

export default class GameScene extends Phaser.Scene {
  private shootingBubble: Bubble;
  private aimer: Aimer;
  private cols: number;
  private rows: number;

  private bubbleCluster: BubbleCluster;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.cols = 15;
    this.rows = 10;
    const background = new Phaser.GameObjects.Sprite(
      this,
      this.scale.width / 2,
      this.scale.height / 2,
      'background',
    );
    this.add.existing(background);

    this.bubbleCluster = new BubbleCluster(
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

  /** Handle the collision of the shooting bubble with the cluster */
  checkBubbleCollision() {
    if (this.shootingBubble) {
      const collision = this.shootingBubble.checkCollision(this.bubbleCluster);
      if (collision) {
        this.bubbleCluster.handleBubbleCollision(
          this,
          this.shootingBubble,
          'bubbles',
        );
        this.spawnShootingBubble();
      }
    }
  }

  /** Update method, runs continuously to check for collisions */
  update() {
    this.checkBubbleCollision();
  }
}
