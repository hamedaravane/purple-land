import { ShootingService } from '@domain/shooting/services/ShootingService.ts';
import { BubbleCollisionService } from '@domain/bubbles/services/BubbleCollisionService.ts';
import { ClusterPopService } from '@domain/bubbles/services/ClusterPopService.ts';
import { BubbleCluster } from '@domain/bubbles/aggregates/BubbleCluster.ts';
import { ScoringRulesService } from '@domain/scoring/services/ScoringRulesService.ts';
import { ClusterConnectivityService } from '@domain/bubbles/services/ClusterConnectivityService.ts';
import { TrajectoryCalculator } from '@domain/shooting/services/TrajectoryCalculator.ts';

export class TapShootBubbleUseCase {
  constructor(
    private shootingService: ShootingService,
    private collisionService: BubbleCollisionService,
    private clusterPopService: ClusterPopService,
    private connectivityService: ClusterConnectivityService,
    private bubbleCluster: BubbleCluster,
    private scoringService: ScoringRulesService,
    private trajectoryCalculator: TrajectoryCalculator,
    private bubbleRadius: number,
    private shotRadius: number,
  ) {}

  execute(
    shooterPosition: { x: number; y: number },
    tapPosition: { x: number; y: number },
  ): void {
    const direction = this.trajectoryCalculator.calculateDirection(
      shooterPosition,
      tapPosition,
    );
    const speed = this.trajectoryCalculator.calculateSpeed(
      shooterPosition,
      tapPosition,
    );

    // Fire a shot
    const shot = this.shootingService.fireShot(shooterPosition, {
      x: shooterPosition.x + direction.x * 10,
      y: shooterPosition.y + direction.y * 10,
    });
    shot.direction = direction;
    shot.speed = speed;

    // We'll do an immediate collision check (for demonstration).
    const collided = this.collisionService.detectCollision(
      this.bubbleCluster,
      shot.position,
      this.shotRadius,
      this.bubbleRadius,
    );
    if (collided) {
      // pop connected
      const popped = this.clusterPopService.popConnectedBubbles(
        this.bubbleCluster,
        collided,
        this.bubbleRadius,
      );
      if (popped.length > 0) {
        this.scoringService.applyBubblePoppedScoring(popped.length);
        // remove disconnected
        this.connectivityService.handleDisconnected(
          this.bubbleCluster,
          this.bubbleRadius,
        );
      }
      this.shootingService.deactivateShot(shot.id);
    }
  }
}
