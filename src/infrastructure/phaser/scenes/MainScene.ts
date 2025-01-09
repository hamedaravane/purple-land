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

  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    this.bubbleCluster = new BubbleCluster();
    this.shooterBubble = new Bubble('shooter', 'red', { x: 300, y: 700 }, 15);

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

    // input system
    this.inputSystem = new TapInputSystem(this, this.shooterBubble.position);
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
}
