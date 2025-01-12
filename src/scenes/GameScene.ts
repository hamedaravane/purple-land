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
    this.shootingBubble = new Bubble(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height - 100,
      'shooting',
      getRandomBubbleColor(),
    );

    new Aimer(this, this.shootingBubble);
    this.staticBubbles = new StaticBubbles(this, 25 / 2, 12, 12);
    this.add.existing(this.staticBubbles);
    this.physics.add.collider(this.shootingBubble, this.staticBubbles);
  }
}
