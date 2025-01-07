import Phaser from "phaser";
import { InputSystem } from "../systems/InputSystem";
import { ShootBubbleUseCase } from '@application/usecases/ShootBubbleUseCase.ts';
import { ShootingService } from '@domain/shooting/services/ShootingService.ts';
import { TrajectoryCalculator } from '@domain/shooting/services/TrajectoryCalculator.ts';
import { BubbleCollisionService } from '@domain/bubbles/services/BubbleCollisionService.ts';
import { ClusterPopService } from '@domain/bubbles/services/ClusterPopService.ts';
import { BubbleCluster } from '@domain/bubbles/aggregates/BubbleCluster.ts';
import { Score } from '@domain/scoring/aggregates/Score.ts';
import { ScoringRulesService } from '@domain/scoring/services/ScoringRulesService.ts';
import { adjacencyCheck } from '@shared/utils/AdjacencyCheck.ts';

/**
 * MainScene draws circles of random colors to represent bubbles
 * (since no bubble.png is available). We'll track them in a simple array.
 */
export class MainScene extends Phaser.Scene {
  private inputSystem!: InputSystem;
  private shootBubbleUseCase!: ShootBubbleUseCase;

  // For demonstration: track circles rendered on screen
  private circleGraphics: Phaser.GameObjects.Graphics[] = [];

  // 5 color palette
  private colorPalette = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];

  constructor() {
    super({ key: "MainScene" });
  }

  create(): void {
    // 1) Create domain objects
    const trajectoryCalc = new TrajectoryCalculator();
    const shootingService = new ShootingService(trajectoryCalc);
    const collisionService = new BubbleCollisionService();
    const clusterPopService = new ClusterPopService();
    const bubbleCluster = new BubbleCluster();
    const score = new Score();
    const scoringService = new ScoringRulesService(score);

    // 2) Create the application use case
    this.shootBubbleUseCase = new ShootBubbleUseCase(
      shootingService,
      collisionService,
      clusterPopService,
      bubbleCluster,
      scoringService
    );

    // 3) Setup input system
    this.inputSystem = new InputSystem(this, (start, end) => {
      // On swipe callback
      this.handleSwipe(start, end, bubbleCluster, score);
    });
    this.inputSystem.setup();

    // 4) Draw some random circles to represent "bubbles" in the cluster
    for (let i = 0; i < 5; i++) {
      const x = 100 + i * 60;
      const y = 200;
      const color = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
      this.drawCircle(x, y, color);
      // You can also add an actual domain bubble to cluster if needed.
      // bubbleCluster.addBubble(...); (Domain-level logic)
    }

    // 5) Simple text for showing the score
    const scoreText = this.add.text(10, 10, `Score: ${score.value}`, {
      fontSize: "16px",
      color: "#ffffff",
    });

    // Example timer to periodically update text
    this.time.addEvent({
      delay: 500,
      callback: () => {
        scoreText.setText(`Score: ${score.value}`);
      },
      loop: true,
    });
  }

  /**
   * Minimal example of using the ShootBubbleUseCase on swipe.
   */
  private handleSwipe(start: { x: number; y: number }, end: { x: number; y: number }, cluster: BubbleCluster, score: Score): void {
    // You can pass bubbleRadius/shotRadius or adjacencyCheck as needed
    // For now, we do a simple example:
    this.shootBubbleUseCase.execute(start, end, 10, 15, adjacencyCheck);

    // Optionally log something
    console.log(`Swipe from (${start.x}, ${start.y}) to (${end.x}, ${end.y}), current score: ${score.value}`);
  }

  /**
   * Draw a circle with a given color, store the graphics object.
   */
  private drawCircle(x: number, y: number, color: number): void {
    const graphics = this.add.graphics({ x: 0, y: 0 });
    graphics.fillStyle(color, 1.0);
    graphics.fillCircle(x, y, 20); // radius 20
    this.circleGraphics.push(graphics);
  }
}