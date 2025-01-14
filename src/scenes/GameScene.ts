import { Bubble } from '@objects/Bubble';
import { Aimer } from '@objects/Aimer';
import { StaticBubbles } from '@objects/StaticBubbles';
import { getRandomBubbleColorString } from '@utils/ColorUtils';

export default class GameScene extends Phaser.Scene {
  private shootingBubble: Bubble;
  private staticBubbles: StaticBubbles;
  private aimer: Aimer;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('Red', 'assets/images/Red.png');
    this.load.image('Orange', 'assets/images/Orange.png');
    this.load.image('Yellow', 'assets/images/Yellow.png');
    this.load.image('LightGreen', 'assets/images/LightGreen.png');
    this.load.image('Green', 'assets/images/Green.png');
    this.load.image('Cyan', 'assets/images/Cyan.png');
    this.load.image('LightBlue', 'assets/images/LightBlue.png');
    this.load.image('Purple', 'assets/images/Purple.png');
    this.load.image('Magenta', 'assets/images/Magenta.png');
    this.load.image('Pink', 'assets/images/Pink.png');
    this.load.image('Brown', 'assets/images/Brown.png');
  }

  create() {
    const w = this.cameras.main.width;
    // const h = this.cameras.main.height
    const cols = 14;
    const rows = 9;
    const r = w / cols / 2;
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
      getRandomBubbleColorString(),
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
