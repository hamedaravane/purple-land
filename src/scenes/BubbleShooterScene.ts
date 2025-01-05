import {
  GameObjects,
  Physics,
  Scene,
  Types,
  Sound,
  Input,
  Math as PhaserMath,
} from 'phaser';
import { Tile } from '@objects/Tile.ts';
import { Aimer } from '@objects/Aimer.ts';
import { Bubble, BubbleState } from '@objects/Bubble.ts';

/**
 * Represents data passed when restarting the scene (e.g., Game Over).
 */
interface SceneData {
  gameOver?: boolean;
  finalScore?: number;
}

/**
 * BubbleShooterScene:
 * Manages the main gameplay mechanics for the bubble shooter game using a hexagonal grid.
 */
export class BubbleShooterScene extends Scene {
  // -- Grid Configuration --
  private tiles: Tile[][] = [];
  private numRows: number = 7;
  private numCols: number = 8;
  private tileSize: number = 32; // Radius of hexagon
  private readonly hexHeight: number;
  private hexWidth: number;

  // -- Game Entities --
  private bubbleGroup!: Physics.Arcade.StaticGroup;
  private aimer!: Aimer;
  private shooterBubble!: Bubble;

  // -- UI Elements --
  private score: number = 0;
  private level: number = 1;
  private scoreText!: GameObjects.Text;
  private levelText!: GameObjects.Text;

  // -- Audio --
  private popSound!: Sound.BaseSound;
  private shootSound!: Sound.BaseSound;

  // -- State Tracking --
  private isShooting: boolean = false;

  constructor() {
    super({ key: 'BubbleShooterScene' });

    // Calculate hex dimensions
    this.hexHeight = this.tileSize * Math.sqrt(3);
    this.hexWidth = this.tileSize * 1.5;
  }

  /**
   * Preloads all necessary assets for the scene.
   */
  public preload() {
    // Load the bubbles spritesheet
    this.load.spritesheet('bubbles', 'assets/images/bubbles.png', {
      frameWidth: this.tileSize * 2,
      frameHeight: this.hexHeight,
    });

    // Load audio files
    this.load.audio('pop', 'assets/audio/pop.wav');
    this.load.audio('shoot', 'assets/audio/shoot.wav');
  }

  /**
   * Creates game objects and initializes the scene.
   */
  public create() {
    this.createAudio();
    this.createUI();
    this.createTiles();
    this.createInitialBubbles();
    this.createShooterBubble();
    this.createAimer();
    this.setupInput();
  }

  /**
   * Update loop - currently unused but can be utilized for future enhancements.
   */
  /*public update(time: number, delta: number) {
    // Future per-frame logic can be added here
  }*/

  /**
   * Initializes audio objects.
   */
  private createAudio() {
    this.popSound = this.sound.add('pop');
    this.shootSound = this.sound.add('shoot');
  }

  /**
   * Creates UI elements like score and level displays.
   */
  private createUI() {
    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.levelText = this.add.text(10, 40, `Level: ${this.level}`, {
      fontSize: '24px',
      color: '#ffffff',
    });
  }

  /**
   * Sets up the hexagonal grid of tiles.
   */
  private createTiles() {
    // Create a static group for all bubbles
    this.bubbleGroup = this.physics.add.staticGroup();

    for (let r = 0; r < this.numRows; r++) {
      this.tiles[r] = [];
      for (let q = 0; q < this.numCols; q++) {
        this.tiles[r][q] = new Tile(this, q, r, this.tileSize);
      }
    }

    // After all tiles are created, set their neighbors
    this.setTileNeighbors();
  }

  /**
   * Establishes neighbor references for each tile based on axial directions.
   */
  private setTileNeighbors() {
    const directions = [
      { dq: 1, dr: 0 }, // East
      { dq: 1, dr: -1 }, // Northeast
      { dq: 0, dr: -1 }, // Northwest
      { dq: -1, dr: 0 }, // West
      { dq: -1, dr: 1 }, // Southwest
      { dq: 0, dr: 1 }, // Southeast
    ];

    for (let r = 0; r < this.numRows; r++) {
      for (let q = 0; q < this.numCols; q++) {
        const tile = this.tiles[r][q];
        const neighbors: Tile[] = [];

        directions.forEach((dir) => {
          const neighborQ = q + dir.dq;
          const neighborR = r + dir.dr;

          if (this.isValidTile(neighborQ, neighborR)) {
            neighbors.push(this.tiles[neighborR][neighborQ]);
          }
        });

        tile.setNeighbors(neighbors);
      }
    }
  }

  /**
   * Checks if the given axial coordinates are within grid bounds.
   * @param q Axial column
   * @param r Axial row
   */
  private isValidTile(q: number, r: number): boolean {
    return q >= 0 && q < this.numCols && r >= 0 && r < this.numRows;
  }

