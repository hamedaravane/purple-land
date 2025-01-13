import { getRandomBubbleColor } from '@utils/ColorUtils';
import { Bubble } from '@objects/Bubble';

export class StaticBubbles extends Phaser.GameObjects.Group {
  private grid: Array<Array<Bubble | undefined>> = [];

  constructor(
    scene: Phaser.Scene,
    private radius: number,
    private rows: number,
    private cols: number,
  ) {
    super(scene);
    this.generateGrid();
  }

  public handleCollision(shootingBubble: Bubble, targetBubble: Bubble): void {
    if (shootingBubble.color === targetBubble.color) {
      this.chainPop(targetBubble, shootingBubble.color);

      shootingBubble.pop();

      this.dropFloatingBubbles();
    } else {
      this.attachShootingBubble(shootingBubble);
    }

    this.spawnNewShootingBubble();
  }

  private generateGrid(): void {
    for (let rowIndex = 1; rowIndex < this.rows; rowIndex++) {
      this.grid[rowIndex] = [];
      const isOffset = rowIndex % 2 === 1;

      for (
        let colIndex = 0;
        isOffset ? colIndex < this.cols : colIndex < this.cols - 1;
        colIndex++
      ) {
        const bubble = this.createSingleBubble(rowIndex, colIndex, isOffset);
        this.grid[rowIndex][colIndex] = bubble;
        this.linkNeighbors(bubble, rowIndex, colIndex);
      }
    }
  }

  private createSingleBubble(
    rowIndex: number,
    colIndex: number,
    isOffset: boolean,
  ): Bubble {
    const x = isOffset
      ? this.radius + colIndex * this.radius * 2
      : this.radius * 2 + colIndex * this.radius * 2;

    const y = rowIndex * this.radius * Math.sqrt(3);

    const color = getRandomBubbleColor();
    const bubble = new Bubble(
      this.scene,
      x,
      y,
      this.radius * 2,
      'static',
      color,
    );
    this.add(bubble);

    return bubble;
  }

  private attachShootingBubble(bubble: Bubble): void {
    const { rowIndex, colIndex } = this.findNearestGridPosition(
      bubble.x,
      bubble.y,
    );
    bubble.setStatic();
    this.add(bubble);

    if (!this.grid[rowIndex]) {
      this.grid[rowIndex] = [];
    }
    this.grid[rowIndex][colIndex] = bubble;

    this.linkNeighbors(bubble, rowIndex, colIndex);
  }

  private findNearestGridPosition(
    x: number,
    y: number,
  ): { rowIndex: number; colIndex: number } {
    const rowIndex = Math.round(y / (this.radius * Math.sqrt(3)));
    const isOffset = rowIndex % 2 === 1;
    const offsetX = isOffset ? this.radius : this.radius * 2;
    const colIndex = Math.round((x - offsetX) / (2 * this.radius));
    return { rowIndex, colIndex };
  }

  private linkNeighbors(
    bubble: Bubble,
    rowIndex: number,
    colIndex: number,
  ): void {
    const directions = [
      { row: 0, col: -1 },
      { row: 0, col: 1 },
      { row: -1, col: 0 },
      { row: -1, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: -1 },
    ];

    const isOffset = rowIndex % 2 === 1;

    directions.forEach(({ row, col }) => {
      const neighborRow = rowIndex + row;
      const neighborCol = colIndex + col + (isOffset && row !== 0 ? 1 : 0);

      const neighbor = this.grid[neighborRow]?.[neighborCol];
      if (neighbor && neighbor instanceof Bubble) {
        bubble.addNeighbor(neighbor);
        neighbor.addNeighbor(bubble);
      }
    });
  }

  private chainPop(startBubble: Bubble, color: number): void {
    const stack: Bubble[] = [startBubble];
    const visited = new Set<Bubble>();

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);

      if (current.color === color) {
        current.pop();
        this.removeFromGrid(current);

        current.neighbors
          .filter((n) => n.color === color && !visited.has(n))
          .forEach((n) => stack.push(n));
      }
    }
  }

  private removeFromGrid(bubble: Bubble): void {
    // find it in the grid and remove reference
    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < (this.grid[r]?.length || 0); c++) {
        if (this.grid[r][c] === bubble) {
          this.grid[r][c] = undefined;
        }
      }
    }
    this.remove(bubble, true, false);
  }

  private dropFloatingBubbles(): void {
    const visited = new Set<Bubble>();

    for (let colIndex = 0; colIndex < (this.grid[1]?.length || 0); colIndex++) {
      const topBubble = this.grid[1][colIndex];
      if (topBubble) {
        this.bfsMarkConnected(topBubble, visited);
      }
    }

    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < (this.grid[r]?.length || 0); c++) {
        const bubble = this.grid[r][c];
        if (bubble && !visited.has(bubble)) {
          bubble.fall();
          this.removeFromGrid(bubble);
        }
      }
    }
  }

  /**
   * BFS to mark all connected bubbles from a starting bubble.
   */
  private bfsMarkConnected(start: Bubble, visited: Set<Bubble>): void {
    const queue: Bubble[] = [start];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      current.neighbors
        .filter((n) => !visited.has(n))
        .forEach((n) => queue.push(n));
    }
  }

  /**
   * Creates a new bubble for the next shot. This is usually done
   * by your main scene or game logic. Put logic here if you want.
   */
  private spawnNewShootingBubble(): void {
    // ... create new bubble at some "shooter position" ...
  }
}
