import { Bubble } from '@objects/Bubble.ts';
import { Aimer } from '@objects/Aimer.ts';
import { StaticBubbles } from '@objects/StaticBubbles.ts';
import { getRandomBubbleColor } from '@utils/ColorUtils.ts';

export default class GameScene extends Phaser.Scene {
  private shootingBubble: Bubble;
  private staticBubbles: StaticBubbles;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const sceneWidth = this.cameras.main.width;
    const sceneHeight = this.cameras.main.height;
    const staticBubbleCols = 14;
    const staticBubbleRows = 9;
    const bubbleRadius = sceneWidth / staticBubbleCols / 2;
    this.shootingBubble = new Bubble(
      this,
      sceneWidth / 2,
      sceneHeight - 100,
      bubbleRadius * 2,
      'shooting',
      getRandomBubbleColor(),
    );

    new Aimer(this, this.shootingBubble);
    this.staticBubbles = new StaticBubbles(
      this,
      bubbleRadius,
      staticBubbleRows,
      staticBubbleCols,
    );
    this.add.existing(this.staticBubbles);
    this.physics.add.collider(this.shootingBubble, this.staticBubbles);
  }
}
