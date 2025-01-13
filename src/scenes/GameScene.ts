import { Bubble } from '@objects/Bubble';
import { Aimer } from '@objects/Aimer';
import { StaticBubbles } from '@objects/StaticBubbles';
import { getRandomBubbleColor } from '@utils/ColorUtils';

export default class GameScene extends Phaser.Scene {
  private shootingBubble: Bubble;
  private staticBubbles: StaticBubbles;

  constructor() {
    super({ key: 'GameScene' });
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
    this.physics.add.collider(
      this.shootingBubble,
      this.staticBubbles,
      this
        .onBubbleCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );
  }

  private spawnShootingBubble() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const cols = 14;
    const r = w / cols / 2;
    if (this.shootingBubble) {
      this.shootingBubble.destroy();
    }
    this.shootingBubble = new Bubble(
      this,
      w / 2,
      h - 100,
      r * 2,
      'shooting',
      getRandomBubbleColor(),
    );
    new Aimer(this, this.shootingBubble);
    this.physics.add.existing(this.shootingBubble);
  }

  private onBubbleCollision(
    shootingObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    staticObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const shootingBubble = shootingObj as Bubble;
    const staticBubble = staticObj as Bubble;
    this.staticBubbles.handleCollision(shootingBubble, staticBubble);
    this.spawnShootingBubble();
    this.physics.add.collider(
      this.shootingBubble,
      this.staticBubbles,
      this
        .onBubbleCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    );
  }
}
