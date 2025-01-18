import { Bubble } from '@objects/Bubble.ts';
import { ColorObj } from '@constants/BubbleColors.ts';

export class HexTile extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    size: number,
    spriteKey: string,
    bubbleColor: ColorObj,
  ) {
    const height = size * 2;
    const width = size * Math.sqrt(3);
    super(scene, x, y);

    scene.add.existing(this);

    this.width = width;
    this.height = height;

    const vertices = [
      { y: 0, x: width / 2 },
      { y: height / 4, x: 0 },
      { y: (3 * height) / 4, x: 0 },
      { y: height, x: width / 2 },
      { y: (3 * height) / 4, x: width },
      { y: height / 4, x: width },
    ];

    const hexagon = new Phaser.Geom.Polygon(vertices);

    this.debugHexagon(scene, hexagon);

    const bubble = new Bubble(
      scene,
      this.width / 2,
      this.height / 2,
      width,
      'static',
      spriteKey,
      bubbleColor,
    );

    const scaleX = width / bubble.width;
    const scaleY = height / bubble.height;
    const scale = Math.min(scaleX, scaleY);
    bubble.setScale(scale);

    this.add(bubble);
  }

  debugHexagon(scene: Phaser.Scene, hexagon: Phaser.Geom.Polygon) {
    const graphics = scene.add.graphics({
      lineStyle: { width: 1, color: 0xffffff, alpha: 0.5 },
    });
    graphics.strokePoints(hexagon.points, true);
    this.add(graphics);
  }
}
