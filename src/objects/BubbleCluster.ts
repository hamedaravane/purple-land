import { Bubble } from '@objects/Bubble.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';
import { NEIGHBOR_OFFSETS } from '@constants';

export class BubbleCluster {
  private readonly scene: Phaser.Scene;
  private bubblesGroup: Phaser.GameObjects.Group;
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
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));

    this.createGrid(cols, rows, spriteKey);
  }

  /**
   * Handle collision of the shooting bubble with the existing cluster.
   */
  public handleBubbleCollision(shootingBubble: Bubble) {
    (shootingBubble.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    const { x: snappedX, y: snappedY } = this.getNearestGridPosition(
      shootingBubble.x,
      shootingBubble.y,
    );
    shootingBubble.snapTo(snappedX, snappedY);
    shootingBubble._bubbleType = 'static';

    this.addBubble(shootingBubble);
    this.popConnectedBubbles(shootingBubble);
  }

  /**
   * If 3+ connected, pop them.
   */
  public popConnectedBubbles(startBubble: Bubble) {
    const connected = this.findConnectedSameColor(startBubble);
    if (connected.length >= 3) {
      connected.forEach((b) => this.removeBubble(b));
    }
  }

  /**
   * Find all bubbles connected to startBubble that share the same color.
   * Using a simple BFS or DFS approach.
   */
  private findConnectedSameColor(startBubble: Bubble): Bubble[] {
    const targetColor = startBubble.color.color;
    const visited = new Set<Bubble>();
    const queue: Bubble[] = [startBubble];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (!visited.has(current)) {
        visited.add(current);

        // Push unvisited neighbors of the same color
        for (const neighbor of this.getNeighbors(current)) {
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
   * Get the six neighbors around a bubble, depending on row parity.
   */
  private getNeighbors(bubble: Bubble): Bubble[] {
    const { row, col } = bubble.gridCoordinates;
    const rowParity = row % 2 === 0 ? 'even' : 'odd';
    const offsets = NEIGHBOR_OFFSETS[rowParity];
    const neighbors: Bubble[] = [];

    for (const [dRow, dCol] of offsets) {
      const nRow = row + dRow;
      const nCol = col + dCol;
      if (this.isValidCell(nRow, nCol)) {
        const neighbor = this.grid[nRow][nCol];
        if (neighbor) {
          neighbors.push(neighbor);
        }
      }
    }

    return neighbors;
  }

  /**
   * Snap the bubble to the nearest cell in the grid.
   * Return the pixel x,y for that cell.
   */
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

  /**
   * Add a bubble to the cluster (both group & map).
   */
  public addBubble(bubble: Bubble): void {
    this.bubblesGroup.add(bubble);
  }

  /**
   * Remove a bubble from the cluster (both group & map).
   */
  public removeBubble(bubble: Bubble): void {
    this.bubblesGroup.remove(bubble, false, false);
    bubble.destroy();
  }

  /**
   * Get all static bubbles as an array.
   */
  public getBubbles(): Bubble[] {
    return this.bubblesGroup.getChildren() as Bubble[];
  }

  /**
   * Initialize grid with static bubbles.
   */
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

        // Store grid coords inside the bubble for easy reference:
        bubble.gridCoordinates = { row, col };

        this.bubblesGroup.add(bubble);
        this.grid[row][col] = bubble;
      }
    }
  }

  /**
   * Check that row,col is inside the grid.
   */
  private isValidCell(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.grid.length &&
      col >= 0 &&
      col < this.grid[row].length
    );
  }

  /**
   * Normalize the floating-point rounding of x,y positions.
   */
  private normalize(value: number, precision: number = 2): number {
    return parseFloat(value.toFixed(precision));
  }
}
