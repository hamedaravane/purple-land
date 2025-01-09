import Phaser from 'phaser';
import { TapInputSystem } from '../systems/TapInputSystem';
import { BubbleCluster } from '@domain/bubbles/aggregates/BubbleCluster.ts';
import { BubbleCollisionService } from '@domain/bubbles/services/BubbleCollisionService.ts';
import { ClusterPopService } from '@domain/bubbles/services/ClusterPopService.ts';
import { ShootingService } from '@domain/shooting/services/ShootingService.ts';
import { TrajectoryService } from '@domain/shooting/services/TrajectoryService.ts';
import { TapShootBubbleUseCase } from '@application/usecases/TapShootBubbleUseCase.ts';
import { Bubble } from '@domain/bubbles/entities/Bubble.ts';

export class MainScene extends Phaser.Scene {
  private bubbleCluster: BubbleCluster;
  private tapShootUseCase: TapShootBubbleUseCase;
  private inputSystem: TapInputSystem;
  private shooterBubble: Bubble;
  private dashLineGfx: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    this.bubbleCluster = new BubbleCluster();
    this.shooterBubble = new Bubble('shooter', 'red', { x: 400, y: 50 }, 20);

    const shootingService = new ShootingService();
    const collisionService = new BubbleCollisionService();
    const popService = new ClusterPopService();
    const trajectory = new TrajectoryService();

    // build the use case
    this.tapShootUseCase = new TapShootBubbleUseCase(
      shootingService,
      collisionService,
      popService,
      this.bubbleCluster,
      trajectory,
      this.shooterBubble,
      20, // bubbleRadius
      10, // shotRadius
    );

    // a dashed line for visual feedback
    this.dashLineGfx = this.add.graphics();

    // input system
    this.inputSystem = new TapInputSystem(
      this,
      (endPos) => {
        this.dashLineGfx.clear();
        this.tapShootUseCase.execute(endPos);
      },
      (start, end) => {
        // onLineDraw -> draw dashed line
        this.drawDashedLine(start, end);
      },
    );
    this.inputSystem.setup();

    this.drawShooter();
  }

  private drawShooter(): void {
    const g = this.add.graphics();
    g.fillStyle(0xff0000, 1.0);
    g.fillCircle(
      this.shooterBubble.position.x,
      this.shooterBubble.position.y,
      this.shooterBubble.radius,
    );
  }

  private drawDashedLine(
    a: { x: number; y: number },
    b: { x: number; y: number },
  ): void {
    this.dashLineGfx.clear();
    this.dashLineGfx.lineStyle(2, 0xffffff, 1.0);

    const dashLen = 8;
    const gapLen = 4;

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    let currX = a.x;
    let currY = a.y;
    let remaining = dist;

    while (remaining > 0) {
      const segment = Math.min(dashLen, remaining);
      const nextX = currX + Math.cos(angle) * segment;
      const nextY = currY + Math.sin(angle) * segment;

      this.dashLineGfx.beginPath();
      this.dashLineGfx.moveTo(currX, currY);
      this.dashLineGfx.lineTo(nextX, nextY);
      this.dashLineGfx.strokePath();
      this.dashLineGfx.closePath();

      remaining -= dashLen + gapLen;
      currX = nextX + Math.cos(angle) * gapLen;
      currY = nextY + Math.sin(angle) * gapLen;
    }
  }
}
