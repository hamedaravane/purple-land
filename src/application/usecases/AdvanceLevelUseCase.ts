import { BubbleCluster } from '@domain/bubbles/aggregates/BubbleCluster.ts';
import { ProgressionService } from '@domain/level/services/ProgressionService.ts';
import { Level } from '@domain/level/aggregates/Level.ts';

export class AdvanceLevelUseCase {
  constructor(
    private level: Level,
    private progressionService: ProgressionService,
    private bubbleCluster: BubbleCluster,
  ) {}

  execute(): void {
    // Example: check if cluster is empty => advance level
    if (this.bubbleCluster.getBubbles().length === 0) {
      this.progressionService.handleBubblesCleared(); // internally calls level.advanceLevel()
      console.log(
        `Advanced to Level ${this.level.number}, bubbleCount: ${this.level.difficulty.bubbleCount}, descentRate: ${this.level.difficulty.descentRate}`,
      );
      // Possibly re-generate a new cluster, or reset something else
    }
  }
}
