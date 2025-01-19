import { Aimer } from '@objects/Aimer';
import { BubbleCluster } from '@objects/BubbleCluster';
import { getBubbleColor } from '@utils/ColorUtils';
import { Bubble } from '@objects/Bubble';

export default class GameScene extends Phaser.Scene {
  private shootingBubble: Bubble | null = null;
  private aimer: Aimer | null = null;
  private bubbleCluster: BubbleCluster;
  private readonly cols: number;
  private readonly rows: number;

  constructor() {
    super({ key: 'GameScene' });
    this.cols = 15;
    this.rows = 10;
  }

  /** Initialize scene elements */
  create() {
    const background = new Phaser.GameObjects.Sprite(this, 0, 0, 'background');
    this.add.existing(background);

    // Initialize the Bubble Cluster
    this.bubbleCluster = new BubbleCluster(
      this,
      this.cols,
      this.rows,
      'bubbles',
      this.scale.width / this.cols,
    );

    // Spawn the first shooting bubble
    this.spawnShootingBubble();
  }

  /** Spawn or reset the shooting bubble */
  private spawnShootingBubble() {
    // Clean up the previous shooting bubble and aimer
    if (this.shootingBubble) {
      this.shootingBubble.destroy();
    }
    if (this.aimer) {
      this.aimer.destroy();
    }

    // Create a new shooting bubble at the bottom of the screen
    this.shootingBubble = new Bubble(
      this,
      this.scale.width / 2,
      this.scale.height - 100,
      this.scale.width / this.cols,
      'shooting',
      'bubbles',
      getBubbleColor(),
    );

    // Create the aimer for the new shooting bubble
    this.aimer = new Aimer(this, this.shootingBubble);

    // Make the shooting bubble interactive for further collision
    this.physics.world.enable(this.shootingBubble);
  }

  /** Handle bubble shot and check for cluster collisions */
  public shootBubble(direction: { x: number; y: number }) {
    if (this.shootingBubble) {
      this.shootingBubble.shot(direction);

      // Check for collisions after the bubble is shot
      const collidedBubble = this.shootingBubble.checkCollision(
        this.bubbleCluster,
      );
      if (collidedBubble) {
        // Handle collision with existing bubbles in the cluster
        this.bubbleCluster.handleBubbleCollision(
          this,
          this.shootingBubble,
          'bubbles',
        );
        this.spawnShootingBubble(); // Spawn a new shooting bubble after collision
      } else {
        // Handle no collision (bubble continues moving)
      }
    }
  }

  /** Update method for continuous operations */
  update() {
    if (this.shootingBubble && this.shootingBubble.body) {
      // If the bubble is in motion, check if it goes out of bounds or has reached its destination
      if (
        this.shootingBubble.y < 0 ||
        this.shootingBubble.x < 0 ||
        this.shootingBubble.x > this.scale.width
      ) {
        this.spawnShootingBubble(); // Spawn a new bubble if the current one goes out of bounds
      }
    }
  }
}
