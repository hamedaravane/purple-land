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
    const sceneWidth = this.cameras.main.width;
    // const sceneHeight = this.cameras.main.height;

    const staticBubbleCols = 14;
    const staticBubbleRows = 9;
    const bubbleRadius = sceneWidth / staticBubbleCols / 2;

    this.staticBubbles = new StaticBubbles(
      this,
      bubbleRadius,
      staticBubbleRows,
      staticBubbleCols,
    );
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
    const sceneWidth = this.cameras.main.width;
    const sceneHeight = this.cameras.main.height;
    const staticBubbleCols = 14;
    const bubbleRadius = sceneWidth / staticBubbleCols / 2;

    if (this.shootingBubble) {
      this.shootingBubble.destroy();
    }

    this.shootingBubble = new Bubble(
      this,
      sceneWidth / 2,
      sceneHeight - 100,
      bubbleRadius * 2,
      'shooting',
      getRandomBubbleColor(),
    );

    new Aimer(this, this.shootingBubble);
    this.physics.add.existing(this.shootingBubble);
  }

  private onBubbleCollision(
    shootingBubbleObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    staticBubbleObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const shootingBubble = shootingBubbleObj as Bubble;
    const staticBubble = staticBubbleObj as Bubble;

    // Let StaticBubbles handle the logic (chain pop or attach bubble, etc.)
    this.staticBubbles.handleCollision(shootingBubble, staticBubble);

    // After the collision is resolved, we might want to spawn
    // a new shooting bubble to continue the game
    this.spawnShootingBubble();

    // Also re-apply the collider for the new shooting bubble
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
