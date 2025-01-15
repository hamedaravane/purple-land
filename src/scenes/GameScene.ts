import { Bubble } from '@objects/Bubble';
import { Aimer } from '@objects/Aimer';
import { StaticBubbles } from '@objects/StaticBubbles';
import { getBubbleColor } from '@utils/ColorUtils.ts';

export default class GameScene extends Phaser.Scene {
  private shootingBubble: Bubble;
  private staticBubbles: StaticBubbles;
  private aimer: Aimer;
  private cols: number;
  private rows: number;
  private bubbleWidth: number;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.cols = 12;
    this.rows = 12;
    this.bubbleWidth = this.scale.width / this.cols;
    console.log('Creating Game Scene');
    console.log(
      'screen width',
      this.scale.width,
      'bubble width',
      this.bubbleWidth,
    );
    const background = new Phaser.GameObjects.Sprite(this, 0, 0, 'background');
    this.add.existing(background);
    this.staticBubbles = new StaticBubbles(
      this,
      this.bubbleWidth,
      this.rows,
      this.cols,
    );
    this.add.existing(this.staticBubbles);
    this.spawnShootingBubble();
  }

  private spawnShootingBubble() {
    if (this.shootingBubble) this.shootingBubble.destroy();
    if (this.aimer) this.aimer.destroy();
    this.shootingBubble = new Bubble(
      this,
      this.scale.width / 2,
      this.scale.height - 100,
      this.bubbleWidth,
      'shooting',
      getBubbleColor(),
    );
    this.physics.add.existing(this.shootingBubble);
    this.aimer = new Aimer(this, this.shootingBubble);
    this.physics.add.collider(
      this.shootingBubble,
      this.staticBubbles,
      (shootingObj, staticObj) =>
        this.onBubbleCollision(shootingObj as Bubble, staticObj as Bubble),
    );
  }

  private onBubbleCollision(shootingBubble: Bubble, staticBubble: Bubble) {
    this.staticBubbles.handleCollision(shootingBubble, staticBubble);
    this.spawnShootingBubble();
  }
}
