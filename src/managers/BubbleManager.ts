import { Bubble } from '@objects/Bubble';
import { Aimer } from '@objects/Aimer.ts';

const SQRT3_OVER_2 = 0.86602540378;

export class BubbleManager {
  scene: Phaser.Scene;
  bubblesGroup: Phaser.GameObjects.Group;
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;

  constructor(scene: Phaser.Scene, rows: number, cols: number) {
    this.scene = scene;
    this.bubblesGroup = this.scene.add.group();
    this.rows = rows;
    this.cols = cols;
    this.cellWidth = this.scene.scale.width / cols;
    this.cellHeight = this.cellWidth * SQRT3_OVER_2;
  }

  createGrid() {
    const cellWidth = this.scene.scale.width / this.cols;
    let bubbleNumber = 0;
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        bubbleNumber++;
        const newBubble = new Bubble(
          this.scene,
          this.horizonPositionByCol(col),
          this.verticalPositionByRow(row),
          cellWidth,
          'static',
          'bubbles',
          { label: 'cyan', color: 0x00f697 },
        );
        newBubble.name = `${bubbleNumber}`;
        this.addExistingBubble(newBubble);
      }
    }
  }

  spawnShootingBubble() {
    const shootingBubble = new Bubble(
      this.scene,
      this.scene.scale.width / 2,
      this.scene.scale.height - 100,
      this.cellWidth,
      'shooting',
      'bubbles',
      { label: 'cyan', color: 0x00f697 },
    );
    shootingBubble.name = 'shooting';
    new Aimer(this.scene, shootingBubble);
    this.checkOverlapForBubbleGroup(shootingBubble);
  }

  addExistingBubble(bubble: Bubble) {
    this.bubblesGroup.add(bubble);
    return bubble;
  }

  removeBubble(bubble: Bubble) {
    this.bubblesGroup.remove(bubble, true, true);
  }

  checkOverlapForBubbleGroup(shootingBubble: Bubble) {
    this.bubblesGroupChildren.forEach((targetBubble) => {
      this.addOverlap(shootingBubble, targetBubble);
    });
  }

  private addOverlap(shootingBubble: Bubble, targetBubble: Bubble) {
    this.scene.physics.add.overlap(
      shootingBubble,
      targetBubble,
      this.onOverlap,
      undefined,
      this,
    );
  }

  get bubblesGroupChildren() {
    return this.bubblesGroup.getChildren() as Bubble[];
  }

  private onOverlap: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    shootingBubble,
    targetBubble,
  ) => {
    ((shootingBubble as Bubble).body as Phaser.Physics.Arcade.Body).setVelocity(
      0,
      0,
    );
    console.log(
      (shootingBubble as Bubble).name,
      'an overlap detected!',
      (targetBubble as Bubble).name,
    );
  };

  private horizonPositionByCol(col: number) {
    return this.cellWidth * col + this.cellWidth / 2;
  }

  private verticalPositionByRow(row: number) {
    return this.cellWidth * row + this.cellWidth / 2;
  }
}
