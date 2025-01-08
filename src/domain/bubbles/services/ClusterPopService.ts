/////////////////////////////////////////////////
// domain/bubbles/services/ClusterPopService.ts
/////////////////////////////////////////////////
import { Bubble } from '../entities/Bubble';
import { BubbleCluster } from '../aggregates/BubbleCluster';
import { isHexAdjacent } from '@shared/utils/AdjacencyCheck.ts';

export class ClusterPopService {
  popConnectedBubbles(
    cluster: BubbleCluster,
    originBubble: Bubble,
    bubbleRadius: number,
  ): Bubble[] {
    if (originBubble.isPopped) return [];

    const stack: Bubble[] = [originBubble];
    const visited = new Set<Bubble>();
    const sameColor = originBubble.color;

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (!visited.has(current)) {
        visited.add(current);
        const neighbors = cluster
          .getBubbles()
          .filter((b) => !b.isPopped && b.color === sameColor);
        for (const n of neighbors) {
          if (!visited.has(n)) {
            const dx = current.position.x - n.position.x;
            const dy = current.position.y - n.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // If they're adjacent in a hex sense
            if (isHexAdjacent(dist, bubbleRadius)) {
              stack.push(n);
            }
          }
        }
      }
    }

    // Pop all found bubbles
    for (const bubble of visited) {
      bubble.pop();
    }

    // Return the list of popped bubbles
    return Array.from(visited);
  }
}
