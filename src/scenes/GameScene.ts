import { getBubbleColor } from '@utils/ColorUtils.ts';
import { Bubble } from '@objects/Bubble.ts';
import { Aimer } from '@objects/Aimer.ts';
import { BubbleCluster } from '@objects/BubbleCluster.ts';

export default class GameScene extends Phaser.Scene {
  private shootingBubble: Bubble | null = null;
  private aimer: Aimer | null = null;
  private cols = 15;
  private rows = 10;
  private bubbleCluster: BubbleCluster;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const tileSize = this.scale.width / this.cols;
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');

    this.bubbleCluster = new BubbleCluster(
      this,
      this.cols,
      this.rows,
      'bubbles',
      tileSize,
    );

    this.spawnShootingBubble(tileSize);
  }

  private spawnShootingBubble(tileSize: number) {
    this.shootingBubble?.destroy();
    this.aimer?.destroy();

    this.shootingBubble = new Bubble(
      this,
      this.scale.width / 2,
      this.scale.height - 100,
      tileSize,
      'shooting',
      'bubbles',
      getBubbleColor(),
    );

    this.aimer = new Aimer(this, this.shootingBubble);
  }

  private handleCollision() {
    if (
      this.shootingBubble &&
      this.shootingBubble.checkCollision(this.bubbleCluster)
    ) {
      this.bubbleCluster.handleBubbleCollision(
        this,
        this.shootingBubble,
        'bubbles',
      );
      this.spawnShootingBubble(this.scale.width / this.cols);
    }
  }

  update() {
    this.handleCollision();
  }
}