  /**
   * Creates the initial bubbles on the grid.
   */
  private createInitialBubbles() {
    const initialRows = 2; // Number of rows to populate initially

    for (let r = 0; r < initialRows; r++) {
      for (let q = 0; q < this.numCols; q++) {
        const tile = this.tiles[r][q];
        const hasBubble = PhaserMath.Between(0, 1); // 50% chance to have a bubble

        if (hasBubble) {
          const color = PhaserMath.Between(0, 4); // Assuming 5 colors (0-4)
          const bubble = new Bubble(
            this,
            tile.x,
            tile.y,
            'bubbles',
            color,
            color,
          );
          this.bubbleGroup.add(bubble);
          tile.placeBubble(bubble);
        }
      }
    }
  }

  /**
   * Creates the shooter bubble at the bottom center of the screen.
   */
  private createShooterBubble() {
    const x = this.scale.width / 2;
    const y = this.scale.height - 100; // 100px from bottom
    const color = PhaserMath.Between(0, 4);
    this.shooterBubble = new Bubble(this, x, y, 'bubbles', color, color);
    this.shooterBubble.setDepth(1);
    this.physics.add.existing(this.shooterBubble);

    // Ensure the shooter bubble is dynamic but immovable initially
    this.shooterBubble.setImmovable(true);
    this.shooterBubble.setGravityY(0);
  }

  /**
   * Creates the aimer for aiming and shooting bubbles.
   */
  private createAimer() {
    const x = this.shooterBubble.x;
    const y = this.shooterBubble.y;
    this.aimer = new Aimer(this, x, y);
  }

  /**
   * Sets up input handlers for aiming and shooting.
   */
  private setupInput() {
    this.input.on('pointerdown', (pointer: Input.Pointer) => {
      // Begin aiming with the pointer's starting position
      this.aimer.startAiming(pointer);
    });

    this.input.on('pointermove', (pointer: Input.Pointer) => {
      // Dynamically update the aim with the pointer's current position
      this.aimer.updateAim(pointer);
    });

    this.input.on('pointerup', (pointer: Input.Pointer) => {
      // Log the pointer's release position for debugging
      console.log(`Pointer released at: (${pointer.x}, ${pointer.y})`);

      // End aiming and shoot if direction is valid
      const direction = this.aimer.endAiming();
      if (direction && !this.isShooting) {
        this.shootBubble(direction.dx, direction.dy);
      }
    });
  }

  /**
   * Shoots the current bubble in the direction determined by the aimer.
   * @param dx Change in x.
   * @param dy Change in y.
   */
  private shootBubble(dx: number, dy: number) {
    if (!this.shooterBubble) return;

    this.isShooting = true;
    this.shootSound.play();

    const speed = 800;
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    const velocityX = (dx / magnitude) * speed;
    const velocityY = (dy / magnitude) * speed;

    // Make the shooter bubble dynamic
    this.shooterBubble.setImmovable(false);
    this.shooterBubble.setVelocity(velocityX, velocityY);

    // Add collision with bubbles
    this.physics.add.collider(
      this.shooterBubble,
      this.bubbleGroup,
      this.handleCollision,
      undefined,
      this,
    );

    // Handle collision with world bounds
    this.shooterBubble.setCollideWorldBounds(true);
    this.shooterBubble.setBounce(1, 1);
    this.shooterBubble.setOnWorldBounds(true); // Enable world bounds collision events

    // Listen for the world bounds collision event
    this.physics.world.on(
      Physics.Arcade.Events.WORLD_BOUNDS,
      (body: Physics.Arcade.Body) => {
        if (body.gameObject === this.shooterBubble) {
          this.handleWorldBounds(body);
        }
      },
    );
  }

  /**
   * Handles collision between the shooter bubble and static bubbles.
   * @param shooter The shooter bubble.
   * @param staticBubble The static bubble it collided with.
   */
  private handleCollision: Types.Physics.Arcade.ArcadePhysicsCallback = (
    shooter,
    staticBubble,
  ) => {
    const shooterBubble = shooter as Bubble;
    const staticBubbleSprite = staticBubble as Bubble;

    // Stop shooter movement
    shooterBubble.setVelocity(0, 0);
    shooterBubble.setImmovable(true);

    // Find the nearest tile to snap the shooter bubble
    const nearestTile = this.findNearestTile(shooterBubble.x, shooterBubble.y);
    if (nearestTile && !nearestTile.isOccupied()) {
      nearestTile.placeBubble(shooterBubble);
      this.bubbleGroup.add(shooterBubble);
      this.isShooting = false;

      // Remove existing collider and world bounds listener
      this.physics.world.off('worldbounds', this.handleWorldBounds, this);

      // Check for matches
      this.checkForMatches(shooterBubble);

      // Descend grid and check game over
      this.descendGrid();
      this.checkGameOver();

      // Create a new shooter bubble
      this.createShooterBubble();
      this.createAimer(); // Recreate aimer for the new shooter
    }
  };

