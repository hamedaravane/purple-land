import { BubbleGrid } from '@objects/BubbleGrid.ts';
import { Bubble } from '@objects/Bubble.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';
import { Aimer } from '@objects/Aimer.ts';

export class BubbleManager {
  private readonly scene: Phaser.Scene;
  private readonly bubbleGrid: BubbleGrid;
  private aimer: Aimer;
  private shootingBubble: Bubble;
  private overlapCollider: Phaser.Physics.Arcade.Collider;

  constructor(scene: Phaser.Scene, rows: number, cols: number) {
    this.scene = scene;
    this.bubbleGrid = new BubbleGrid(scene, rows, cols);
    this.scene.add.existing(this.bubbleGrid);
  }

  createGrid(): void {
    this.bubbleGrid.createGrid();
  }

  spawnNewShootingBubble(): void {
    this.shootingBubble = new Bubble(
      this.scene,
      this.scene.scale.width / 2,
      this.scene.scale.height - 100,
      this.bubbleGrid.getCellWidth(),
      'shooting',
      'bubbles',
      getBubbleColor(),
    );

    this.aimer = new Aimer(this.scene, this.shootingBubble);

    this.overlapCollider = this.scene.physics.add.overlap(
      this.shootingBubble,
      this.bubbleGrid.getChildren() as Phaser.GameObjects.GameObject[],
      (object1, object2) => {
        const shooting = object1 as Bubble;
        const target = object2 as Bubble;
        if (!shooting || !target) return;

        (shooting.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

        const { snappedX, snappedY } = this.bubbleGrid.getNearestGridPosition(
          shooting.x,
          shooting.y,
        );
        shooting.snapTo(snappedX, snappedY);

        shooting.gridCoordinates = this.bubbleGrid.getCoordsByPosition(
          snappedX,
          snappedY,
        );
        this.bubbleGrid.addBubbleToGrid(shooting);
        this.bubbleGrid.popConnectedBubbles(shooting);

        this.overlapCollider.destroy();

        this.aimer.destroy();
        this.spawnNewShootingBubble();
      },
      undefined,
      this,
    );
  }
}
