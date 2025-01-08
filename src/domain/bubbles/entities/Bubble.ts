export type Position = {
  x: number;
  y: number;
};

/**
 * Represents a single bubble in the game.
 */
export class Bubble {
  /**
   * Constructs a new Bubble instance.
   * @param id - Unique identifier for the bubble.
   * @param color - Color of the bubble.
   * @param position - Position of the bubble in the grid or screen.
   * @param isPopped
   */
  constructor(
    public readonly id: string,
    public readonly color: number,
    public position: Position,
    public isPopped: boolean = false,
  ) {}

  /**
   * Marks the bubble as popped.
   */
  pop(): void {
    if (!this.isPopped) {
      this.isPopped = true;
      console.log(`Bubble ${this.id} popped!`);
    } else {
      console.warn(`Bubble ${this.id} is already popped.`);
    }
  }

  /**
   * Updates the bubble's position (e.g., when the cluster moves down).
   */
  updatePosition(newPosition: Position): void {
    this.position = newPosition;
    console.log(
      `Bubble ${this.id} moved to (${newPosition.x}, ${newPosition.y}).`,
    );
  }
}
