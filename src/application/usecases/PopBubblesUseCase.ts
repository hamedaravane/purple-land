import { ClusterPopService } from '@domain/bubbles/services/ClusterPopService.ts';
import { BubbleCluster } from '@domain/bubbles/aggregates/BubbleCluster.ts';
import { Bubble } from '@domain/bubbles/entities/Bubble.ts';
import { ScoringRulesService } from '@domain/scoring/services/ScoringRulesService.ts';

export class PopBubblesUseCase {
  constructor(
    private clusterPopService: ClusterPopService,
    private bubbleCluster: BubbleCluster,
    private scoringService: ScoringRulesService,
  ) {}

  execute(
    originBubble: Bubble,
    adjacencyCheck: (a: Bubble, b: Bubble) => boolean,
  ): void {
    if (!originBubble.isPopped) {
      const popped = this.clusterPopService.popConnectedBubbles(
        this.bubbleCluster,
        originBubble,
        adjacencyCheck,
      );
      if (popped.length > 0) {
        this.scoringService.applyBubblePoppedScoring(popped.length);
      }
      // Optionally clear or move cluster afterward
      // this.bubbleCluster.clearPoppedBubbles();
    }
  }
}
