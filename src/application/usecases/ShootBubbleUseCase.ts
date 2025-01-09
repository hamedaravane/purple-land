import { ShootingService } from '@domain/shooting/services/ShootingService.ts';
import { BubbleCluster } from '@domain/bubbles/aggregates/BubbleCluster.ts';
import { BubbleCollisionService } from '@domain/bubbles/services/BubbleCollisionService.ts';
import { ClusterPopService } from '@domain/bubbles/services/ClusterPopService.ts';
import { ScoringRulesService } from '@domain/scoring/services/ScoringRulesService.ts';
import { PositionOrDirection } from '@shared/types';

export class ShootBubbleUseCase {
  constructor(
    private shootingService: ShootingService,
    private collisionService: BubbleCollisionService,
    private clusterPopService: ClusterPopService,
    private bubbleCluster: BubbleCluster,
    private scoringService: ScoringRulesService,
  ) {}

  execute(
    swipeStart: PositionOrDirection,
    swipeEnd: PositionOrDirection,
    shotRadius: number,
    bubbleRadius: number,
    adjacencyCheck: (a: any, b: any) => boolean,
  ): void {
    // 1. Fire the shot
    const shot = this.shootingService.fireShot(swipeStart, swipeEnd);

    // 2. (In a real game loop, you'd update the shot over time.)
    // For simplicity, assume immediate collision check:
    const collidedBubble = this.collisionService.detectCollision(
      this.bubbleCluster,
      shot.position,
      shotRadius,
      bubbleRadius,
    );

    if (collidedBubble) {
      // 3. Pop connected bubbles (same color, for instance)
      const popped = this.clusterPopService.popConnectedBubbles(
        this.bubbleCluster,
        collidedBubble,
        adjacencyCheck,
      );

      // 4. Apply scoring
      if (popped.length > 0) {
        this.scoringService.applyBubblePoppedScoring(popped.length);
      }

      // 5. Deactivate the shot now that it has collided
      this.shootingService.deactivateShot(shot.id);
    }
  }
}
