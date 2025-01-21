import { Bubble } from '@objects/Bubble';
import { Aimer } from '@objects/Aimer.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';

const SQRT3_OVER_2 = 0.86602540378;

export class BubbleManager {
  scene: Phaser.Scene;
  bubblesGroup: Phaser.GameObjects.Group;
  shootingBubble: Bubble;
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
  bubbleRadius: number;

  constructor(scene: Phaser.Scene, rows: number, cols: number) {
    this.scene = scene;
    this.bubblesGroup = this.scene.add.group();
    this.rows = rows;
    this.cols = cols;
    this.cellWidth = this.scene.scale.width / cols;
    this.bubbleRadius = this.cellWidth / 2;
    this.cellHeight = this.cellWidth * SQRT3_OVER_2;
  }

  createGrid() {
    let bubbleNumber = 0;
    for (let row = 0; row < this.rows; row++) {
      const isEvenRow = row % 2 === 0;
      const maxCols = this.cols - (isEvenRow ? 1 : 0);
      for (let col = 0; col < maxCols; col++) {
        const position = this.getPosition(col, row);
        bubbleNumber++;
        const bubble = new Bubble(
          this.scene,
          position.x,
          position.y,
          this.cellWidth,
          'static',
          'bubbles',
          getBubbleColor(),
        );

        this.bubblesGroup.add(bubble);
      }
    }
  }

  spawnShootingBubble() {
    this.shootingBubble = new Bubble(
      this.scene,
      this.scene.scale.width / 2,
      this.scene.scale.height - 100,
      this.cellWidth,
      'shooting',
      'bubbles',
      { label: 'cyan', color: 0x00f697 },
    );
    this.shootingBubble.name = 'shooting';
    new Aimer(this.scene, this.shootingBubble);
    this.checkOverlapForBubbleGroup();
  }

  addExistingBubble(bubble: Bubble) {
    this.bubblesGroup.add(bubble);
    return bubble;
  }

  removeBubble(bubble: Bubble) {
    this.bubblesGroup.remove(bubble, true, true);
  }

  checkOverlapForBubbleGroup() {
    this.bubblesGroupChildren.forEach((targetBubble) => {
      this.addOverlap(targetBubble);
    });
  }

  private addOverlap(targetBubble: Bubble) {
    return this.scene.physics.add.overlap(
      this.shootingBubble,
      targetBubble,
      this.onOverlap,
      undefined,
      this,
    );
  }

  get bubblesGroupChildren() {
    return this.bubblesGroup.getChildren() as Bubble[];
  }

  private onOverlap: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = () => {
    (this.shootingBubble.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
  };

  private getPosition(col: number, row: number): { x: number; y: number } {
    const offsetX = row % 2 === 0 ? this.bubbleRadius : 0;
    return {
      x: this.normalize(this.bubbleRadius + col * this.cellWidth + offsetX),
      y: this.normalize(this.bubbleRadius + row * this.cellHeight),
    };
  }

  private normalize(value: number, precision: number = 2): number {
    return parseFloat(value.toFixed(precision));
  }
}
