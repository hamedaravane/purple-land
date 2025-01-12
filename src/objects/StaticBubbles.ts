import { getRandomBubbleColor } from '@utils/ColorUtils.ts';
import { Bubble } from '@objects/Bubble.ts';

export class StaticBubbles extends Phaser.GameObjects.Group {
  public readonly scene: Phaser.Scene;
  constructor(scene: Phaser.Scene, radius: number, row: number, col: number) {
    super(scene);
    this.scene = scene;
    this.createHexGrid(radius, row, col);
  }

  createHexGrid(radius: number, row: number, col: number) {
    const grid: Bubble[][] = [];

    for (let i = 1; i < row; i++) {
      grid[i] = [];
      const isOffset = i % 2 === 1;

      for (let j = 0; isOffset ? j < col : j < col - 1; j++) {
        const position = {
          x: isOffset ? radius + j * radius * 2 : radius * 2 + j * radius * 2,
          y: i * radius * Math.sqrt(3),
        };

        const color = getRandomBubbleColor();
        const bubble = new Bubble(
          this.scene,
          position.x,
          position.y,
          radius * 2,
          'static',
          color,
        );

        this.scene.physics.add.existing(bubble);
        this.scene.add.existing<Bubble>(bubble);
        this.add(bubble);
        grid[i][j] = bubble;

        this.assignNeighbors(bubble, i, j, grid);
      }
    }
  }

  assignNeighbors(bubble: Bubble, row: number, col: number, grid: Bubble[][]) {
    const directions = [
      { row: 0, col: -1 },
      { row: 0, col: 1 },
      { row: -1, col: 0 },
      { row: -1, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: -1 },
    ];

    const isOffset = row % 2 === 1;

    for (const { row: dRow, col: dCol } of directions) {
      const neighborRow = row + dRow;
      const neighborCol = col + dCol + (isOffset && dRow !== 0 ? 1 : 0);

      if (
        grid[neighborRow] &&
        grid[neighborRow][neighborCol] &&
        grid[neighborRow][neighborCol] instanceof Bubble
      ) {
        const neighbor = grid[neighborRow][neighborCol];
        bubble.addNeighbor(neighbor);
        neighbor.addNeighbor(bubble);
      }
    }
  }
}
