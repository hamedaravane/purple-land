import { getRandomBubbleColor } from '@utils/ColorUtils';
import { Bubble } from '@objects/Bubble';

export class StaticBubbles extends Phaser.GameObjects.Group {
  constructor(
    scene: Phaser.Scene,
    private radius: number,
    private row: number,
    private col: number,
  ) {
    super(scene);
    this.generateGrid();
  }

  private generateGrid(): void {
    const grid: Bubble[][] = [];

    for (let i = 1; i < this.row; i++) {
      grid[i] = [];
      const isOffset = i % 2 === 1;

      for (let j = 0; isOffset ? j < this.col : j < this.col - 1; j++) {
        const bubble = this.createBubble(i, j, isOffset);
        grid[i][j] = bubble;
        this.linkNeighbors(bubble, i, j, grid);
      }
    }
  }

  private createBubble(
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

    this.scene.physics.add.existing(bubble);
    this.scene.add.existing(bubble);
    this.add(bubble);

    return bubble;
  }

  private linkNeighbors(
    bubble: Bubble,
    rowIndex: number,
    colIndex: number,
    grid: Bubble[][],
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

      if (grid[neighborRow]?.[neighborCol] instanceof Bubble) {
        const neighbor = grid[neighborRow][neighborCol];
        bubble.addNeighbor(neighbor);
        neighbor.addNeighbor(bubble);
      }
    });
  }
}
