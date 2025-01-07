import { Bubble } from '../entities/Bubble';
import { BubbleCluster } from '../aggregates/BubbleCluster';

export class BubbleCollisionService {
  /**
   * Detects if a shot has collided with any bubble in the cluster.
   * @param cluster - The BubbleCluster to check against.
   * @param shotPosition - The current position of the shot.
   * @param shotRadius - The radius of the shot.
   * @param bubbleRadius - The radius of each bubble.
   * @returns The Bubble instance that was hit, or null if no collision occurred.
   */
  detectCollision(
    cluster: BubbleCluster,
    shotPosition: { x: number; y: number },
    shotRadius: number,
    bubbleRadius: number,
  ): Bubble | null {
    for (const bubble of cluster.getBubbles()) {
      if (bubble.isPopped) continue;

      const distance = this.calculateDistance(shotPosition, bubble.position);
      if (distance <= shotRadius + bubbleRadius) {
        console.log(`Collision detected with Bubble ${bubble.id}.`);
        return bubble;
      }
    }
    return null;
  }

  /**
   * Calculates the Euclidean distance between two positions.
   */
  private calculateDistance(
    a: { x: number; y: number },
    b: { x: number; y: number },
  ): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
