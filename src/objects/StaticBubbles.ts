import { getRandomBubbleColor } from '@utils/ColorUtils.ts';
import { Bubble } from '@objects/Bubble.ts';

export class StaticBubbles {
  public readonly scene: Phaser.Scene;
  constructor(scene: Phaser.Scene, radius: number, row: number, col: number) {
    this.scene = scene;
    this.createHexGrid(radius, row, col);
  }

  createHexGrid(radius: number, row: number, col: number) {
    for (let i = 1; i < row; i++) {
      let isOffset = i % 2 === 1;
      for (let j = 0; isOffset ? j < col : j < col - 1; j++) {
        let position = {
          x: isOffset ? radius + j * radius * 2 : radius * 2 + j * radius * 2,
          y: i * radius * 1.8,
        };
        let color = getRandomBubbleColor();
        const bubble = new Bubble(
          this.scene,
          position.x,
          position.y,
          'static',
          color,
        );
        this.scene.physics.add.existing(bubble);
        const body = bubble.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setVelocity(0, 0);
        this.scene.add.existing(bubble);
      }
    }
  }
}
