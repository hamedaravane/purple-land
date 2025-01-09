import { ShootingService } from '@domain/shooting/services/ShootingService.ts';
import { BubbleCollisionService } from '@domain/bubbles/services/BubbleCollisionService.ts';
import { ClusterPopService } from '@domain/bubbles/services/ClusterPopService.ts';
import { BubbleCluster } from '@domain/bubbles/aggregates/BubbleCluster.ts';
import { TrajectoryService } from '@domain/shooting/services/TrajectoryService.ts';
import { Bubble } from '@domain/bubbles/entities/Bubble.ts';
import { PositionOrDirection } from '@shared/types';

export class TapShootBubbleUseCase {
  constructor(
    private shootingService: ShootingService,
    private collisionService: BubbleCollisionService,
    private popService: ClusterPopService,
    private bubbleCluster: BubbleCluster,
    private trajectoryService: TrajectoryService,
    private shooterBubble: Bubble,
    private bubbleRadius: number,
    private shotRadius: number,
  ) {}

  execute(touchPos: PositionOrDirection): void {
    // 1) Calculate direction
    const direction = this.trajectoryService.calculateDirection(
      this.shooterBubble.position,
      touchPos,
    );
    // TODO: for now we use a constant value for speed but in future we can increase it based on level
    const speed = 400;

    const shot = this.shootingService.fireShot(
      this.shooterBubble.position,
      direction,
      speed,
      this.shotRadius,
    );

    // TODO: for now, as a simple form we immediately detect collision
    const collided = this.collisionService.detectCollision(
      { x: shot.position.x, y: shot.position.y },
      shot.radius,
      this.bubbleCluster,
    );
    if (collided) {
      /**
       *  TODO: this snippet is simplified and incomplete
       *   we return popped from popMatchingColor() to illustrate that the service can supply
       *   a list of bubbles that were actually popped (e.g., for scoring or animations).
       *   In this minimal snippet, we don’t yet use popped directly—this is often the next step in a real game:
       *   Scoring: You might apply score increments based on popped.length.
       *   Animations/Particles: You might spawn visual effects for each popped bubble.
       *   Event Publishing: You might publish a BubblesPoppedEvent(popped) so the UI or other systems can react.
       **/
      const popped = this.popService.popMatchingColor(
        this.bubbleCluster,
        collided,
      );
      console.log(popped);
      // remove bubble from cluster if popped
      this.bubbleCluster.removePoppedBubbles();
    } else {
      // If no collision, we consider the shot bubble becomes a new bubble in cluster
      const newBubble = new Bubble(
        `bubble-${Date.now()}`,
        this.shooterBubble.color,
        { x: shot.position.x, y: shot.position.y },
        this.bubbleRadius,
      );
      this.bubbleCluster.addBubble(newBubble);
    }

    // 4) Deactivate shot
    this.shootingService.deactivateShot(shot.id);

    // 5) Generate a new "shooterBubble" or reload (not shown)
  }
}
