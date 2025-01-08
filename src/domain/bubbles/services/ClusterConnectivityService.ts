import { BubbleCluster } from '../aggregates/BubbleCluster';
import { Bubble } from '../entities/Bubble';
import { isHexAdjacent } from '@shared/utils/AdjacencyCheck.ts';

export class ClusterConnectivityService {
  /**
   * Removes bubbles that are no longer connected to the top row.
   * The "top" row is r=0 in this example, or any bubble whose y <= some threshold.
   */
  handleDisconnected(cluster: BubbleCluster, bubbleRadius: number): void {
    const allBubbles = cluster.getBubbles().filter((b) => !b.isPopped);

    // Find all top-row bubbles
    const topBubbles = allBubbles.filter((b) => b.rowIndex === 0);

    // BFS or DFS from top-row to find connected
    const visited = new Set<Bubble>();
    const stack: Bubble[] = [...topBubbles];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (!visited.has(current)) {
        visited.add(current);
        // get neighbors
        const neighbors = allBubbles.filter((other) => !other.isPopped);
        for (const n of neighbors) {
          if (!visited.has(n)) {
            const dx = current.position.x - n.position.x;
            const dy = current.position.y - n.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (isHexAdjacent(dist, bubbleRadius)) {
              stack.push(n);
            }
          }
        }
      }
    }

    // Bubbles not in visited should fall
    // For simplicity, we just pop them or remove them
    for (const b of allBubbles) {
      if (!visited.has(b)) {
        b.pop(); // or cluster.removeBubble(b.id);
      }
    }
  }
}
