import { Bubble } from '@objects/Bubble';
import { Aimer } from '@objects/Aimer.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';
import { NEIGHBOR_OFFSETS, SQRT3_OVER_2 } from '@constants';

export class BubbleManager {
  scene: Phaser.Scene;
  bubblesGroup: Phaser.GameObjects.Group;
  shootingBubble: Bubble;
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
  bubbleRadius: number;
  private readonly grid: (Bubble | null)[][];

  constructor(scene: Phaser.Scene, rows: number, cols: number) {
    this.scene = scene;
    this.bubblesGroup = this.scene.add.group();
    this.rows = rows;
    this.cols = cols;
    this.cellWidth = this.scene.scale.width / cols;
    this.bubbleRadius = this.cellWidth / 2;
    this.cellHeight = this.cellWidth * SQRT3_OVER_2;
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  }

  private get bubblesGroupChildren() {
    return this.bubblesGroup.getChildren() as Bubble[];
  }

  createGrid() {
    for (let row = 0; row < this.rows; row++) {
      const isEvenRow = row % 2 === 0;
      const maxCols = this.cols - (isEvenRow ? 1 : 0);
      for (let col = 0; col < maxCols; col++) {
        const position = this.getPositionByCoords(col, row);
        const bubble = new Bubble(
          this.scene,
          position.x,
          position.y,
          this.cellWidth,
          'static',
          'bubbles',
          getBubbleColor(),
        );
        bubble.gridCoordinates = { col, row };
        this.grid[row][col] = bubble;
        this.bubblesGroup.add(bubble);
      }
    }
  }

  popConnectedBubbles(startBubble: Bubble) {
    const connected = this.findConnectedSameColor(startBubble);
    connected.forEach((b) => {
      console.log(`bubble name: ${b.name} and in: ${b.gridCoordinates}`);
    });
    if (connected.length >= 3) {
      connected.forEach((b) => this.removeBubble(b));
    }
  }

  removeBubble(bubble: Bubble) {
    this.bubblesGroup.remove(bubble, false, false);
    const { row, col } = bubble.gridCoordinates;
    if (this.grid[row] && this.grid[row][col] === bubble) {
      this.grid[row][col] = null;
    }
    bubble.destroy();
  }

  spawnShootingBubble() {
    this.shootingBubble = new Bubble(
      this.scene,
      this.scene.scale.width / 2,
      this.scene.scale.height - 100,
      this.cellWidth,
      'shooting',
      'bubbles',
      { label: 'cyan', color: 0x00f697 },
    );
    this.shootingBubble.name = 'shooting';

    // Create your aimer or any additional logic here
    new Aimer(this.scene, this.shootingBubble);

    // Check collision/overlap with existing bubbles
    this.checkOverlapForBubbleGroup();
  }

  /**
   * Fix is here: we also place the bubble into the `grid` array
   * so BFS/DFS can find it.
   */
  addExistingBubble(bubble: Bubble) {
    this.bubblesGroup.add(bubble);
    const { row, col } = bubble.gridCoordinates;
    this.grid[row][col] = bubble;
    return bubble;
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

  private isValidCell(row: number, col: number) {
    return (
      row >= 0 &&
      row < this.grid.length &&
      col >= 0 &&
      col < this.grid[row].length
    );
  }

  private getNearestGridPosition(
    x: number,
    y: number,
  ): { x: number; y: number } {
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

  private checkOverlapForBubbleGroup() {
    this.bubblesGroupChildren.forEach((targetBubble) => {
      this.addOverlap(targetBubble);
    });
  }

  private addOverlap(targetBubble: Bubble) {
    return this.scene.physics.add.overlap(
      this.shootingBubble,
      targetBubble,
      () => {
        (this.shootingBubble.body as Phaser.Physics.Arcade.Body).setVelocity(
          0,
          0,
        );

        const { x: snappedX, y: snappedY } = this.getNearestGridPosition(
          this.shootingBubble.x,
          this.shootingBubble.y,
        );
        this.shootingBubble.snapTo(snappedX, snappedY);

        this.shootingBubble.gridCoordinates = this.getCoordsByPosition(
          snappedX,
          snappedY,
        );

        this.addExistingBubble(this.shootingBubble);

        this.popConnectedBubbles(this.shootingBubble);
      },
      undefined,
      this,
    );
  }

  private getPositionByCoords(
    col: number,
    row: number,
  ): { x: number; y: number } {
    const offsetX = row % 2 === 0 ? this.bubbleRadius : 0;
    return {
      x: this.normalize(this.bubbleRadius + col * this.cellWidth + offsetX),
      y: this.normalize(this.bubbleRadius + row * this.cellHeight),
    };
  }

  private getCoordsByPosition(
    x: number,
    y: number,
  ): { col: number; row: number } {
    let row = Math.floor((y - this.bubbleRadius) / this.cellHeight);
    row = Math.max(0, Math.min(row, this.rows - 1));

    const isEvenRow = row % 2 === 0;
    const offsetX = isEvenRow ? this.bubbleRadius : 0;

    let col = Math.floor((x - this.bubbleRadius - offsetX) / this.cellWidth);
    col = Math.max(0, Math.min(col, this.cols - 1));

    return { col, row };
  }

  private normalize(value: number, precision: number = 2) {
    return parseFloat(value.toFixed(precision));
  }
}
