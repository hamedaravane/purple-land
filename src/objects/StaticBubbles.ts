import { Bubble } from '@objects/Bubble';
import { getBubbleColor } from '@utils/ColorUtils.ts';

export class StaticBubbles extends Phaser.GameObjects.Group {
  private grid: Array<Array<Bubble | undefined>> = [];

  constructor(
    scene: Phaser.Scene,
    private bubbleWidth: number,
    private readonly rows: number,
    private readonly cols: number,
  ) {
    super(scene);
    this.generateGrid();
  }

  public handleCollision(shootingBubble: Bubble, targetBubble: Bubble) {
    if (shootingBubble.color.label === targetBubble.color.label) {
      this.chainPop(targetBubble, shootingBubble.color.label);
      shootingBubble.pop();
      this.dropFloatingBubbles();
    } else {
      this.attachShootingBubble(shootingBubble);
    }
  }

  private generateGrid() {
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      this.grid[rowIndex] = [];
      const isOffset = rowIndex % 2 === 1;
      for (
        let colIndex = 0;
        isOffset ? colIndex < this.cols : colIndex < this.cols;
        colIndex++
      ) {
        const bubble = new Bubble(
          this.scene,
          rowIndex * this.bubbleWidth,
          colIndex * this.bubbleWidth,
          this.bubbleWidth,
          'static',
          getBubbleColor(),
        );
        this.add(bubble);
        this.grid[rowIndex][colIndex] = bubble;
        this.linkNeighbors(bubble, rowIndex, colIndex);
      }
    }
  }

  private attachShootingBubble(bubble: Bubble) {
    const { rowIndex, colIndex } = this.findNearestGridPosition(
      bubble.x,
      bubble.y,
    );
    const { r, c } = this.findClosestEmptySlot(rowIndex, colIndex);
    const { x, y } = this.computeBubblePosition(r, c);
    bubble.setPosition(x, y);
    bubble.setStatic();
    this.add(bubble);
    if (!this.grid[r]) {
      this.grid[r] = [];
    }
    this.grid[r][c] = bubble;
    this.linkNeighbors(bubble, r, c);
  }

  private findNearestGridPosition(x: number, y: number) {
    const rowIndex = Math.round(y / (this.bubbleWidth * Math.sqrt(3)));
    const isOffset = rowIndex % 2 === 1;
    const offsetX = isOffset ? this.bubbleWidth : this.bubbleWidth * 2;
    const colIndex = Math.round((x - offsetX) / (2 * this.bubbleWidth));
    return { rowIndex, colIndex };
  }

  private findClosestEmptySlot(row: number, col: number) {
    const visited = new Set<string>();
    const queue = [{ r: row, c: col }];
    while (queue.length) {
      const { r, c } = queue.shift()!;
      if (!this.grid[r] || !this.grid[r][c]) {
        return { r, c };
      }
      visited.add(`${r},${c}`);
      this.getGridNeighbors(r, c).forEach((n) => {
        const key = `${n.r},${n.c}`;
        if (!visited.has(key)) {
          queue.push(n);
        }
      });
    }
    return { r: row, c: col };
  }

  private getGridNeighbors(row: number, col: number) {
    const isOffset = row % 2 === 1;
    return [
      { r: row, c: col - 1 },
      { r: row, c: col + 1 },
      { r: row - 1, c: col + (isOffset ? 0 : -1) },
      { r: row - 1, c: col + (isOffset ? 1 : 0) },
      { r: row + 1, c: col + (isOffset ? 0 : -1) },
      { r: row + 1, c: col + (isOffset ? 1 : 0) },
    ];
  }

  private computeBubblePosition(rowIndex: number, colIndex: number) {
    const isOffset = rowIndex % 2 === 1;
    const x = isOffset
      ? this.bubbleWidth + colIndex * this.bubbleWidth * 2
      : this.bubbleWidth * 2 + colIndex * this.bubbleWidth * 2;
    const y = rowIndex * this.bubbleWidth * Math.sqrt(3);
    return { x, y };
  }

  private linkNeighbors(bubble: Bubble, rowIndex: number, colIndex: number) {
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
      const nr = rowIndex + row;
      const nc = colIndex + col + (isOffset && row !== 0 ? 1 : 0);
      const neighbor = this.grid[nr]?.[nc];
      if (neighbor && neighbor instanceof Bubble) {
        bubble.addNeighbor(neighbor);
        neighbor.addNeighbor(bubble);
      }
    });
  }

  private chainPop(startBubble: Bubble, color: string) {
    const stack: Bubble[] = [startBubble];
    const visited = new Set<Bubble>();
    while (stack.length) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      if (current.color.label === color) {
        current.pop();
        this.removeFromGrid(current);
        current.neighbors
          .filter((n) => n.color.label === color && !visited.has(n))
          .forEach((n) => stack.push(n));
      }
    }
  }

  private removeFromGrid(bubble: Bubble) {
    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < (this.grid[r]?.length || 0); c++) {
        if (this.grid[r][c] === bubble) {
          this.grid[r][c] = undefined;
        }
      }
    }
    this.remove(bubble, true, false);
  }

  private dropFloatingBubbles() {
    const visited = new Set<Bubble>();
    const anchorRow = 1;
    if (this.grid[anchorRow]) {
      for (let col = 0; col < this.grid[anchorRow].length; col++) {
        const topBubble = this.grid[anchorRow][col];
        if (topBubble) {
          this.bfsMarkConnected(topBubble, visited);
        }
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

  private bfsMarkConnected(start: Bubble, visited: Set<Bubble>) {
    const queue: Bubble[] = [start];
    while (queue.length) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      current.neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      });
    }
  }
}