  /**
   * Handles collision of the shooter bubble with world bounds.
   */
  private handleWorldBounds = (
    body: Physics.Arcade.Body,
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean,
  ): void => {
    if (body.gameObject === this.shooterBubble) {
      if (up || down || left || right) {
        console.log(
          `Collision at: ${up ? 'up' : ''}${down ? 'down' : ''}${left ? 'left' : ''}${right ? 'right' : ''}`,
        );
      }

      // Destroy the bubble if it collides with specific bounds (e.g., top or bottom)
      if (up || down) {
        body.gameObject.destroy();
        this.isShooting = false;
        this.createShooterBubble();
        this.createAimer();
      } else {
        // Handle bounce or other actions for side collisions
        body.setVelocity(body.velocity.x * -1, body.velocity.y);
      }
    }
  };

  /**
   * Finds the nearest tile based on x and y coordinates.
   * @param x X-coordinate.
   * @param y Y-coordinate.
   */
  private findNearestTile(x: number, y: number): Tile | null {
    let nearestTile: Tile | null = null;
    let minDist = Infinity;

    this.tiles.forEach((row) => {
      row.forEach((tile) => {
        const dist = PhaserMath.Distance.Between(x, y, tile.x, tile.y);
        if (dist < minDist) {
          minDist = dist;
          nearestTile = tile;
        }
      });
    });

    return nearestTile;
  }

  /**
   * Checks for matching bubbles (3+ of the same color) and pops them.
   * @param bubble The bubble to check around.
   */
  private checkForMatches(bubble: Bubble) {
    const color = bubble.color;
    const row = bubble.tile?.r!;
    const col = bubble.tile?.q!;

    const matchedBubbles: Bubble[] = [];
    const visited = new Set<string>();
    const stack: Array<{ row: number; col: number }> = [{ row, col }];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const key = `${current.row},${current.col}`;

      if (visited.has(key)) continue;
      visited.add(key);

      const currentTile = this.tiles[current.row][current.col];
      const currentBubble = currentTile.bubble;

      if (currentBubble && currentBubble.color === color) {
        matchedBubbles.push(currentBubble);

        // Add all neighbors to stack
        currentTile.neighbors.forEach((neighbor) => {
          if (neighbor.bubble && neighbor.bubble.color === color) {
            stack.push({ row: neighbor.r, col: neighbor.q });
          }
        });
      }
    }

    if (matchedBubbles.length >= 3) {
      // Pop matched bubbles
      matchedBubbles.forEach((matchedBubble) => {
        this.popSound.play();
        matchedBubble.setState(BubbleState.Bursting);
        this.score += 10;
      });

      // Update UI
      this.scoreText.setText(`Score: ${this.score}`);
    }
  }

  /**
   * Descends the grid by a certain number of rows, increasing difficulty.
   */
  private descendGrid() {
    const rowsToDescend = 1; // Adjust based on level or other factors

    // Iterate from bottom to top to prevent overwriting
    for (let r = this.numRows - 1; r >= 0; r--) {
      for (let q = 0; q < this.numCols; q++) {
        const tile = this.tiles[r][q];
        if (tile.bubble) {
          const newR = r + rowsToDescend;
          if (newR < this.numRows) {
            const targetTile = this.tiles[newR][q];
            if (!targetTile.isOccupied()) {
              targetTile.placeBubble(tile.bubble);
              tile.removeBubble();
            }
          } else {
            // Bubble has descended beyond the grid
            tile.removeBubble();
          }
        }
      }
    }
  }

  /**
   * Checks if any bubble has reached the bottom row, triggering game over.
   */
  private checkGameOver() {
    for (let q = 0; q < this.numCols; q++) {
      const tile = this.tiles[this.numRows - 1][q];
      if (tile.isOccupied()) {
        this.handleGameOver();
        return;
      }
    }

    // Optionally, check if all bubbles are cleared to proceed to next level
    if (this.areAllBubblesCleared()) {
      this.proceedToNextLevel();
    }
  }

  /**
   * Handles the game over state.
   */
  private handleGameOver() {
    // Implement game over logic (e.g., show game over screen, restart)
    this.scene.restart({ gameOver: true, finalScore: this.score });
  }

  /**
   * Checks if all bubbles on the grid are cleared.
   */
  private areAllBubblesCleared() {
    for (let r = 0; r < this.numRows; r++) {
      for (let q = 0; q < this.numCols; q++) {
        if (this.tiles[r][q].isOccupied()) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Proceeds to the next level by increasing difficulty.
   */
  private proceedToNextLevel() {
    this.level++;
    this.levelText.setText(`Level: ${this.level}`);

    // Increase difficulty parameters
    this.numRows = Math.min(this.numRows + 1, 12); // Maximum rows
    // Potentially increase bubble colors, speed, etc.

    // Reset grid
    this.resetGrid();
    this.createTiles();
    this.createInitialBubbles();
  }

  /**
   * Resets the grid by removing all bubbles.
   */
  private resetGrid() {
    this.tiles.forEach((row) => {
      row.forEach((tile) => {
        tile.removeBubble();
      });
    });
  }
}
