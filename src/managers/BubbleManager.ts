import { BubbleGrid } from '@objects/BubbleGrid.ts';
import { Bubble } from '@objects/Bubble.ts';
import { Aimer } from '@objects/Aimer.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';

export class BubbleManager {
  private readonly scene: Phaser.Scene;
  private readonly bubbleGrid: BubbleGrid;
  private aimer: Aimer;
  private shootingBubble: Bubble;

  constructor(scene: Phaser.Scene, rows: number, cols: number) {
    this.scene = scene;
    this.bubbleGrid = new BubbleGrid(scene, rows, cols);
    this.scene.add.existing(this.bubbleGrid);
  }

  createGrid() {
    this.bubbleGrid.createGrid();
  }

  spawnNewShootingBubble() {
    this.aimer?.destroy();

    this.shootingBubble = new Bubble(
      this.scene,
      this.scene.scale.width / 2,
      this.scene.scale.height - 100,
      this.bubbleGrid.getCellWidth(),
      getBubbleColor(),
      true,
    );

    this.aimer = new Aimer(this.scene, this.shootingBubble);
  }

  checkCollision() {
    this.bubbleGrid.getChildren().forEach((targetBubble) => {
      if (this.isOverlap(this.shootingBubble, targetBubble)) {
        (this.shootingBubble.body as Phaser.Physics.Arcade.Body).setVelocity(
          0,
          0,
        );
        this.bubbleGrid.snapBubbleToGrid(this.shootingBubble);
        this.bubbleGrid.popConnectedBubbles(this.shootingBubble);
        this.spawnNewShootingBubble();
      }
    });
  }

  isOverlap(shootingBubble: Bubble, targetBubble: Bubble) {
    const dx = shootingBubble.x - targetBubble.x;
    const dy = shootingBubble.y - targetBubble.y;
    const distanceSquared = dx * dx + dy * dy;
    return distanceSquared <= shootingBubble.diameter * targetBubble.diameter;
  }
}
