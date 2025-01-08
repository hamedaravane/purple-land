import Phaser from 'phaser';
import { TapInputSystem } from '../systems/TapInputSystem';
import { BubbleCluster } from '@domain/bubbles/aggregates/BubbleCluster.ts';
import { BubbleCollisionService } from '@domain/bubbles/services/BubbleCollisionService.ts';
import { ClusterPopService } from '@domain/bubbles/services/ClusterPopService.ts';
import { ClusterConnectivityService } from '@domain/bubbles/services/ClusterConnectivityService.ts';
import { HexBubbleArrangementService } from '@domain/bubbles/services/HexBubbleArrangementService.ts';
import { ShootingService } from '@domain/shooting/services/ShootingService.ts';
import { TrajectoryCalculator } from '@domain/shooting/services/TrajectoryCalculator.ts';
import { Score } from '@domain/scoring/aggregates/Score.ts';
import { ScoringRulesService } from '@domain/scoring/services/ScoringRulesService.ts';
import { TapShootBubbleUseCase } from '@application/usecases/TapShootBubbleUseCase.ts';
import { Bubble } from '@domain/bubbles/entities/Bubble.ts';

export class MainScene extends Phaser.Scene {
  private bubbleCluster: BubbleCluster;
  private score: Score;
  private tapShootUseCase: TapShootBubbleUseCase;
  private inputSystem: TapInputSystem;
  private shooterBubble: Bubble;
  private shooterGraphics: Phaser.GameObjects.Graphics;
  private dashedLine: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    // 1) domain + arrangement
    this.bubbleCluster = new BubbleCluster();
    const arrangement = new HexBubbleArrangementService();
    arrangement.arrange(this.bubbleCluster, {
      rows: 5,
      cols: 8,
      bubbleRadius: 20,
      colors: ['red', 'blue', 'green', 'yellow', 'purple'],
    });

    // 2) place the shooter bubble at bottom
    this.shooterBubble = new Bubble('shooter', 'red', { x: 400, y: 550 });
    // no need to add to bubbleCluster, it's separate until it collides

    // 3) set up domain services
    const collision = new BubbleCollisionService();
    const pop = new ClusterPopService();
    const connectivity = new ClusterConnectivityService();
    const shooting = new ShootingService();
    this.score = new Score();
    const scoring = new ScoringRulesService(this.score);
    const trajectory = new TrajectoryCalculator();

    // 4) create the use case
    this.tapShootUseCase = new TapShootBubbleUseCase(
      shooting,
      collision,
      pop,
      connectivity,
      this.bubbleCluster,
      scoring,
      trajectory,
      20,
      10,
    );

    // 5) setup input
    this.dashedLine = this.add.graphics();
    this.inputSystem = new TapInputSystem(
      this,
      (endPos) => {
        // onTapRelease -> shoot
        this.dashedLine.clear();
        this.tapShootUseCase.execute(this.shooterBubble.position, endPos);
      },
      (start, end) => {
        // onLineDraw -> draw dashed line
        this.drawDashedLine(start, end);
      },
    );
    this.inputSystem.setup();

    // 6) draw the bubbleCluster
    this.drawCluster();

    // 7) draw the shooter
    this.shooterGraphics = this.add.graphics();
    this.drawShooter();

    // 8) show score
    const txt = this.add.text(10, 10, `Score: ${this.score.value}`, {
      color: '#fff',
      fontSize: '16px',
    });
    this.time.addEvent({
      delay: 300,
      loop: true,
      callback: () => {
        txt.setText(`Score: ${this.score.value}`);
      },
    });
  }

  update() {}

  private drawCluster() {
    const bubbles = this.bubbleCluster.getBubbles();
    for (const b of bubbles) {
      const gfx = this.add.graphics();
      gfx.lineStyle(2, this.colorToHex(b.color), 1.0);
      gfx.strokeCircle(b.position.x, b.position.y, 20);
      gfx.fillStyle(this.colorToHex(b.color), 0.3);
      gfx.fillCircle(b.position.x, b.position.y, 20);
    }
  }

  private drawShooter() {
    this.shooterGraphics.clear();
    this.shooterGraphics.fillStyle(
      this.colorToHex(this.shooterBubble.color),
      1.0,
    );
    this.shooterGraphics.fillCircle(
      this.shooterBubble.position.x,
      this.shooterBubble.position.y,
      20,
    );
  }

  private drawDashedLine(
    start: { x: number; y: number },
    end: { x: number; y: number },
  ) {
    this.dashedLine.clear();
    this.dashedLine.lineStyle(
      2,
      this.colorToHex(this.shooterBubble.color),
      1.0,
    );

    const dashLen = 8;
    const gapLen = 5;

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const angle = Math.atan2(dy, dx);

    let currentX = start.x;
    let currentY = start.y;
    let remaining = dist;

    this.dashedLine.beginPath();
    while (remaining > 0) {
      const seg = Math.min(dashLen, remaining);
      const nextX = currentX + Math.cos(angle) * seg;
      const nextY = currentY + Math.sin(angle) * seg;

      this.dashedLine.moveTo(currentX, currentY);
      this.dashedLine.lineTo(nextX, nextY);
      this.dashedLine.strokePath();

      currentX = nextX + Math.cos(angle) * gapLen;
      currentY = nextY + Math.sin(angle) * gapLen;
      remaining -= dashLen + gapLen;
    }
    this.dashedLine.closePath();
  }

  private colorToHex(c: string): number {
    switch (c) {
      case 'red':
        return 0xff0000;
      case 'blue':
        return 0x0000ff;
      case 'green':
        return 0x00ff00;
      case 'yellow':
        return 0xffff00;
      case 'purple':
        return 0xff00ff;
      default:
        return 0xffffff;
    }
  }
}
