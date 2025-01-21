import { Bubble } from '@objects/Bubble.ts';
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
  }

  public handleBubbleCollision(shootingBubble: Bubble) {
    (shootingBubble.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    const { x: snappedX, y: snappedY } = this.getNearestGridPosition(
      shootingBubble.x,
      shootingBubble.y,
    );
    shootingBubble.snapTo(snappedX, snappedY);

    shootingBubble._bubbleType = 'static';
    this.addBubble(shootingBubble);

    // Now attempt to pop any connected cluster of the same color
    this.popConnectedBubbles(shootingBubble);
  }

  /**
   * Attempt to pop all bubbles connected to the given bubble
   * if they form a large enough cluster.
   */
  public popConnectedBubbles(startBubble: Bubble) {
    const connected = this.findConnectedSameColor(startBubble);
    if (connected.length >= 3) {
      connected.forEach((b: Bubble) => this.removeBubble(b));
    }
  }

  /**
   * Find all bubbles connected to startBubble (including itself)
   * that have the same color. Uses BFS on the hex grid.
   */
  private findConnectedSameColor(startBubble: Bubble): Bubble[] {
    const targetColor = startBubble.color.color;
    const visited = new Set<Bubble>();
    const queue: Bubble[] = [startBubble];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (!visited.has(current)) {
        visited.add(current);

        // Check all neighbors
        const neighbors = this.getNeighbors(current);
        for (const neighbor of neighbors) {
          if (
            neighbor &&
            !visited.has(neighbor) &&
            neighbor.color.color === targetColor
          ) {
            queue.push(neighbor);
          }
        }
      }
    }

    return Array.from(visited);
  }

  /**
   * Return all valid neighboring bubbles of a given bubble in the hex grid.
   */
  private getNeighbors(bubble: Bubble): Bubble[] {
    // Find this bubble’s row/col in the grid
    const { row, col } = this.getGridCoords(bubble);

    // Get offsets depending on even/odd row
    const offsets = this.getNeighborOffsets(row);
    const neighbors: Bubble[] = [];

    // For each offset, compute neighbor’s (row, col)
    for (const [dRow, dCol] of offsets) {
      const nRow = row + dRow;
      const nCol = col + dCol;

      // Bounds-check
      if (
        nRow >= 0 &&
        nRow < this.grid.length &&
        nCol >= 0 &&
        nCol < this.grid[nRow].length
      ) {
        const neighbor = this.grid[nRow][nCol];
        if (neighbor) {
          neighbors.push(neighbor);
        }
      }
    }
    return neighbors;
  }

  /**
   * Return row/col offsets for neighbors in a hex grid.
   * Adjust if row is even or odd.
   */
  private getNeighborOffsets(row: number): [number, number][] {
    // For "even-r" horizontal layout, typical neighbor sets can look like:
    if (row % 2 === 0) {
      return [
        [-1, 0], // top-left
        [-1, -1], // top-right
        [0, -1], // left
        [0, 1], // right
        [1, 0], // bottom-left
        [1, -1], // bottom-right
      ];
    } else {
      // Odd row neighbor offsets:
      return [
        [-1, 0], // top-left
        [-1, 1], // top-right
        [0, -1], // left
        [0, 1], // right
        [1, 0], // bottom-left
        [1, 1], // bottom-right
      ];
    }
  }

  /**
   * Approximate the grid row/col for a given bubble,
   * mirroring the logic in `getNearestGridPosition`.
   */
  private getGridCoords(bubble: Bubble): { row: number; col: number } {
    let row = Math.round((bubble.y - this.bubbleRadius) / this.rowHeight);
    if (row < 0) row = 0;
    if (row >= this.grid.length) row = this.grid.length - 1;

    const isEvenRow = row % 2 === 0;
    let col: number;

    if (isEvenRow) {
      col = Math.round(bubble.x / this.bubbleWidth - 1);
    } else {
      col = Math.round(bubble.x / this.bubbleWidth - 0.5);
    }

    if (col < 0) col = 0;
    // Make sure col is in range for this row
    if (col >= this.grid[row].length) {
      col = this.grid[row].length - 1;
    }

    return { row, col };
  }

  private getNearestGridPosition(
    x: number,
    y: number,
  ): { x: number; y: number } {
    let row = Math.round((y - this.bubbleRadius) / this.rowHeight);
    if (row < 0) row = 0;

    const isEvenRow = row % 2 === 0;

    let col: number;
    if (isEvenRow) {
      col = Math.round(x / this.bubbleWidth - 1);
    } else {
      col = Math.round(x / this.bubbleWidth - 0.5);
    }

    if (col < 0) col = 0;

    const snappedX = isEvenRow
      ? this.bubbleWidth * (col + 1)
      : this.bubbleWidth * (col + 0.5);

    const snappedY = this.bubbleRadius + row * this.rowHeight;

    return {
      x: this.normalize(snappedX),
      y: this.normalize(snappedY),
    };
  }

  public addBubble(bubble: Bubble): void {
    const normalizedX = this.normalize(bubble.x);
    const normalizedY = this.normalize(bubble.y);

    this.bubblesGroup.add(bubble);
    this.bubbleMap.set(`${normalizedX},${normalizedY}`, bubble);
  }

  public removeBubble(bubble: Bubble): void {
    const normalizedX = this.normalize(bubble.x);
    const normalizedY = this.normalize(bubble.y);

    this.bubblesGroup.remove(bubble, false, false);
    this.bubbleMap.delete(`${normalizedX},${normalizedY}`);
    bubble.destroy();
  }

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

        this.bubblesGroup.add(bubble);
        this.bubbleMap.set(`${x},${y}`, bubble);

        this.grid[row][col] = bubble;
      }
    }
  }

  private normalize(value: number, precision: number = 2): number {
    return parseFloat(value.toFixed(precision));
  }
}
