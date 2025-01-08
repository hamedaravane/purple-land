import { Bubble } from '../entities/Bubble';
import { BubbleCluster } from '../aggregates/BubbleCluster';

export class BubbleCollisionService {
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
