import { Bubble } from '@objects/Bubble.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';

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
    let bubbleNumber = 0;

    for (let row = 0; row < rows; row++) {
      const isOddRow = row % 2 === 0;
      const offsetX = isOddRow ? bubbleRadius : 0;

      for (let col = 0; col < cols - (isOddRow ? 1 : 0); col++) {
        bubbleNumber++;
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
        console.log(`Bubble ${bubbleNumber} position: ${x}, ${y}`);
        this.bubblesGroup.add(bubble);
        this.grid[row][col] = bubble;
      }
    }
  }

  /** Check for collision with a shooting bubble */
  handleBubbleCollision(shootingBubble: Bubble, targetBubble: Bubble) {
    if (targetBubble.color.color === shootingBubble.color.color) {
      targetBubble.destroy();
      shootingBubble.destroy();
    } else {
      const { x, y } = this.findNearestPositionForTargetBubble(targetBubble);
      (shootingBubble.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
      shootingBubble.snapTo(x, y);
      shootingBubble.bubbleType = 'static';
      this.addBubble(shootingBubble);
    }
  }

  /** Find the nearest position for the shooting bubble around the target bubble */
  findNearestPositionForTargetBubble(targetBubble: Bubble): {
    x: number;
    y: number;
  } {
    const neighbors = this.getPotentialNeighborPositions(
      targetBubble.x,
      targetBubble.y,
    );

    for (const { x, y } of neighbors) {
      if (this.isPositionEmpty(x, y)) {
        console.log('Nearest empty position found', { x, y });
        return { x, y };
      }
    }

    console.warn('No empty position found, snapping to target bubble');
    return { x: targetBubble.x, y: targetBubble.y };
  }

  /** Get potential neighbor positions around a bubble in a hexagonal grid */
  getPotentialNeighborPositions(
    x: number,
    y: number,
  ): { x: number; y: number }[] {
    const bubbleRadius = this.bubbleWidth / 2;
    const rowHeight = this.bubbleWidth * 0.866;

    return [
      { x: x + this.bubbleWidth, y },
      { x: x - this.bubbleWidth, y },
      { x: x + bubbleRadius, y: y + rowHeight },
      { x: x - bubbleRadius, y: y + rowHeight },
      { x: x + bubbleRadius, y: y - rowHeight },
      { x: x - bubbleRadius, y: y - rowHeight },
    ];
  }

  /** Check if a grid position is empty */
  isPositionEmpty(x: number, y: number): boolean {
    const bubbles = this.getBubbles();
    return !bubbles.some((bubble) => bubble.x === x && bubble.y === y);
  }

  /** Add a bubble to the grid */
  addBubble(bubble: Bubble) {
    this.bubblesGroup.add(bubble);
  }

  /** Get all the bubbles in the cluster */
  getBubbles(): Bubble[] {
    return this.bubblesGroup.getChildren() as Bubble[];
  }
}
