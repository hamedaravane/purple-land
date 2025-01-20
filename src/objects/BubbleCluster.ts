import { Bubble } from '@objects/Bubble.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';

export class BubbleCluster {
  private readonly scene: Phaser.Scene;
  private bubblesGroup: Phaser.GameObjects.Group;
  private bubbleMap: Map<string, Bubble>;
  private readonly grid: (Bubble | null)[][];
  private readonly bubbleWidth: number;
  private readonly bubbleRadius: number;
  private readonly rowHeight: number;

  constructor(
    scene: Phaser.Scene,
    cols: number,
    rows: number,
    spriteKey: string,
    bubbleWidth: number,
  ) {
    this.scene = scene;
    this.bubbleWidth = bubbleWidth;
    this.bubbleRadius = this.bubbleWidth / 2;
    this.rowHeight = this.bubbleWidth * 0.866;

    this.bubblesGroup = new Phaser.GameObjects.Group(this.scene);
    this.bubbleMap = new Map<string, Bubble>();

    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));

    this.createGrid(cols, rows, spriteKey);
  }

  /**
   * Handle a collision between a shooting bubble and a target bubble.
   */
  public handleBubbleCollision(
    shootingBubble: Bubble,
    targetBubble: Bubble,
  ): void {
    if (targetBubble.color.color === shootingBubble.color.color) {
      this.removeBubble(targetBubble);
      this.removeBubble(shootingBubble);
      return;
    }

    (shootingBubble.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    const { x: snappedX, y: snappedY } = this.getNearestGridPosition(
      shootingBubble.x,
      shootingBubble.y,
    );

    shootingBubble.snapTo(snappedX, snappedY);

    shootingBubble.bubbleType = 'static';
    this.addBubble(shootingBubble);
  }

  private getNearestGridPosition(
    x: number,
    y: number,
  ): { x: number; y: number } {
    // 1) Approximate which row we're on.
    //    In createGrid, you do: y = bubbleRadius + row * rowHeight
    //    => row ≈ (y - bubbleRadius) / rowHeight
    let row = Math.round((y - this.bubbleRadius) / this.rowHeight);
    if (row < 0) row = 0;
    // (Optionally clamp row to maxRows - 1 if needed)

    const isEvenRow = row % 2 === 0;

    // 2) Invert the x-position depending on row parity:
    let col: number;
    if (isEvenRow) {
      // even row => x = bubbleWidth * (col + 1)
      // => col = (x / bubbleWidth) - 1
      col = Math.round(x / this.bubbleWidth - 1);
    } else {
      // odd row => x = bubbleWidth * (col + 0.5)
      // => col = (x / bubbleWidth) - 0.5
      col = Math.round(x / this.bubbleWidth - 0.5);
    }

    // Prevent negative columns (or clamp to max columns if you wish)
    if (col < 0) col = 0;

    // 3) Re-snap x using the exact same formula from createGrid
    const snappedX = isEvenRow
      ? this.bubbleWidth * (col + 1) // even row
      : this.bubbleWidth * (col + 0.5); // odd row

    // 4) Re-snap y
    const snappedY = this.bubbleRadius + row * this.rowHeight;

    return {
      x: this.normalize(snappedX),
      y: this.normalize(snappedY),
    };
  }

  /** Add a bubble to the cluster and track its position in the map */
  public addBubble(bubble: Bubble): void {
    const normalizedX = this.normalize(bubble.x);
    const normalizedY = this.normalize(bubble.y);

    this.bubblesGroup.add(bubble);
    this.bubbleMap.set(`${normalizedX},${normalizedY}`, bubble);
  }

  /** Remove a bubble from the cluster, and destroy the game object */
  public removeBubble(bubble: Bubble): void {
    const normalizedX = this.normalize(bubble.x);
    const normalizedY = this.normalize(bubble.y);

    this.bubblesGroup.remove(bubble, false, false);
    this.bubbleMap.delete(`${normalizedX},${normalizedY}`);
    bubble.destroy();
  }

  /**
   * Get all current bubbles as an array.
   */
  public getBubbles(): Bubble[] {
    return this.bubblesGroup.getChildren() as Bubble[];
  }

  private createGrid(cols: number, rows: number, spriteKey: string): void {
    let bubbleNumber = 0;

    for (let row = 0; row < rows; row++) {
      const isEvenRow = row % 2 === 0;
      const offsetX = isEvenRow ? this.bubbleRadius : 0;
      const maxCols = cols - (isEvenRow ? 1 : 0);

      for (let col = 0; col < maxCols; col++) {
        bubbleNumber++;
        const x = this.normalize(
          this.bubbleRadius + col * this.bubbleWidth + offsetX,
        );
        const y = this.normalize(this.bubbleRadius + row * this.rowHeight);

        const bubble = new Bubble(
          this.scene,
          x,
          y,
          this.bubbleWidth,
          'static',
          spriteKey,
          getBubbleColor(),
        );
        console.log(`Bubble ${bubbleNumber} position: ${x}, ${y}`);

        this.bubblesGroup.add(bubble);
        this.bubbleMap.set(`${x},${y}`, bubble);

        this.grid[row][col] = bubble;
      }
    }
  }

  /** Normalize a number to a fixed precision */
  private normalize(value: number, precision: number = 2): number {
    return parseFloat(value.toFixed(precision));
  }
}
