import { Bubble } from '@objects/Bubble';
import { Aimer } from '@objects/Aimer';
import { StaticBubbles } from '@objects/StaticBubbles';
import { getBubbleColor } from '@utils/ColorUtils.ts';

export default class GameScene extends Phaser.Scene {
  private shootingBubble: Bubble;
  private staticBubbles: StaticBubbles;
  private aimer: Aimer;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const cols = 14;
    const rows = 9;
    const r = this.cameras.main.width / cols / 2;
    const background = new Phaser.GameObjects.Sprite(this, 0, 0, 'background');
    this.add.existing(background);
    this.staticBubbles = new StaticBubbles(this, r, rows, cols);
    this.add.existing(this.staticBubbles);
    this.spawnShootingBubble();
  }

  private spawnShootingBubble() {
    if (this.shootingBubble) this.shootingBubble.destroy();
    if (this.aimer) this.aimer.destroy();
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const cols = 14;
    const r = w / cols / 2;
    this.shootingBubble = new Bubble(
      this,
      w / 2,
      h - 100,
      r * 2,
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
