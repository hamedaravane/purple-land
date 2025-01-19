import { Bubble } from '@objects/Bubble';
import { getBubbleColor } from '@utils/ColorUtils';
import { ColorObj } from '@constants/BubbleColors';

export class BubbleCluster {
  private grid: (Bubble | null)[][];
  private readonly bubbleWidth: number;
  private readonly bubbleHeight: number;
  private readonly bubblesGroup: Phaser.GameObjects.Group;

  constructor(
    private scene: Phaser.Scene,
    private cols: number,
    private rows: number,
    private spriteKey: string,
    bubbleWidth: number,
  ) {
    this.bubbleWidth = bubbleWidth;
    this.bubbleHeight = bubbleWidth * 0.866;
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    this.bubblesGroup = this.scene.add.group();

    this.createInitialGrid();
  }

  /** Generate the initial grid of static bubbles */
  private createInitialGrid() {
    const radius = this.bubbleWidth / 2;

    for (let row = 0; row < this.rows; row++) {
      const isOddRow = row % 2 === 1;
      const offsetX = isOddRow ? radius : 0;

      for (let col = 0; col < this.cols - (isOddRow ? 1 : 0); col++) {
        const x = radius + col * this.bubbleWidth + offsetX;
        const y = radius + row * this.bubbleHeight;

        const bubble = new Bubble(
          this.scene,
          x,
          y,
          this.bubbleWidth,
          'static',
          this.spriteKey,
          getBubbleColor(),
        );

        this.addBubbleToGrid(bubble, row, col);
      }
    }
  }

  /** Add a bubble to the cluster */
  public addBubble(x: number, y: number, color: ColorObj): Bubble | null {
    const { row, col } = this.findClosestGridPosition(x, y);

    if (this.isPositionOccupied(row, col)) {
      return null;
    }

    const bubbleX = this.calculateBubbleX(col, row);
    const bubbleY = this.calculateBubbleY(row);

    const bubble = new Bubble(
      this.scene,
      bubbleX,
      bubbleY,
      this.bubbleWidth,
      'static',
      this.spriteKey,
      color,
    );

    this.addBubbleToGrid(bubble, row, col);
    return bubble;
  }

  /** Handle collision of a bubble with the cluster */
  public handleCollision(shootingBubble: Bubble) {
    const { x, y, color } = shootingBubble;
    const newBubble = this.addBubble(x, y, color);

    if (newBubble) {
      shootingBubble.destroy();
    }
  }

  /** Get all bubbles in the cluster */
  public getBubbles(): Bubble[] {
    return this.bubblesGroup.getChildren() as Bubble[];
  }

  /** Add a bubble to the grid and group */
  private addBubbleToGrid(bubble: Bubble, row: number, col: number) {
    this.grid[row][col] = bubble;
    this.bubblesGroup.add(bubble);
  }

  /** Find the closest grid position for a given coordinate */
  private findClosestGridPosition(x: number, y: number) {
    const radius = this.bubbleWidth / 2;
    const row = Math.round((y - radius) / this.bubbleHeight);
    const col = Math.round(
      (x - radius - (row % 2 === 1 ? radius : 0)) / this.bubbleWidth,
    );

    return { row, col };
  }

  /** Check if a grid position is occupied */
  private isPositionOccupied(row: number, col: number): boolean {
    return this.grid[row]?.[col] !== null;
  }

  /** Calculate the X coordinate for a grid cell */
  private calculateBubbleX(col: number, row: number): number {
    const radius = this.bubbleWidth / 2;
    const offsetX = row % 2 === 1 ? radius : 0;
    return radius + col * this.bubbleWidth + offsetX;
  }

  /** Calculate the Y coordinate for a grid cell */
  private calculateBubbleY(row: number): number {
    const radius = this.bubbleWidth / 2;
    return radius + row * this.bubbleHeight;
  }

  /** Remove a bubble from the grid */
  public removeBubble(bubble: Bubble) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col] === bubble) {
          this.grid[row][col] = null;
          this.bubblesGroup.remove(bubble);
          bubble.destroy();
          return;
        }
      }
    }
  }

  /** Clear all bubbles */
  public clearCluster() {
    this.getBubbles().forEach((bubble) => bubble.destroy());
    this.grid = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(null),
    );
  }
}
