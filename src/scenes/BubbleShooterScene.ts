import Phaser from "phaser";

/**
 * Represents a bubble in the grid, storing its color, row, and column index.
 * You can extend this interface for more properties (e.g., power-ups).
 */
interface BubbleData {
  color: number;
  row: number;
  col: number;
}

/**
 * BubbleShooterScene:
 * A single scene managing a basic bubble-shooter mechanic:
 * - Preloads bubble assets.
 * - Creates a grid of static bubbles.
 * - Allows the player to shoot a bubble from the bottom.
 * - Checks for 3+ matches and pops them.
 * - Descends the grid and checks for game over.
 */
export class BubbleShooterScene extends Phaser.Scene {
  // -- Grid & Bubble Settings --
  private grid: Array<Array<Phaser.Physics.Arcade.Sprite | null>> = [];
  private numRows = 7;
  private numCols = 8;
  private bubbleSize = 64;
  private bubbleColors = 5;
  private descendInterval = 1; // Rows to descend after each shot

  // -- Score / Level --
  private score = 0;
  private level = 1;

  // -- Groups --
  private bubbleGroup?: Phaser.Physics.Arcade.StaticGroup;
  private shooterBubble?: Phaser.Physics.Arcade.Sprite;

  // -- UI Elements --
  private scoreText?: Phaser.GameObjects.Text;
  private levelText?: Phaser.GameObjects.Text;

  // -- Audio --
  private popSound?: Phaser.Sound.BaseSound;
  private shootSound?: Phaser.Sound.BaseSound;

  // -- Pointer Data for Swipe --
  private initialPointerPos?: { x: number; y: number };
  private finalPointerPos?: { x: number; y: number };

  constructor() {
    super({ key: "BubbleShooterScene" });
  }

