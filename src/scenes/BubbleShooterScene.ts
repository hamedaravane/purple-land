// BubbleShooterScene.ts

import Phaser from 'phaser';
import { HexagonalGrid } from '../objects/HexagonalGrid.ts';
import { Aimer } from '../objects/Aimer.ts';
import { Bubble } from '../objects/Bubble.ts';

export class BubbleShooterScene extends Phaser.Scene {
  private hexGrid: HexagonalGrid;
  private staticBubbleGroup: Phaser.GameObjects.Group;
  private movingBubbleGroup: Phaser.GameObjects.Group;
  private aimer: Aimer;
  private shooterX: number;
  private shooterY: number;
  private shooterSprite: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: 'BubbleShooterScene' });
  }

  preload(): void {
    // Load shooter sprite
    this.load.image('shooter', 'assets/shooter.png'); // Ensure the path is correct

    // Load bubble preview sprite
    this.load.image('bubble_preview', 'assets/bubble_preview.png'); // Ensure the path is correct

    // Load bubble sprites
    this.load.image('bubble_red', 'assets/bubble_red.png');
    this.load.image('bubble_blue', 'assets/bubble_blue.png');
    this.load.image('bubble_green', 'assets/bubble_green.png');

    // Load other necessary assets here
  }

  create(): void {
    const numCols = 12;
    const numRows = 5;

    // Initialize Hexagonal Grid
    this.hexGrid = new HexagonalGrid(this, numCols, numRows);

    // Initialize Physics Groups
    this.staticBubbleGroup = this.physics.add.staticGroup();
    this.movingBubbleGroup = this.physics.add.group({
      collideWorldBounds: true,
      bounceX: 1,
      bounceY: 1,
    });

    // Example: Place some bubbles initially
    const initialBubbles = [
      { row: 5, col: 5, color: 'red' },
      { row: 5, col: 6, color: 'blue' },
      { row: 6, col: 5, color: 'green' },
      // Add more initial bubbles as needed
    ];

    initialBubbles.forEach((data) => {
      const tile = this.hexGrid.getTile(data.row, data.col);
      if (tile && tile.isEmpty()) {
        const bubble = new Bubble(
          this,
          tile.x,
          tile.y,
          `bubble_${data.color}`,
          data.color,
        );
        tile.placeBubble(bubble);
        this.staticBubbleGroup.add(bubble);
      }
    });

    // Define shooter position (e.g., bottom center)
    this.shooterX = this.cameras.main.width / 2;
    this.shooterY = this.cameras.main.height - 50; // 50 pixels from bottom

    // Add shooter sprite and assign a name for easy reference
    this.shooterSprite = this.add.sprite(
      this.shooterX,
      this.shooterY,
      'shooter',
    );
    this.shooterSprite.setDepth(1); // Ensure it's above other elements
    this.shooterSprite.setName('shooter'); // Assign name for retrieval during resize

    // Initialize the Aimer
    this.aimer = new Aimer(this, {
      shooterX: this.shooterX,
      shooterY: this.shooterY,
      lineLength: 150, // Adjust as needed
      maxChargeTime: 3000, // 3 seconds
      chargeMultiplier: 3,
      bubblePreviewKey: 'bubble_preview',
      angleConstraints: {
        min: Phaser.Math.DegToRad(-75),
        max: Phaser.Math.DegToRad(75),
      },
    });

    // Listen for shootBubble events
    this.events.on('shootBubble', this.handleShootBubble, this);

    // Listen for bubblePopped events to check for matches
    this.events.on('bubblePopped', this.hexGrid.checkForMatches, this);

    // Handle scene resize if your game supports it
    this.scale.on('resize', this.onResize, this);
  }

  /**
   * Handles the shooting of a bubble based on the Aimer's event.
   * @param data Contains direction and charge information.
   */
  private handleShootBubble(data: {
    direction: Phaser.Math.Vector2;
    charge: number;
  }): void {
    const { direction, charge } = data;

    // Create a new bubble at the shooter's position
    const bubbleColor = this.getRandomColor();
    const bubble = new Bubble(
      this,
      this.shooterX,
      this.shooterY,
      `bubble_${bubbleColor}`,
      bubbleColor,
    );
    this.movingBubbleGroup.add(bubble);

    // Set bubble velocity based on direction and charge
    const speed = 500 * charge; // Adjust speed as needed
    this.physics.velocityFromRotation(
      direction.angle(),
      speed,
      (bubble.body as Phaser.Physics.Arcade.Body).velocity,
    );

    // Enable world bounds collision
    bubble.setCollideWorldBounds(true);
    (bubble.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;

    // Handle collision with world bounds
    bubble.body?.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body) => {
      if (body.gameObject === bubble) {
        // Snap bubble to the nearest empty tile
        this.placeBubbleAtBubblePosition(bubble);
      }
    });

    // Handle collision with existing static bubbles
    this.physics.add.overlap(
      this.movingBubbleGroup,
      this.staticBubbleGroup,
      this.collideCallback,
      undefined,
      this,
    );
  }

  /**
   * Collision callback when a moving bubble overlaps with a static bubble.
   * @param movingBubble The bubble that is moving.
   * @param staticBubble The bubble that is static.
   */
  private collideCallback: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    movingBubble,
    staticBubble,
  ) => {
    if (movingBubble === staticBubble) return;

    const bubble = movingBubble as Bubble;
    const staticBub = staticBubble as Bubble;

    // Stop the moving bubble
    (bubble.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    bubble.body.enable = false; // Make it static

    // Snap bubble to the nearest empty tile
    this.placeBubbleAtBubblePosition(bubble);
  };

  /**
   * Places a bubble at its current position, snapping it to the nearest empty tile.
   * @param bubble The bubble to place.
   */
  private placeBubbleAtBubblePosition(bubble: Bubble): void {
    const placed = this.hexGrid.placeBubbleNear(bubble.x, bubble.y, bubble);
    if (placed) {
      // Move the bubble to the static group
      this.movingBubbleGroup.remove(bubble, true, false);
      this.staticBubbleGroup.add(bubble);

      // Check for matches after placement
      this.hexGrid.checkForMatches();
    } else {
      // If no tile is available, remove the bubble
      bubble.destroy();
    }
  }

  /**
   * Generates a random color for the bubble.
   * @returns A string representing the bubble color.
   */
  private getRandomColor(): string {
    const colors = ['red', 'blue', 'green'];
    const index = Phaser.Math.Between(0, colors.length - 1);
    return colors[index];
  }

  /**
   * Handles scene resize events to reposition the shooter and update the Aimer.
   * @param gameSize The new game size.
   * @param baseSize The base size.
   * @param displaySize The display size.
   * @param resolution The resolution.
   */
  private onResize(
    gameSize: Phaser.Structs.Size,
    baseSize: Phaser.Structs.Size,
    displaySize: Phaser.Structs.Size,
    resolution: number,
  ): void {
    // Update shooter position
    this.shooterX = gameSize.width / 2;
    this.shooterY = gameSize.height - 50;

    // Update shooter sprite position
    const shooter = this.children.getByName(
      'shooter',
    ) as Phaser.GameObjects.Sprite;
    if (shooter) {
      shooter.setPosition(this.shooterX, this.shooterY);
    }

    // Update Aimer position
    if (this.aimer) {
      this.aimer.updateShooterPosition(this.shooterX, this.shooterY);
    }
  }

  /**
   * Cleans up resources when the scene is destroyed.
   */
  shutdown(): void {
    // Clean up the Aimer instance
    if (this.aimer) {
      this.aimer.destroy();
    }

    // Remove event listeners
    this.events.off('shootBubble', this.handleShootBubble, this);
    this.events.off('bubblePopped', this.hexGrid.checkForMatches, this);

    // Destroy physics groups
    if (this.staticBubbleGroup) {
      this.staticBubbleGroup.destroy(true, true);
    }
    if (this.movingBubbleGroup) {
      this.movingBubbleGroup.destroy(true, true);
    }

    // Remove resize listener
    this.scale.off('resize', this.onResize, this);

    // Call the superclass's shutdown method if necessary
    super.shutdown();
  }

  update(): void {
    // Update logic if necessary
  }
}
