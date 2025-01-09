import { Bubble } from '../entities/Bubble';
import { BubbleCluster } from '../aggregates/BubbleCluster';

export class ClusterPopService {
  popMatchingColor(cluster: BubbleCluster, collided: Bubble): Bubble[] {
    if (collided.isPopped) return [];

    const sameColor = collided.color;
    const toPop = new Set<Bubble>();
    const stack: Bubble[] = [collided];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (!toPop.has(current)) {
        toPop.add(current);
        // find neighbors of same color
        for (const neighbor of cluster.getBubbles()) {
          if (!neighbor.isPopped && neighbor.color === sameColor) {
            // a simple distance check
            const dx = current.position.x - neighbor.position.x;
            const dy = current.position.y - neighbor.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= (current.radius + neighbor.radius) * 1.2) {
              stack.push(neighbor);
            }
          }
        }
      }
    }
    // pop them
    for (const b of toPop) {
      b.pop();
    }
    return Array.from(toPop);
  }
}
