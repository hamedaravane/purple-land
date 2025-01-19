import { Bubble } from '@objects/Bubble.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';
import { ColorObj } from '@constants/BubbleColors.ts';

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
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(undefined));
    this.createGrid(scene, cols, rows, spriteKey);
  }

  /** Create the grid and initialize bubbles */
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

  /** Check for collision with a shooting bubble */
  handleBubbleCollision(
    scene: Phaser.Scene,
    bubble: Bubble,
    spriteKey: string,
  ) {
    const { row, col } = this.findClosestGridPosition(bubble.x, bubble.y);
    if (
      row < 0 ||
      row >= this.grid.length ||
      col < 0 ||
      col >= this.grid[0].length
    ) {
      bubble.pop();
      return;
    }

    const targetBubble = this.grid[row][col];
    if (targetBubble && targetBubble.color === bubble.color) {
      bubble.pop();
    } else {
      this.addBubble(scene, bubble.x, bubble.y, spriteKey, bubble.color);
    }
  }

  /** Add a bubble to the grid */
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

  /** Find the grid position closest to the bubble's current position */
  private findClosestGridPosition(x: number, y: number) {
    const bubbleRadius = this.bubbleWidth / 2;
    const row = Math.round((y - bubbleRadius) / (bubbleRadius * Math.sqrt(3)));
    const col = Math.round(
      (x - bubbleRadius - (row % 2 === 0 ? bubbleRadius : 0)) /
        this.bubbleWidth,
    );
    return { row, col };
  }

  /** Check if a position in the grid is occupied */
  private isPositionOccupied(row: number, col: number): boolean {
    if (
      row < 0 ||
      row >= this.grid.length ||
      col < 0 ||
      col >= this.grid[0].length
    ) {
      return true;
    }
    return this.grid[row][col] !== undefined;
  }

  /** Calculate the X position for a bubble in the grid */
  private calculateBubbleX(col: number, row: number) {
    const bubbleRadius = this.bubbleWidth / 2;
    const offsetX = row % 2 === 0 ? bubbleRadius : 0;
    return bubbleRadius + col * this.bubbleWidth + offsetX;
  }

  /** Calculate the Y position for a bubble in the grid */
  private calculateBubbleY(row: number) {
    const bubbleRadius = this.bubbleWidth / 2;
    return bubbleRadius + row * (this.bubbleWidth * 0.866);
  }

  /** Get all the bubbles in the cluster */
  getBubbles(): Bubble[] {
    return this.bubblesGroup.getChildren() as Bubble[];
  }
}
