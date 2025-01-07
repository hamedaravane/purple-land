import Phaser from 'phaser';
import { ShootBubbleUseCase } from '@application/usecases/ShootBubbleUseCase.ts';
import { ShootingService } from '@domain/shooting/services/ShootingService.ts';
import { BubbleCollisionService } from '@domain/bubbles/services/BubbleCollisionService.ts';
import { ClusterPopService } from '@domain/bubbles/services/ClusterPopService.ts';
import { BubbleCluster } from '@domain/bubbles/aggregates/BubbleCluster.ts';
import { ScoringRulesService } from '@domain/scoring/services/ScoringRulesService.ts';
import { TrajectoryCalculator } from '@domain/shooting/services/TrajectoryCalculator.ts';
import { Score } from '@domain/scoring/aggregates/Score.ts';

export class MainScene extends Phaser.Scene {
  private shootBubbleUseCase!: ShootBubbleUseCase;

  private pointerDownPos: { x: number; y: number } | null = null;

  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    // Instantiate domain objects & services (for demonstration)
    const trajectoryCalc = new TrajectoryCalculator();
    const shootingService = new ShootingService(trajectoryCalc);
    const collisionService = new BubbleCollisionService();
    const clusterPopService = new ClusterPopService();
    const bubbleCluster = new BubbleCluster(); // or pass initial bubbles
    const score = new Score();
    const scoringService = new ScoringRulesService(score);

    // Application Use Case
    this.shootBubbleUseCase = new ShootBubbleUseCase(
      shootingService,
      collisionService,
      clusterPopService,
      bubbleCluster,
      scoringService,
    );

    // Basic pointer handling
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.pointerDownPos = { x: pointer.x, y: pointer.y };
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.pointerDownPos) {
        this.shootBubbleUseCase.execute(
          this.pointerDownPos,
          { x: pointer.x, y: pointer.y },
          10, // shotRadius
          15, // bubbleRadius
          adjacencyCheck,
        );
        this.pointerDownPos = null;
      }
    });

    // Example text display of score
    const scoreText = this.add.text(10, 10, `Score: ${score.value}`, {
      font: '18px Arial',
      color: '#ffffff',
    });

    // Update UI in the scene's update loop or via events
    this.events.on('update-score', () => {
      scoreText.setText(`Score: ${score.value}`);
    });
  }
}
