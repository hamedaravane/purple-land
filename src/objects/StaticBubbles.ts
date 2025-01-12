import { getRandomBubbleColor } from '@utils/ColorUtils.ts';
import { Bubble } from '@objects/Bubble.ts';

export class StaticBubbles extends Phaser.GameObjects.Group {
  public readonly scene: Phaser.Scene;
  constructor(scene: Phaser.Scene, radius: number, row: number, col: number) {
    super(scene);
    this.scene = scene;
    this.createHexGrid(radius, row, col);
  }

  createHexGrid(radius: number, row: number, col: number) {
    for (let i = 1; i < row; i++) {
      let isOffset = i % 2 === 1;
      for (let j = 0; isOffset ? j < col : j < col - 1; j++) {
        let position = {
          x: isOffset ? radius + j * radius * 2 : radius * 2 + j * radius * 2,
          y: i * radius * Math.sqrt(3),
        };
        let color = getRandomBubbleColor();
        const bubble = new Bubble(
          this.scene,
          position.x,
          position.y,
          radius * 2,
          'static',
          color,
        );
        this.scene.physics.add.existing(bubble);
        this.scene.add.existing<Bubble>(bubble);
        this.add(bubble);
      }
    }
  }
}
