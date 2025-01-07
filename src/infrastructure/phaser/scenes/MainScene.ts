import Phaser from 'phaser';
import { TapInputSystem } from '@infrastructure/phaser/systems/TapInputSystem.ts';
import { BubbleCluster } from '@domain/bubbles/aggregates/BubbleCluster.ts';
import { BubbleCollisionService } from '@domain/bubbles/services/BubbleCollisionService.ts';
import { ClusterPopService } from '@domain/bubbles/services/ClusterPopService.ts';
import { Score } from '@domain/scoring/aggregates/Score.ts';
import { ScoringRulesService } from '@domain/scoring/services/ScoringRulesService.ts';
import { TrajectoryCalculator } from '@domain/shooting/services/TrajectoryCalculator.ts';
import { ShootingService } from '@domain/shooting/services/ShootingService.ts';
import { Bubble } from '@domain/bubbles/entities/Bubble.ts';
import { TapShootBubbleUseCase } from '@application/usecases/TapShootBubbleUseCase.ts';

export class MainScene extends Phaser.Scene {
  private tapInputSystem: TapInputSystem;

  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    const bubbleCluster = new BubbleCluster();
    const collisionService = new BubbleCollisionService();
    const popService = new ClusterPopService();
    const score = new Score();
    const scoreService = new ScoringRulesService(score);
    const trajectoryCalc = new TrajectoryCalculator();
    const shootingService = new ShootingService(trajectoryCalc);

    // 2) "Shooting bubble" at bottom
    const shootingBubble = new Bubble('shooter', 'red', { x: 400, y: 550 });

    // 3) The new use case
    const tapShootUseCase = new TapShootBubbleUseCase(
      shootingService,
      collisionService,
      popService,
      bubbleCluster,
      scoreService,
      trajectoryCalc,
      shootingBubble,
    );

    // 4) Set up the input system
    this.tapInputSystem = new TapInputSystem(
      this,
      shootingBubble,
      tapShootUseCase,
      15,
      10,
    );
    this.tapInputSystem.setup();

    // 5) Draw the "shooter" bubble as a circle
    const shooterCircle = this.add.graphics();
    shooterCircle.fillStyle(0xff0000, 1.0);
    shooterCircle.fillCircle(
      shootingBubble.position.x,
      shootingBubble.position.y,
      15,
    );

    // Simple text UI for score
    const scoreText = this.add.text(10, 10, `Score: ${score.value}`, {
      fontSize: '16px',
    });
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        scoreText.setText(`Score: ${score.value}`);
      },
    });

    // 6) (Optional) place some "bubbles" up top
    // ...
  }
}
