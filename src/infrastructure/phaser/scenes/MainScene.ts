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
import { HexBubbleArrangementService } from '@domain/bubbles/services/HexBubbleArrangementService.ts';

export class MainScene extends Phaser.Scene {
  private tapInputSystem: TapInputSystem;
  private bubbleGraphics: Phaser.GameObjects.Graphics[] = [];
  private bubbleCluster: BubbleCluster;
  private score: Score;

  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    this.bubbleCluster = new BubbleCluster();
    this.score = new Score();
    const collisionService = new BubbleCollisionService();
    const popService = new ClusterPopService();
    const scoreService = new ScoringRulesService(this.score);
    const trajectoryCalc = new TrajectoryCalculator();
    const shootingService = new ShootingService(trajectoryCalc);

    const hexService = new HexBubbleArrangementService();
    hexService.arrange(this.bubbleCluster, {
      rows: 5,
      cols: 8,
      bubbleRadius: 20,
      colors: [0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0xff00ff],
    });
    this.drawHexBubbles();

    // 2) "Shooting bubble" at bottom
    const shootingBubble = new Bubble('shooter', 0xff0000, {
      x: this.scale.width / 2,
      y: 550,
    });

    // 3) The new use case
    const tapShootUseCase = new TapShootBubbleUseCase(
      shootingService,
      collisionService,
      popService,
      this.bubbleCluster,
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
    const scoreText = this.add.text(10, 10, `Score: ${this.score.value}`, {
      fontSize: '16px',
    });
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        scoreText.setText(`Score: ${this.score.value}`);
      },
    });

    // 6) (Optional) place some "bubbles" up top
    // ...
  }

  private drawHexBubbles(): void {
    // Clear old
    this.bubbleGraphics.forEach((g) => g.destroy());
    this.bubbleGraphics = [];

    // Re-draw
    for (const bubble of this.bubbleCluster.getBubbles()) {
      const gfx = this.add.graphics();
      gfx.lineStyle(2, bubble.color, 1.0);
      gfx.fillStyle(bubble.color, 0.7);
      gfx.fillCircle(bubble.position.x, bubble.position.y, 20);

      this.bubbleGraphics.push(gfx);
    }
  }
}
