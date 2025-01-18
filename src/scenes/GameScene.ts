import { Aimer } from '@objects/Aimer';
import { HexGrid } from '@objects/HexGrid.ts';
import { getBubbleColor } from '@utils/ColorUtils.ts';
import { HexTile } from '@objects/HexTile.ts';

export default class GameScene extends Phaser.Scene {
  private shootingHexTile: HexTile;
  private aimer: Aimer;
  private cols: number;
  private rows: number;
  // private bubbleWidth: number;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.cols = 12;
    this.rows = 6;
    // this.bubbleWidth = this.scale.width / this.cols;
    const background = new Phaser.GameObjects.Sprite(this, 0, 0, 'background');
    this.shootingHexTile = new HexTile(
      this,
      this.scale.width / 2,
      this.scale.height - 100,
      this.scale.width / this.cols / 2,
      'bubbles',
      getBubbleColor(),
    );
    /*this.shootingHexTile = new Bubble(
      this,
      this.scale.width / 2,
      this.scale.height - 100,
      this.bubbleWidth,
      'shooting',
      'bubbles',
      getBubbleColor(),
    );*/
    this.add.existing(background);
    this.spawnShootingBubble();
  }

  private spawnShootingBubble() {
    if (this.shootingHexTile) this.shootingHexTile.destroy();
    if (this.aimer) this.aimer.destroy();
    new HexGrid(this, this.cols, this.rows, 'bubbles');
    this.physics.add.existing(this.shootingHexTile);
    // this.aimer = new Aimer(this, this.shootingHexTile);
  }
}
