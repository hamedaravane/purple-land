import Phaser from 'phaser';
import { Bubble } from './Bubble';
import { NEIGHBOR_OFFSETS, SQRT3_OVER_2 } from '@constants';
import { getBubbleColor } from '@utils';

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

    const availableHeight = scene.scale.height - 100 - this.cellHeight;
    const maxRows = Math.floor(availableHeight / this.cellHeight);
    this.grid = Array.from({ length: maxRows }, () => Array(cols).fill(null));
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

  addBubble(bubble: Bubble) {
    const { row, col } = bubble.gridCoordinates;
    this.grid[row][col] = bubble;
    this.add(bubble);
  }

  private removeBubble(bubble: Bubble) {
    const { row, col } = bubble.gridCoordinates;
    if (this.grid[row] && this.grid[row][col] === bubble) {
      this.grid[row][col] = null;
    }
    this.remove(bubble, true, true);
  }

  popConnectedBubbles(startBubble: Bubble) {
    const connected = this.findConnectedSameColor(startBubble);
    if (connected.length >= 3) {
      connected.forEach((b) => this.removeBubble(b));
    }
  }

  /**
   * @description Finds all connected bubbles with the same color as the given start bubble.
   *
   * using **Breadth-First Search (BFS):**
   * an algorithm for traversing or searching tree or graph data structures.
   * It starts at a specific node (the start bubble in this case) and explores all of its neighbors
   * at the current depth before moving on to the next depth level. This ensures that nodes closer
   * to the start node are visited first.
   *
   * @param {Bubble} startBubble - The starting bubble for the search.
   * @returns {Bubble[]} An array of all connected bubbles with the same color.
   * @author Hamed Arghavan
   */
  private findConnectedSameColor(startBubble: Bubble): Bubble[] {
    const visited = new Set<Bubble>();
    const queue: Bubble[] = [];
    queue.push(startBubble);
    visited.add(startBubble);

    while (queue.length > 0) {
      const current = queue.shift()!;
      visited.add(current);

      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (
          !visited.has(neighbor) &&
          neighbor.color.label === startBubble.color.label
        ) {
          queue.push(neighbor);
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

  snapBubbleToGrid(bubble: Bubble) {
    const {
      snappedX: x,
      snappedY: y,
      row,
      col,
    } = this.getNearestGridPosition(bubble.x, bubble.y);
    bubble.setPosition(x, y);
    bubble.gridCoordinates = { row, col };
    this.addBubble(bubble);
  }

  private getNearestGridPosition(
    x: number,
    y: number,
  ): { snappedX: number; snappedY: number; row: number; col: number } {
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
      row,
      col,
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
