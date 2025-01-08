import { Bubble } from '../entities/Bubble';
import { BubbleCluster } from '../aggregates/BubbleCluster';

interface HexArrangementOptions {
  rows: number;
  cols: number;
  bubbleRadius: number;
  colors: string[];
  startX?: number;
  startY?: number;
}

export class HexBubbleArrangementService {
  arrange(cluster: BubbleCluster, options: HexArrangementOptions): void {
    const {
      rows,
      cols,
      bubbleRadius,
      colors,
      startX = 100,
      startY = 50,
    } = options;

    const rowHeight = bubbleRadius * Math.sqrt(3);
    const colWidth = bubbleRadius * 2;

    let bubbleIdCounter = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const offsetX = r % 2 === 1 ? bubbleRadius : 0;
        const x = startX + c * colWidth + offsetX + bubbleRadius;
        const y = startY + r * rowHeight + bubbleRadius;
        const color = colors[bubbleIdCounter % colors.length];

        const bubble = new Bubble(
          `bubble-${bubbleIdCounter}`,
          color,
          { x, y },
          false,
          r,
          c,
        );
        cluster.addBubble(bubble);
        bubbleIdCounter++;
      }
    }
  }
}
