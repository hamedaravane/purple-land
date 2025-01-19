import { Bubble } from '@objects/Bubble.ts';
import { getBubbleColor } from '@utils/ColorUtils';
import { ColorObj } from '@constants/BubbleColors';

export class BubbleCluster {
  private bubblesGroup: Phaser.GameObjects.Group;
  private readonly grid: (Bubble | null)[][];
  private readonly bubbleWidth: number;

  constructor(
    scene: Phaser.Scene,
    cols: number,
    rows: number,
    spriteKey: string,
    bubbleWidth: number,
  ) {
    this.bubbleWidth = bubbleWidth;
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    this.createGrid(scene, cols, rows, spriteKey);
  }

  createGrid(
    scene: Phaser.Scene,
    cols: number,
    rows: number,
    spriteKey: string,
  ) {
    this.bubblesGroup = new Phaser.GameObjects.Group(scene);
    const bubbleRadius = this.bubbleWidth / 2;
    const rowHeight = this.bubbleWidth * 0.866;

    for (let row = 0; row < rows; row++) {
      const isOddRow = row % 2 === 0;
      const offsetX = isOddRow ? bubbleRadius : 0;

      for (let col = 0; col < cols - (isOddRow ? 1 : 0); col++) {
        const x = bubbleRadius + col * this.bubbleWidth + offsetX;
        const y = bubbleRadius + row * rowHeight;

        const bubble = new Bubble(
          scene,
          x,
          y,
          this.bubbleWidth,
          'static',
          spriteKey,
          getBubbleColor(),
        );
        this.bubblesGroup.add(bubble);
        this.grid[row][col] = bubble;
      }
    }
  }

  addBubble(
    scene: Phaser.Scene,
    x: number,
    y: number,
    spriteKey: string,
    bubbleColor: ColorObj,
  ) {
    const { row, col } = this.findClosestGridPosition(x, y);

    if (!this.isPositionOccupied(row, col)) {
      const bubbleX = this.calculateBubbleX(col, row);
      const bubbleY = this.calculateBubbleY(row);

      const bubble = new Bubble(
        scene,
        bubbleX,
        bubbleY,
        this.bubbleWidth,
        'static',
        spriteKey,
        bubbleColor,
      );

      this.bubblesGroup.add(bubble);
      this.grid[row][col] = bubble;
    }
  }

  private findClosestGridPosition(x: number, y: number) {
    const bubbleRadius = this.bubbleWidth / 2;
    const row = Math.round((y - bubbleRadius) / (bubbleRadius * Math.sqrt(3)));
    const col = Math.round(
      (x - bubbleRadius - (row % 2 === 0 ? bubbleRadius : 0)) /
        this.bubbleWidth,
    );
    return { row, col };
  }

  private isPositionOccupied(row: number, col: number) {
    return this.grid[row]?.[col] !== null;
  }

  private calculateBubbleX(col: number, row: number) {
    const bubbleRadius = this.bubbleWidth / 2;
    const offsetX = row % 2 === 0 ? bubbleRadius : 0;
    return bubbleRadius + col * this.bubbleWidth + offsetX;
  }

  private calculateBubbleY(row: number) {
    const bubbleRadius = this.bubbleWidth / 2;
    return bubbleRadius + row * (this.bubbleWidth * 0.866);
  }
}
