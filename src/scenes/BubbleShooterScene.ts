import Phaser from 'phaser';
import { HexagonalGrid } from '../objects/HexagonalGrid.ts';
// import { Aimer } from '../objects/Aimer.ts';
import { Bubble } from '../objects/Bubble.ts';
import { Aimer } from '../objects/Aimer.ts';

export class BubbleShooterScene extends Phaser.Scene {
  private hexGrid: HexagonalGrid;
  private bubbleGroup: Phaser.GameObjects.Group;
  // private aimer: Aimer;
  private shooterX: number;
  private shooterY: number;
  private aimer: Aimer;

  constructor() {
    super({ key: 'BubbleShooterScene' });
  }

  preload(): void {}

  create(): void {
    const numCols = 12;
    const numRows = 5;

    this.hexGrid = new HexagonalGrid(this, numCols, numRows);

    this.bubbleGroup = this.physics.add.group();

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
        this.bubbleGroup.add(bubble);
      }
    });

    // Define shooter position (e.g., bottom center)
    this.shooterX = this.cameras.main.width / 2;
    this.shooterY = this.cameras.main.height - 50; // 50 pixels from bottom

    // Add shooter sprite
    const shooter = this.add.sprite(this.shooterX, this.shooterY, 'shooter');
    shooter.setDepth(1); // Ensure it's above other elements

    // Initialize the Aimer
    // this.aimer = new Aimer(this, this.shooterX, this.shooterY, 100);

    // Listen for shootBubble events
    this.events.on('shootBubble', this.handleShootBubble, this);

    // Listen for bubblePopped events to check for matches
    this.events.on('bubblePopped', this.hexGrid.checkForMatches, this);
  }

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
    this.bubbleGroup.add(bubble);

    // Set bubble velocity based on direction and charge
    const speed = 500 * charge; // Adjust speed as needed
    this.physics.velocityFromRotation(
      direction.angle(),
      speed,
      (bubble.body as Phaser.Physics.Arcade.Body).velocity,
    );

    // Ensure the bubble doesn't go out of bounds
    bubble.setCollideWorldBounds(true);
    (bubble.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;

    // Handle collision with world bounds
    this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body) => {
      if (body.gameObject === bubble) {
        // Snap bubble to the nearest empty tile
        this.placeBubbleAtBubblePosition(bubble);
      }
    });

    // Handle collision with existing bubbles
    this.physics.add.overlap(
      this.bubbleGroup,
      this.bubbleGroup,
      this.collideCallback,
      undefined,
      this,
    );
  }

  private collideCallback: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    b,
    existingBubble,
  ) => {
    if (b === existingBubble) return;

    const arcadeBody = (b as Bubble).body;
    (arcadeBody as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    this.placeBubbleAtBubblePosition(b as Bubble);
  };

  private placeBubbleAtBubblePosition(bubble: Bubble): void {
    const placed = this.hexGrid.placeBubbleNear(bubble.x, bubble.y, bubble);
    if (placed) {
      // Check for matches after placement
      this.hexGrid.checkForMatches();
    } else {
      // If no tile is available, remove the bubble
      bubble.destroy();
    }
  }

  private getRandomColor(): string {
    const colors = ['red', 'blue', 'green'];
    const index = Phaser.Math.Between(0, colors.length - 1);
    return colors[index];
  }

  update() {}
}
