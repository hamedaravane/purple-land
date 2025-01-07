import { Bubble, Position } from '../entities/Bubble';

/**
 * Manages a collection of Bubble entities as a single unit (Aggregate Root).
 */
export class BubbleCluster {
  private bubbles: Bubble[] = [];

  /**
   * Constructs a new BubbleCluster instance.
   * @param initialBubbles - An optional array of initial Bubble instances.
   */
  constructor(initialBubbles: Bubble[] = []) {
    this.bubbles = initialBubbles;
  }

  /**
   * Adds a new bubble to the cluster.
   * @param bubble - The Bubble instance to add.
   */
  addBubble(bubble: Bubble): void {
    this.bubbles.push(bubble);
    console.log(`Added Bubble ${bubble.id} to the cluster.`);
  }

  /**
   * Removes a bubble from the cluster by its ID.
   * @param bubbleId - The ID of the bubble to remove.
   */
  removeBubble(bubbleId: string): void {
    const index = this.bubbles.findIndex((b) => b.id === bubbleId);
    if (index !== -1) {
      this.bubbles.splice(index, 1);
      console.log(`Removed Bubble ${bubbleId} from the cluster.`);
    } else {
      console.warn(`Bubble ${bubbleId} not found in the cluster.`);
    }
  }

  /**
   * Retrieves all bubbles in the cluster.
   */
  getBubbles(): Bubble[] {
    return this.bubbles;
  }

  /**
   * Finds a bubble by its position.
   * @param position - The position to search for.
   * @returns The Bubble at that position or null if not found.
   */
  findBubbleByPosition(position: Position): Bubble | null {
    return (
      this.bubbles.find(
        (b) =>
          b.position.x === position.x &&
          b.position.y === position.y &&
          !b.isPopped,
      ) || null
    );
  }

  /**
   * Moves the entire cluster down by a given number of pixels/units.
   */
  moveClusterDown(deltaY: number): void {
    this.bubbles.forEach((bubble) => {
      const newY = bubble.position.y + deltaY;
      bubble.updatePosition({ x: bubble.position.x, y: newY });
    });
    console.log(`Moved the cluster down by ${deltaY} units.`);
  }

  /**
   * Clears all popped bubbles from the cluster.
   */
  clearPoppedBubbles(): void {
    this.bubbles = this.bubbles.filter((b) => !b.isPopped);
    console.log(`Cleared popped bubbles from the cluster.`);
  }
}
