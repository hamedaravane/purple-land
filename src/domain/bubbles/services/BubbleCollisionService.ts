import { Bubble } from '../entities/Bubble';
import { BubbleCluster } from '../aggregates/BubbleCluster';
import { PositionOrDirection } from '@shared/types';

export class BubbleCollisionService {
  detectCollision(
    shotPosition: PositionOrDirection,
    shotRadius: number,
    cluster: BubbleCluster,
  ): Bubble | null {
    for (const bubble of cluster.getBubbles()) {
      if (bubble.isPopped) continue;
      const distance = this.calculateDistance(bubble.position, shotPosition);
      if (distance <= bubble.radius + shotRadius) {
        return bubble;
      }
    }
    return null;
  }

  /**
   * Calculates the Euclidean distance between two positions.
   */
  private calculateDistance(
    a: PositionOrDirection,
    b: PositionOrDirection,
  ): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
