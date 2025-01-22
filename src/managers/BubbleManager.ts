import { Bubble } from '@objects/Bubble';
import { Aimer } from '@objects/Aimer.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';
import { SQRT3_OVER_2 } from '@constants';

export class BubbleManager {
  scene: Phaser.Scene;
  bubblesGroup: Phaser.GameObjects.Group;
  shootingBubble: Bubble;
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
  bubbleRadius: number;

  constructor(scene: Phaser.Scene, rows: number, cols: number) {
    this.scene = scene;
    this.bubblesGroup = this.scene.add.group();
    this.rows = rows;
    this.cols = cols;
    this.cellWidth = this.scene.scale.width / cols;
    this.bubbleRadius = this.cellWidth / 2;
    this.cellHeight = this.cellWidth * SQRT3_OVER_2;
  }

  private get bubblesGroupChildren() {
    return this.bubblesGroup.getChildren() as Bubble[];
  }

  createGrid() {
    for (let row = 0; row < this.rows; row++) {
      const isEvenRow = row % 2 === 0;
      const maxCols = this.cols - (isEvenRow ? 1 : 0);
      for (let col = 0; col < maxCols; col++) {
        const position = this.getPosition(col, row);
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
        this.updateNeighbors(bubble);
        this.bubblesGroup.add(bubble);
      }
    }
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
    new Aimer(this.scene, this.shootingBubble);
    this.checkOverlapForBubbleGroup();
  }

  addExistingBubble(bubble: Bubble) {
    this.bubblesGroup.add(bubble);
    return bubble;
  }

  popConnectedBubbles(startBubble: Bubble) {
    const connected = this.findConnectedSameColor(startBubble);
    if (connected.length >= 3) {
      connected.forEach((b: Bubble) => this.removeBubble(b));
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

  private getNeighbors(bubble: Bubble): Bubble[] {
    if (!bubble.gridCoordinates) {
      throw new Error('Bubble does not have grid coordinates');
    }
    return bubble.neighbors;
  }

  private getNeighborOffsets(row: number): [number, number][] {
    const baseOffsets: [number, number][] = [
      [-1, 0], // Top-right
      [-1, -1], // Top-left
      [0, -1], // Left
      [0, 1], // Right
      [1, 0], // Bottom-right
      [1, -1], // Bottom-left
    ];

    // For odd rows, adjust specific offsets
    if (row % 2 !== 0) {
      return baseOffsets.map(([dRow, dCol]) =>
        dRow === -1 || dRow === 1 ? [dRow, dCol + 1] : [dRow, dCol],
      );
    }

    return baseOffsets;
  }

  private removeBubble(bubble: Bubble): void {
    if (!bubble.gridCoordinates) {
      return;
    }

    // Remove from neighbors' lists
    for (const neighbor of bubble.neighbors) {
      neighbor.neighbors = neighbor.neighbors.filter((n) => n !== bubble);
    }

    bubble.neighbors = []; // Clear its own neighbors
    bubble.gridCoordinates = null; // Clear grid coordinates
  }

  private updateNeighbors(bubble: Bubble): void {
    if (!bubble.gridCoordinates) {
      throw new Error('Bubble does not have grid coordinates');
    }

    const { row, col } = bubble.gridCoordinates;
    const offsets = this.getNeighborOffsets(row);

    bubble.neighbors = []; // Clear existing neighbors
    for (const [dRow, dCol] of offsets) {
      const nRow = row + dRow;
      const nCol = col + dCol;

      // Find the neighbor bubble (use your own method to locate bubbles in the game state)
      const neighbor = this.findBubbleByCoordinates(nRow, nCol);
      if (neighbor) {
        bubble.neighbors.push(neighbor);

        // Also update the neighbor's neighbors list
        if (!neighbor.neighbors.includes(bubble)) {
          neighbor.neighbors.push(bubble);
        }
      }
    }
  }

  findBubbleByCoordinates(row: number, col: number) {
    return this.bubblesGroupChildren.find(
      (bubble) =>
        bubble.gridCoordinates &&
        bubble.gridCoordinates.row === row &&
        bubble.gridCoordinates.col === col,
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
      this.onOverlap,
      undefined,
      this,
    );
  }

  private onOverlap: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = () => {
    (this.shootingBubble.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    const { x: snappedX, y: snappedY } = this.getNearestGridPosition(
      this.shootingBubble.x,
      this.shootingBubble.y,
    );
    this.shootingBubble.snapTo(snappedX, snappedY);
    this.addExistingBubble(this.shootingBubble);
    this.updateNeighbors(this.shootingBubble);
  };

  private getPosition(col: number, row: number): { x: number; y: number } {
    const offsetX = row % 2 === 0 ? this.bubbleRadius : 0;
    return {
      x: this.normalize(this.bubbleRadius + col * this.cellWidth + offsetX),
      y: this.normalize(this.bubbleRadius + row * this.cellHeight),
    };
  }

  private normalize(value: number, precision: number = 2): number {
    return parseFloat(value.toFixed(precision));
  }
}