  /**
   * Preload your bubble spritesheet and audio here.
   * Adjust file paths to match your asset locations.
   */
  public preload(): void {
    this.load.spritesheet("bubbles", "assets/images/bubbles.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.audio("pop", "assets/audio/pop.wav");
    this.load.audio("shoot", "assets/audio/shoot.wav");
  }

  /**
   * Create is called once when the scene starts. Here, we set up:
   * - Audio
   * - UI text (score, level)
   * - The initial grid of static bubbles
   * - The shooter bubble at the bottom
   * - Input handlers (for swiping/shooting)
   */
  public create(): void {
    this.createAudio();
    this.createUI();
    this.createInitialBubbles();
    this.createShooterBubble();
    this.setupInput();
  }

  /**
   * The main update loop. Keep the logic minimal here for clarity.
   */
  public update(): void {
    // You can add any per-frame logic here if needed.
  }

  /**
   * Initializes audio objects.
   */
  private createAudio(): void {
    this.popSound = this.sound.add("pop");
    this.shootSound = this.sound.add("shoot");
  }

  /**
   * Creates text objects for score and level displays.
   */
  private createUI(): void {
    this.scoreText = this.add
      .text(10, 10, `Score: ${this.score}`, {
        fontSize: "24px",
        color: "#ffffff"
      })
      .setDepth(10);

    this.levelText = this.add
      .text(10, 40, `Level: ${this.level}`, {
        fontSize: "24px",
        color: "#ffffff"
      })
      .setDepth(10);
  }

  /**
   * Sets up pointer input (touch/mouse) for the bubble shooter.
   * We capture the initial pointer position on pointerdown,
   * and the final on pointerup to compute the shot direction.
   */
  private setupInput(): void {
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.initialPointerPos = { x: pointer.x, y: pointer.y };
    });

    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      this.finalPointerPos = { x: pointer.x, y: pointer.y };
      this.shootBubble();
    });
  }

  /**
   * Creates an initial grid of static bubbles at the top of the screen.
   */
  private createInitialBubbles(): void {
    this.bubbleGroup = this.physics.add.staticGroup();

    for (let row = 0; row < this.numRows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.numCols; col++) {
        const colorIndex = Phaser.Math.Between(0, this.bubbleColors - 1);
        const x = col * this.bubbleSize + this.bubbleSize / 2;
        const y = row * this.bubbleSize + this.bubbleSize / 2 + 50;

        const bubble = this.bubbleGroup.create(x, y, "bubbles", colorIndex);
        // Store bubble metadata for easier reference
        bubble.setData("color", colorIndex);
        bubble.setData("row", row);
        bubble.setData("col", col);
        bubble.setCircle(this.bubbleSize / 2);

        this.grid[row][col] = bubble;
      }
    }
  }

  /**
   * Creates the shooter bubble at the bottom of the screen.
   */
  private createShooterBubble(): void {
    // If there's already a shooter, remove it
    if (this.shooterBubble) {
      this.shooterBubble.destroy();
    }

    const colorIndex = Phaser.Math.Between(0, this.bubbleColors - 1);
    const x = this.scale.width / 2;
    const y = this.scale.height - 100;

    this.shooterBubble = this.physics.add.sprite(x, y, "bubbles", colorIndex);
    this.shooterBubble.setData("color", colorIndex);
    this.shooterBubble.setCircle(this.bubbleSize / 2);
    this.shooterBubble.setDepth(5);
  }

  /**
   * Shoots the current bubble from the bottom to the top, based on swipe direction.
   */
  private shootBubble(): void {
    if (!this.shooterBubble || !this.bubbleGroup) return;
    if (!this.initialPointerPos || !this.finalPointerPos) return;

    const dx = this.finalPointerPos.x - this.initialPointerPos.x;
    const dy = this.finalPointerPos.y - this.initialPointerPos.y;

    // If there's no swipe movement, don't shoot
    if (dx === 0 && dy === 0) return;

    this.shootSound?.play();

    const speed = 800;
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / magnitude) * speed;
    const vy = (dy / magnitude) * speed;

    // Set bubble velocity
    this.shooterBubble.setVelocity(vx, vy);

    // Add collision with the static bubble group
    this.physics.add.collider(
      this.shooterBubble,
      this.bubbleGroup,
      () => this.handleBubbleCollision,
      undefined,
      this
    );
  }

  /**
   * Collision handler when the shot bubble collides with a static bubble.
   * - Stops the shot bubble.
   * - Snaps it to the nearest grid position.
   * - Checks for matches.
   * - Descends rows, checks for Game Over.
   */
  private handleBubbleCollision = (
    shot: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    _static: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ): void => {
    const shotBubble = shot as Phaser.Physics.Arcade.Sprite;
    shotBubble.setVelocity(0, 0);
    shotBubble.setImmovable(true);
    shotBubble.body!.immovable = true;

    // Snap to grid
    const { x, y, row, col } = this.getNearestGridPosition(shotBubble.x, shotBubble.y);
    shotBubble.setPosition(x, y);
    shotBubble.setData("row", row);
    shotBubble.setData("col", col);

    this.bubbleGroup?.add(shotBubble);
    this.grid[row][col] = shotBubble;

    // Check for matches
    this.checkForMatches(shotBubble);

    // Spawn new shooter
    this.createShooterBubble();

    // Descend the grid
    this.descendRows();

    // Check Game Over
    this.checkGameOver();
  };

  /**
   * Gets the nearest row & column in the grid for a given x,y,
   * and returns the center coordinates for that cell.
   */
  private getNearestGridPosition(x: number, y: number): {
    x: number;
    y: number;
    row: number;
    col: number;
  } {
    let col = Math.round((x - this.bubbleSize / 2) / this.bubbleSize);
    let row = Math.round((y - this.bubbleSize / 2 - 50) / this.bubbleSize);

    col = Phaser.Math.Clamp(col, 0, this.numCols - 1);
    row = Phaser.Math.Clamp(row, 0, this.numRows - 1);

    return {
      x: col * this.bubbleSize + this.bubbleSize / 2,
      y: row * this.bubbleSize + this.bubbleSize / 2 + 50,
      row,
      col
    };
  }

  /**
   * Checks if the given bubble, when placed, forms a cluster of >= 3 matching bubbles.
   * If so, pops them, updates score, and removes them from the grid.
   */
  private checkForMatches(shotBubble: Phaser.Physics.Arcade.Sprite): void {
    const color = shotBubble.getData("color") as number;
    const row = shotBubble.getData("row") as number;
    const col = shotBubble.getData("col") as number;

    const stack: Array<{ row: number; col: number }> = [{ row, col }];
    const visited = new Set([`${row},${col}`]);
    const matching: Phaser.Physics.Arcade.Sprite[] = [];

    while (stack.length > 0) {
      const { row: r, col: c } = stack.pop()!;
      const bubble = this.grid[r][c];
      if (!bubble) continue;

      // Compare colors
      if ((bubble.getData("color") as number) === color) {
        matching.push(bubble);

        // Check 4-directional neighbors
        const neighbors = [
          { r: r - 1, c },
          { r: r + 1, c },
          { r, c: c - 1 },
          { r, c: c + 1 }
        ];

        for (const n of neighbors) {
          const key = `${n.r},${n.c}`;
          if (
            n.r >= 0 &&
            n.r < this.numRows &&
            n.c >= 0 &&
            n.c < this.numCols &&
            !visited.has(key) &&
            this.grid[n.r][n.c] != null
          ) {
            stack.push({ row: n.r, col: n.c });
            visited.add(key);
          }
        }
      }
    }

    // If 3+ in a cluster, pop them
    if (matching.length >= 3) {
      this.popBubbles(matching);
    }
  }

  /**
   * Plays pop animation, destroys bubbles, updates score, and removes them from the grid.
   */
  private popBubbles(bubbles: Phaser.Physics.Arcade.Sprite[]): void {
    this.popSound?.play();

    bubbles.forEach((bubble) => {
      const r = bubble.getData("row") as number;
      const c = bubble.getData("col") as number;

      // Tween for "pop" effect
      this.tweens.add({
        targets: bubble,
        scaleX: 0,
        scaleY: 0,
        duration: 200,
        onComplete: () => {
          this.grid[r][c] = null;
          bubble.destroy();
        }
      });
    });

    // Update score
    this.score += bubbles.length * 10;
    this.scoreText?.setText(`Score: ${this.score}`);
  }

  /**
   * After every shot, the entire grid descends by `descendInterval` rows.
   * Bubbles moving beyond the last row are removed.
   */
  private descendRows(): void {
    for (let row = this.numRows - 1; row >= 0; row--) {
      for (let col = 0; col < this.numCols; col++) {
        const bubble = this.grid[row][col];
        if (!bubble) continue;

        const newRow = row + this.descendInterval;
        if (newRow < this.numRows) {
          this.grid[newRow][col] = bubble;
          this.grid[row][col] = null;
          bubble.setData("row", newRow);
          bubble.setData("col", col);

          this.tweens.add({
            targets: bubble,
            y: newRow * this.bubbleSize + this.bubbleSize / 2 + 50,
            duration: 300
          });
        } else {
          // Bubble falls off the bottom
          bubble.destroy();
          this.grid[row][col] = null;
        }
      }
    }
  }

  /**
   * Checks if any bubble occupies the bottom row -> triggers Game Over.
   * Alternatively, if the grid is clear, we can progress to the next level.
   */
  private checkGameOver(): void {
    // Game Over if bottom row is occupied
    for (let c = 0; c < this.numCols; c++) {
      if (this.grid[this.numRows - 1][c]) {
        this.handleGameOver();
        return;
      }
    }

    // If all bubbles are cleared, move to next level
    if (this.isGridEmpty()) {
      this.nextLevel();
    }
  }

  /**
   * A simple game-over handler. Here, we restart the scene.
   * In a real game, you might show a "Game Over" screen or menu.
   */
  private handleGameOver(): void {
    this.scene.restart({ gameOver: true, finalScore: this.score });
  }

  /**
   * Checks if the entire grid is empty.
   */
  private isGridEmpty(): boolean {
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        if (this.grid[row][col]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Increases difficulty and moves the game to the next level.
   */
  private nextLevel(): void {
    this.level++;
    this.levelText?.setText(`Level: ${this.level}`);

    // Increase difficulty: e.g., row count, bubble colors, or descend speed
    this.descendInterval = Math.min(this.descendInterval + 1, 3);
    this.numRows = Math.min(this.numRows + 1, 12);

    this.resetGrid();
    this.createInitialBubbles();
  }

  /**
   * Clears the grid and destroys any existing bubbles.
   */
  private resetGrid(): void {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        const bubble = this.grid[row][col];
        bubble?.destroy();
        this.grid[row][col] = null;
      }
    }
    this.grid = [];
    this.bubbleGroup?.clear(true, true);
  }
}
