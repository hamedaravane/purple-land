import { Bubble } from '../entities/Bubble';
import { BubbleCluster } from '../aggregates/BubbleCluster';

interface HexArrangementOptions {
  rows: number;
  cols: number;
  bubbleRadius: number;
  colors: number[]; // or a function that picks colors
}

/**
 * Service that arranges bubbles in a hex/honeycomb pattern
 * and adds them to a BubbleCluster.
 */
export class HexBubbleArrangementService {
  arrange(cluster: BubbleCluster, options: HexArrangementOptions): void {
    const { rows, cols, bubbleRadius, colors } = options;

    // The vertical distance between rows in a hex layout
    const rowHeight = bubbleRadius * Math.sqrt(3);
    // The horizontal distance between bubbles in the same row
    const colWidth = bubbleRadius * 2;

    let bubbleIdCounter = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Horizontal offset for even or odd row
        const xOffset = r % 2 === 0 ? 0 : bubbleRadius;

        const x = c * colWidth + bubbleRadius + xOffset + 100;
        const y = r * rowHeight + bubbleRadius + 50;

        // pick a color
        const color = colors[bubbleIdCounter % colors.length];
        const bubble = new Bubble(
          `hex-bubble-${bubbleIdCounter}`,
          color,
          { x, y },
          false,
        );
        cluster.addBubble(bubble);
        bubbleIdCounter++;
      }
    }
  }
}
