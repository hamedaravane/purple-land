import { Bubble, NeighborPositions } from '@objects/Bubble.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';

export class BubbleCluster {
  private readonly scene: Phaser.Scene;
  private bubblesGroup: Phaser.GameObjects.Group;
  private bubbleMap: Map<string, Bubble>;
  private readonly grid: (Bubble | null)[][];
  private readonly bubbleWidth: number;
  private readonly bubbleRadius: number;
  private readonly rowHeight: number;

  constructor(
    scene: Phaser.Scene,
    cols: number,
    rows: number,
    spriteKey: string,
    bubbleWidth: number,
  ) {
    this.scene = scene;
    this.bubbleWidth = bubbleWidth;

    this.bubbleRadius = this.bubbleWidth / 2;
    this.rowHeight = this.bubbleWidth * 0.866;

    this.bubblesGroup = new Phaser.GameObjects.Group(this.scene);

    this.bubbleMap = new Map<string, Bubble>();

    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));

    this.createGrid(cols, rows, spriteKey);
    this.assignNeighbors(rows);
  }

  /**
   * Handle a collision between a shooting bubble and a target bubble.
   */
  public handleBubbleCollision(
    shootingBubble: Bubble,
    targetBubble: Bubble,
  ): void {
    if (targetBubble.color.color === shootingBubble.color.color) {
      this.removeBubble(targetBubble);
      this.removeBubble(shootingBubble);
      return;
    }

    const { x, y } = this.findNearestPositionForTargetBubble(targetBubble);

    (shootingBubble.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    shootingBubble.snapTo(x, y);
    shootingBubble.bubbleType = 'static';

    this.addBubble(shootingBubble);
  }

  /** Add a bubble to the cluster and track its position in the map */
  public addBubble(bubble: Bubble): void {
    const normalizedX = this.normalize(bubble.x);
    const normalizedY = this.normalize(bubble.y);

    this.bubblesGroup.add(bubble);
    this.bubbleMap.set(`${normalizedX},${normalizedY}`, bubble);
  }

  /** Remove a bubble from the cluster, and destroy the game object */
  public removeBubble(bubble: Bubble): void {
    const normalizedX = this.normalize(bubble.x);
    const normalizedY = this.normalize(bubble.y);

    this.bubblesGroup.remove(bubble, false, false);
    this.bubbleMap.delete(`${normalizedX},${normalizedY}`);
    bubble.destroy();
  }

  /** Checks if a position (x, y) is free by looking it up in `bubbleMap`. */
  private isPositionEmpty(x: number, y: number): boolean {
    const normalizedX = this.normalize(x);
    const normalizedY = this.normalize(y);

    return !this.bubbleMap.has(`${normalizedX},${normalizedY}`);
  }

  /**
   * Get all current bubbles as an array.
   */
  public getBubbles(): Bubble[] {
    return this.bubblesGroup.getChildren() as Bubble[];
  }

  private createGrid(cols: number, rows: number, spriteKey: string): void {
    let bubbleNumber = 0;

    for (let row = 0; row < rows; row++) {
      const isEvenRow = row % 2 === 0;
      const offsetX = isEvenRow ? this.bubbleRadius : 0;

      const maxCols = cols - (isEvenRow ? 1 : 0);

      for (let col = 0; col < maxCols; col++) {
        bubbleNumber++;
        const x = this.normalize(
          this.bubbleRadius + col * this.bubbleWidth + offsetX,
        );
        const y = this.normalize(this.bubbleRadius + row * this.rowHeight);

        const bubble = new Bubble(
          this.scene,
          x,
          y,
          this.bubbleWidth,
          'static',
          spriteKey,
          getBubbleColor(),
        );
        console.log(`Bubble ${bubbleNumber} position: ${x}, ${y}`);
        this.bubblesGroup.add(bubble);
        this.bubbleMap.set(`${x},${y}`, bubble);

        this.grid[row][col] = bubble;
      }
    }
  }

  /**
   * Assign neighbors for each bubble in the grid.
   *
   * Depending on your logic, "wall" can be represented as 1,
   * and "empty" as null, whenever the neighbor indices go out of range.
   */
  private assignNeighbors(rows: number): void {
    for (let row = 0; row < rows; row++) {
      // Guard against rows that have fewer columns
      if (!this.grid[row]) continue;

      for (let col = 0; col < this.grid[row].length; col++) {
        const bubble = this.grid[row][col];
        if (!bubble) continue;

        const isEvenRow = row % 2 === 0;

        // LEFT
        if (col - 1 >= 0) {
          bubble.assignNeighbor(
            NeighborPositions.LEFT,
            this.grid[row][col - 1],
          );
        } else {
          // Out of bounds => wall
          bubble.assignNeighbor(NeighborPositions.LEFT, 1);
        }

        // RIGHT
        if (col + 1 < this.grid[row].length) {
          bubble.assignNeighbor(
            NeighborPositions.RIGHT,
            this.grid[row][col + 1],
          );
        } else {
          bubble.assignNeighbor(NeighborPositions.RIGHT, 1);
        }

        // TOP-LEFT
        {
          const topLeftRow = row - 1;
          // For even rows, same col; for odd rows, col - 1
          const topLeftCol = col + (isEvenRow ? 0 : -1);
          if (
            topLeftRow >= 0 &&
            topLeftCol >= 0 &&
            this.grid[topLeftRow] &&
            topLeftCol < this.grid[topLeftRow].length
          ) {
            bubble.assignNeighbor(
              NeighborPositions.TOP_LEFT,
              this.grid[topLeftRow][topLeftCol],
            );
          } else {
            bubble.assignNeighbor(NeighborPositions.TOP_LEFT, 1);
          }
        }

        // TOP-RIGHT
        {
          const topRightRow = row - 1;
          // For even rows, col + 1; for odd rows, same col
          const topRightCol = col + (isEvenRow ? 1 : 0);
          if (
            topRightRow >= 0 &&
            this.grid[topRightRow] &&
            topRightCol >= 0 &&
            topRightCol < this.grid[topRightRow].length
          ) {
            bubble.assignNeighbor(
              NeighborPositions.TOP_RIGHT,
              this.grid[topRightRow][topRightCol],
            );
          } else {
            bubble.assignNeighbor(NeighborPositions.TOP_RIGHT, 1);
          }
        }

        // BOTTOM-LEFT
        {
          const bottomLeftRow = row + 1;
          // For even rows, same col; for odd rows, col - 1
          const bottomLeftCol = col + (isEvenRow ? 0 : -1);
          if (
            bottomLeftRow < rows &&
            this.grid[bottomLeftRow] &&
            bottomLeftCol >= 0 &&
            bottomLeftCol < this.grid[bottomLeftRow].length
          ) {
            bubble.assignNeighbor(
              NeighborPositions.BOTTOM_LEFT,
              this.grid[bottomLeftRow][bottomLeftCol],
            );
          } else {
            bubble.assignNeighbor(NeighborPositions.BOTTOM_LEFT, 1);
          }
        }

        // BOTTOM-RIGHT
        {
          const bottomRightRow = row + 1;
          // For even rows, col + 1; for odd rows, same col
          const bottomRightCol = col + (isEvenRow ? 1 : 0);
          if (
            bottomRightRow < rows &&
            this.grid[bottomRightRow] &&
            bottomRightCol >= 0 &&
            bottomRightCol < this.grid[bottomRightRow].length
          ) {
            bubble.assignNeighbor(
              NeighborPositions.BOTTOM_RIGHT,
              this.grid[bottomRightRow][bottomRightCol],
            );
          } else {
            bubble.assignNeighbor(NeighborPositions.BOTTOM_RIGHT, 1);
          }
        }
      }
    }
  }

  /** Find the nearest position around the target bubble that is not occupied. */
  private findNearestPositionForTargetBubble(targetBubble: Bubble): {
    x: number;
    y: number;
  } {
    const neighbors = this.getPotentialNeighborPositions(
      targetBubble.x,
      targetBubble.y,
    );

    for (const { x, y } of neighbors) {
      if (this.isPositionEmpty(x, y)) {
        const normalizedX = this.normalize(x);
        const normalizedY = this.normalize(y);

        console.log('Nearest empty position found', {
          x: normalizedX,
          y: normalizedY,
        });
        return { x: normalizedX, y: normalizedY };
      }
    }

    console.warn('No empty position found, snapping to target bubble');
    return {
      x: this.normalize(targetBubble.x),
      y: this.normalize(targetBubble.y),
    };
  }

  /**
   * Returns potential 6 neighboring positions around (x, y) in a hexagonal arrangement.
   */
  private getPotentialNeighborPositions(
    x: number,
    y: number,
  ): { x: number; y: number }[] {
    return [
      { x: x + this.bubbleWidth, y },
      { x: x - this.bubbleWidth, y },
      { x: x + this.bubbleRadius, y: y + this.rowHeight },
      { x: x - this.bubbleRadius, y: y + this.rowHeight },
      { x: x + this.bubbleRadius, y: y - this.rowHeight },
      { x: x - this.bubbleRadius, y: y - this.rowHeight },
    ];
  }

  /** Normalize a number to a fixed precision */
  private normalize(value: number, precision: number = 2): number {
    return parseFloat(value.toFixed(precision));
  }
}
