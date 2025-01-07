import { Bubble } from '../entities/Bubble';
import { BubbleCluster } from '../aggregates/BubbleCluster';

export class ClusterPopService {
  /**
   * Pops all connected bubbles of the same color starting from a given bubble.
   * Returns an array of popped bubbles.
   *
   * @param cluster - The BubbleCluster aggregate.
   * @param originBubble - The bubble where the popping process begins.
   * @param adjacencyCheck - Function that determines adjacency (e.g., direct neighbors).
   */
  popConnectedBubbles(
    cluster: BubbleCluster,
    originBubble: Bubble,
    adjacencyCheck: (a: Bubble, b: Bubble) => boolean,
  ): Bubble[] {
    if (originBubble.isPopped) return [];

    // BFS or DFS to find all connected bubbles of the same color
    const queue: Bubble[] = [originBubble];
    const visited = new Set<Bubble>();
    const sameColor = originBubble.color;

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (!visited.has(current)) {
        visited.add(current);

        // Check for same color
        if (current.color === sameColor && !current.isPopped) {
          // Find neighbors in the cluster that are not popped and have the same color
          const neighbors = cluster
            .getBubbles()
            .filter(
              (b) =>
                !b.isPopped &&
                b.color === sameColor &&
                adjacencyCheck(current, b),
            );

          neighbors.forEach((n) => {
            if (!visited.has(n)) {
              queue.push(n);
            }
          });
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
