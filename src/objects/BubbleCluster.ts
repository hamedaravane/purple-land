import { Bubble } from '@objects/Bubble.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';
import { ColorObj } from '@constants/BubbleColors.ts';

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

  public handleBubbleCollision(shootingBubble: Bubble): void {
    (shootingBubble.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    const { x: snappedX, y: snappedY } = this.getNearestGridPosition(
      shootingBubble.x,
      shootingBubble.y,
    );
    shootingBubble.snapTo(snappedX, snappedY);
    shootingBubble.bubbleType = 'static';

    this.addBubble(shootingBubble);

    this.checkForMatches(shootingBubble);

    this.removeFloatingBubbles();
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

    const { row, col } = this.getGridCoords(bubble.x, bubble.y);
    if (
      row >= 0 &&
      col >= 0 &&
      row < this.grid.length &&
      col < this.grid[row].length
    ) {
      this.grid[row][col] = bubble;
    }
  }

  public removeBubble(bubble: Bubble): void {
    const normalizedX = this.normalize(bubble.x);
    const normalizedY = this.normalize(bubble.y);

    this.bubblesGroup.remove(bubble, false, false);

    this.bubbleMap.delete(`${normalizedX},${normalizedY}`);

    const { row, col } = this.getGridCoords(bubble.x, bubble.y);
    if (
      row >= 0 &&
      col >= 0 &&
      row < this.grid.length &&
      col < this.grid[row].length
    ) {
      this.grid[row][col] = null;
    }

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
        console.log(`Bubble ${bubbleNumber} position: ${x}, ${y}`);

        this.bubblesGroup.add(bubble);
        this.bubbleMap.set(`${x},${y}`, bubble);

        this.grid[row][col] = bubble;
      }
    }
  }

  private normalize(value: number, precision: number = 2): number {
    return parseFloat(value.toFixed(precision));
  }

  private checkForMatches(bubble: Bubble): void {
    const { row, col } = this.getGridCoords(bubble.x, bubble.y);

    const cluster = this.findConnectedCluster(row, col, bubble.color);

    for (const bbl of cluster) {
      this.removeBubble(bbl);
    }
  }

  private getGridCoords(x: number, y: number): { row: number; col: number } {
    const row = Math.round((y - this.bubbleRadius) / this.rowHeight);
    const isEvenRow = row % 2 === 0;

    let col: number;
    if (isEvenRow) {
      col = Math.round(x / this.bubbleWidth - 1);
    } else {
      col = Math.round(x / this.bubbleWidth - 0.5);
    }

    return { row, col };
  }

  private findConnectedCluster(
    startRow: number,
    startCol: number,
    color: ColorObj,
  ): Bubble[] {
    const visited = new Set<string>();
    const cluster: Bubble[] = [];
    const queue: Array<{ row: number; col: number }> = [];

    queue.push({ row: startRow, col: startCol });

    while (queue.length > 0) {
      const { row, col } = queue.shift()!;

      if (
        row < 0 ||
        col < 0 ||
        row >= this.grid.length ||
        col >= this.grid[row].length
      ) {
        continue;
      }

      const bubble = this.grid[row][col];
      if (!bubble) {
        continue;
      }

      const key = `${row},${col}`;
      if (!visited.has(key) && bubble.color.label === color.label) {
        visited.add(key);
        cluster.push(bubble);

        for (const { r, c } of this.getNeighbors(row, col)) {
          queue.push({ row: r, col: c });
        }
      }
    }

    return cluster;
  }

  private getNeighbors(
    row: number,
    col: number,
  ): Array<{ r: number; c: number }> {
    const neighbors: Array<{ r: number; c: number }> = [];
    const isEvenRow = row % 2 === 0;

    if (isEvenRow) {
      neighbors.push({ r: row - 1, c: col });
      neighbors.push({ r: row - 1, c: col - 1 });
      neighbors.push({ r: row, c: col - 1 });
      neighbors.push({ r: row, c: col + 1 });
      neighbors.push({ r: row + 1, c: col });
      neighbors.push({ r: row + 1, c: col - 1 });
    } else {
      neighbors.push({ r: row - 1, c: col });
      neighbors.push({ r: row - 1, c: col + 1 });
      neighbors.push({ r: row, c: col - 1 });
      neighbors.push({ r: row, c: col + 1 });
      neighbors.push({ r: row + 1, c: col });
      neighbors.push({ r: row + 1, c: col + 1 });
    }

    return neighbors;
  }

  private removeFloatingBubbles(): void {
    if (this.grid.length === 0) return;

    const visited = new Set<string>();
    const topRow = 0;
    for (let col = 0; col < this.grid[topRow].length; col++) {
      const bubble = this.grid[topRow][col];
      if (bubble) {
        this.markConnectedToTop(topRow, col, visited);
      }
    }

    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[r].length; c++) {
        const bubble = this.grid[r][c];
        if (bubble && !visited.has(`${r},${c}`)) {
          this.removeBubble(bubble);
        }
      }
    }
  }

  private markConnectedToTop(
    row: number,
    col: number,
    visited: Set<string>,
  ): void {
    const queue: Array<{ row: number; col: number }> = [{ row, col }];

    while (queue.length > 0) {
      const { row: r, col: c } = queue.shift()!;
      const key = `${r},${c}`;

      if (
        r < 0 ||
        c < 0 ||
        r >= this.grid.length ||
        c >= this.grid[r].length ||
        visited.has(key) ||
        !this.grid[r][c]
      ) {
        continue;
      }

      visited.add(key);

      for (const { r: nr, c: nc } of this.getNeighbors(r, c)) {
        queue.push({ row: nr, col: nc });
      }
    }
  }
}
