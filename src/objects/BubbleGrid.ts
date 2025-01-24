import Phaser from 'phaser';
import { Bubble } from './Bubble';
import { NEIGHBOR_OFFSETS, SQRT3_OVER_2 } from '@constants';
import { Coordinate } from '@types';
import { getBubbleColor } from '@utils/ColorUtils.ts';

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
          getBubbleColor(),
        );

        bubble.gridCoordinates = { row, col };
        this.add(bubble);
        this.grid[row][col] = bubble;
      }
    }
  }

  addBubbleToGrid(bubble: Bubble) {
    const { row, col } = bubble.gridCoordinates;
    this.grid[row][col] = bubble;
    this.add(bubble);
  }

  private removeBubble(bubble: Bubble) {
    const { row, col } = bubble.gridCoordinates;
    if (this.grid[row] && this.grid[row][col] === bubble) {
      this.grid[row][col] = null;
    }
    this.remove(bubble, false);
    bubble.destroy();
  }

  popConnectedBubbles(startBubble: Bubble) {
    const connected = this.findConnectedSameColor(startBubble);
    if (connected.length >= 3) {
      connected.forEach((b) => this.removeBubble(b));
    }
  }

  private findConnectedSameColor(startBubble: Bubble): Bubble[] {
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
            neighbor.color.color === startBubble.color.color
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

  getCoordsByPosition(x: number, y: number): Coordinate {
    let row = Math.floor((y - this.bubbleRadius) / this.cellHeight);
    row = Phaser.Math.Clamp(row, 0, this.rows - 1);

    const isEvenRow = row % 2 === 0;
    const offsetX = isEvenRow ? this.bubbleRadius : 0;

    let col = Math.floor((x - this.bubbleRadius - offsetX) / this.cellWidth);
    col = Phaser.Math.Clamp(col, 0, this.cols - 1);

    return { row, col };
  }

  snapBubbleToGrid(bubble: Bubble) {
    const { snappedX: x, snappedY: y } = this.getNearestGridPosition(
      bubble.x,
      bubble.y,
    );
    bubble.setPosition(x, y);
    bubble.gridCoordinates = this.getCoordsByPosition(x, y);
    this.addBubbleToGrid(bubble);
  }

  private getNearestGridPosition(
    x: number,
    y: number,
  ): { snappedX: number; snappedY: number } {
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
      snappedX: this.normalize(snappedX),
      snappedY: this.normalize(snappedY),
    };
  }

  override getChildren() {
    return super.getChildren() as Bubble[];
  }

  private isValidCell(row: number, col: number) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  getCellWidth() {
    return this.cellWidth;
  }

  private normalize(value: number, precision: number = 2) {
    return parseFloat(value.toFixed(precision));
  }
}
