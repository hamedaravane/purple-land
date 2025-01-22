import Phaser from 'phaser';
import { Bubble } from './Bubble';
import { NEIGHBOR_OFFSETS, SQRT3_OVER_2 } from '@constants';
import { getBubbleColor } from '@utils/ColorUtils';

export class BubbleGrid extends Phaser.GameObjects.Group {
  private readonly rows: number;
  private readonly cols: number;
  private readonly cellWidth: number;
  private readonly cellHeight: number;
  private readonly bubbleRadius: number;
  private readonly grid: (Bubble | null)[][];

  constructor(scene: Phaser.Scene, rows: number, cols: number) {
    super(scene);
    this.rows = rows;
    this.cols = cols;
    this.cellWidth = scene.scale.width / cols;
    this.bubbleRadius = this.cellWidth / 2;
    this.cellHeight = this.cellWidth * SQRT3_OVER_2;
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  }

  createGrid() {
    for (let row = 0; row < this.rows; row++) {
      const isEvenRow = row % 2 === 0;
      const offsetX = isEvenRow ? this.bubbleRadius : 0;
      const maxCols = this.cols - (isEvenRow ? 1 : 0);

      for (let col = 0; col < maxCols; col++) {
        const x = this.normalize(
          this.bubbleRadius + col * this.cellWidth + offsetX,
        );
        const y = this.normalize(this.bubbleRadius + row * this.cellHeight);

        const bubble = new Bubble(
          this.scene,
          x,
          y,
          this.cellWidth,
          'static',
          'bubbles',
          getBubbleColor(),
        );

        bubble.gridCoordinates = { row, col };
        this.add(bubble);
        this.grid[row][col] = bubble;
      }
    }
  }

  addBubbleToGrid(bubble: Bubble): void {
    const { row, col } = bubble.gridCoordinates;
    this.grid[row][col] = bubble;
    this.add(bubble);
  }

  private removeBubble(bubble: Bubble): void {
    const { row, col } = bubble.gridCoordinates;
    if (this.grid[row] && this.grid[row][col] === bubble) {
      this.grid[row][col] = null;
    }
    this.remove(bubble, false);
    bubble.destroy();
  }

  popConnectedBubbles(bubble: Bubble): void {
    const connected = this.findConnectedSameColor(bubble);
    if (connected.length >= 3) {
      connected.forEach((b) => this.removeBubble(b));
    }
  }

  private findConnectedSameColor(startBubble: Bubble): Bubble[] {
    const targetColor = startBubble.color.color;
    const visited = new Set<Bubble>();
    const queue: Bubble[] = [startBubble];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (!visited.has(current)) {
        visited.add(current);

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

  getPositionByCoords(col: number, row: number): { x: number; y: number } {
    const offsetX = row % 2 === 0 ? this.bubbleRadius : 0;
    const x = this.bubbleRadius + col * this.cellWidth + offsetX;
    const y = this.bubbleRadius + row * this.cellHeight;
    return { x, y };
  }

  getCoordsByPosition(x: number, y: number): { col: number; row: number } {
    let row = Math.floor((y - this.bubbleRadius) / this.cellHeight);
    row = Phaser.Math.Clamp(row, 0, this.rows - 1);

    const isEvenRow = row % 2 === 0;
    const offsetX = isEvenRow ? this.bubbleRadius : 0;

    let col = Math.floor((x - this.bubbleRadius - offsetX) / this.cellWidth);
    col = Phaser.Math.Clamp(col, 0, this.cols - 1);

    return { col, row };
  }

  getNearestGridPosition(x: number, y: number): { x: number; y: number } {
    let row = Math.round((y - this.bubbleRadius) / this.cellHeight);
    if (row < 0) row = 0;

    const isEvenRow = row % 2 === 0;
    let col: number;

    if (isEvenRow) {
      col = Math.round(x / this.cellWidth - 1);
    } else {
      col = Math.round(x / this.cellWidth - 0.5);
    }
    if (col < 0) col = 0;

    const snappedX = isEvenRow
      ? this.cellWidth * (col + 1)
      : this.cellWidth * (col + 0.5);

    const snappedY = this.bubbleRadius + row * this.cellHeight;

    return {
      x: this.normalize(snappedX),
      y: this.normalize(snappedY),
    };
  }

  private isValidCell(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.grid.length &&
      col >= 0 &&
      col < this.grid[row].length
    );
  }

  getCellWidth(): number {
    return this.cellWidth;
  }

  private normalize(value: number, precision: number = 2): number {
    return parseFloat(value.toFixed(precision));
  }
}
