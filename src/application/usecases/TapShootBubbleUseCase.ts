import { BubbleCluster } from '@domain/bubbles/aggregates/BubbleCluster.ts';
import { BubbleCollisionService } from '@domain/bubbles/services/BubbleCollisionService.ts';
import { ClusterPopService } from '@domain/bubbles/services/ClusterPopService.ts';
import { ScoringRulesService } from '@domain/scoring/services/ScoringRulesService.ts';
import { ShootingService } from '@domain/shooting/services/ShootingService.ts';
import { TrajectoryCalculator } from '@domain/shooting/services/TrajectoryCalculator.ts';
import { Bubble } from '@domain/bubbles/entities/Bubble.ts';
import { adjacencyCheck } from '@shared/utils/AdjacencyCheck.ts';

/**
 * Use Case: Tap to shoot a "shooting bubble" from its current position
 * toward the tapped position. Visual line drawing is handled in Infrastructure.
 */
export class TapShootBubbleUseCase {
  constructor(
    private shootingService: ShootingService,
    private collisionService: BubbleCollisionService,
    private clusterPopService: ClusterPopService,
    private bubbleCluster: BubbleCluster,
    private scoringService: ScoringRulesService,
    private trajectoryCalculator: TrajectoryCalculator,
    private shootingBubble: Bubble, // or something that references the "current bubble"
  ) {}

  execute(
    tapPosition: { x: number; y: number },
    shotRadius: number,
    bubbleRadius: number,
  ): void {
    // 1) Calculate direction from shooting bubble to tap
    const direction = this.trajectoryCalculator.calculateDirection(
      this.shootingBubble.position,
      tapPosition,
    );
    const speed = 400; // For example

    // 2) Fire a shot from the bubble's position, with that direction+speed
    const shot = this.shootingService.fireShot(this.shootingBubble.position, {
      x: this.shootingBubble.position.x + direction.x * 10,
      y: this.shootingBubble.position.y + direction.y * 10,
    });
    // Override the shot's direction & speed if needed:
    shot.direction = direction;
    shot.speed = speed;

    // 3) Check collision
    // TODO: in a real game loop, you'd do this over time, but for simplicity, let's do an immediate check
    const collided = this.collisionService.detectCollision(
      this.bubbleCluster,
      shot.position,
      shotRadius,
      bubbleRadius,
    );
    if (collided) {
      const popped = this.clusterPopService.popConnectedBubbles(
        this.bubbleCluster,
        collided,
        () => adjacencyCheck(shot.position, { x: 500, y: 0 }), // TODO: I should write another utility function for this
      );
      if (popped.length > 0) {
        this.scoringService.applyBubblePoppedScoring(popped.length);
      }
      this.shootingService.deactivateShot(shot.id);
    }

    // 4) Optionally remove or reset the shootingBubble from the domain
    this.shootingBubble.isPopped = true;
    // Or mark it as used, or generate a new bubble, etc.
  }
}
