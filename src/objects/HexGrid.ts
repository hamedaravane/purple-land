import { HexTile } from '@objects/HexTile.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';

export class HexGrid {
  private hexTiles: Phaser.GameObjects.Group;
  private readonly hexSize: number;

  constructor(
    scene: Phaser.Scene,
    cols: number,
    rows: number,
    spriteKey: string,
  ) {
    this.hexSize = scene.scale.width / cols / Math.sqrt(3);
    this.createGrid(scene, cols, rows, spriteKey);
  }

  createGrid(
    scene: Phaser.Scene,
    cols: number,
    rows: number,
    spriteKey: string,
  ) {
    this.hexTiles = new Phaser.GameObjects.Group(scene);
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const isOddRow = row % 2 === 0;
        if (isOddRow && col === 0) continue;
        const x = isOddRow
          ? col * this.hexSize * Math.sqrt(3) -
            (this.hexSize * Math.sqrt(3)) / 2
          : col * this.hexSize * Math.sqrt(3);
        const y = row * this.hexSize * Math.sqrt(2.2);
        const bubbleColor = getBubbleColor();
        const tile = new HexTile(
          scene,
          x,
          y,
          this.hexSize,
          spriteKey,
          bubbleColor,
        );
        this.hexTiles.add(tile);
      }
    }
  }
}
