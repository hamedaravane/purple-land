import { GameObjects, Input, Scene } from 'phaser';
import { Hexagon } from './Hexagon.ts';
import { Bubble } from './Bubble.ts';

export class Aimer extends GameObjects.Graphics {
  private readonly startX: number;
  private readonly startY: number;
  private endX: number;
  private endY: number;
  private isAiming: boolean = false;
  private readonly bubble: Bubble;
  private readonly tiles: Hexagon[][];
  private readonly size: number;

  constructor(
    scene: Scene,
    startX: number,
    startY: number,
    bubble: Bubble,
    tiles: Hexagon[][],
    size: number,
  ) {
    super(scene, { x: startX, y: startY });
    this.startX = startX;
    this.startY = startY;
    this.endX = startX;
    this.endY = startY;
    this.bubble = bubble;
    this.tiles = tiles;
    this.size = size;
    scene.add.existing(this);
    this.setupInput();
  }

  private setupInput() {
    this.scene.input.on('pointerdown', this.startAiming);
    this.scene.input.on('pointermove', this.updateAim);
    this.scene.input.on('pointerup', () => this.endAiming());
  }

  public startAiming(pointer: Input.Pointer): void {
    this.isAiming = true;
    this.endX = pointer.x;
    this.endY = pointer.y;
    this.drawAim();
  }

  public updateAim(pointer: Input.Pointer): void {
    if (!this.isAiming) return;
    this.endX = pointer.x;
    this.endY = pointer.y;
    this.drawAim();
  }

  public endAiming(): void {
    if (!this.isAiming) return;
    this.isAiming = false;
    this.clear();
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    this.shootBubble(dx, dy);
  }

  private drawAim(): void {
    this.clear();
    this.lineStyle(4, 0xffffff, 1);
    this.beginPath();
    this.moveTo(this.startX, this.startY);
    this.lineTo(this.endX, this.endY);
    this.strokePath();
  }

  private shootBubble(dx: number, dy: number): void {
    const speed = 500;

    this.scene.tweens.add({
      targets: this.bubble,
      x: this.bubble.x + dx,
      y: this.bubble.y + dy,
      duration: speed,
      onComplete: () => {
        const targetTile = this.findTargetTile(this.bubble.x, this.bubble.y);
        if (targetTile) {
          this.bubble.setTile(targetTile);
          this.checkForMatches(targetTile);
        }
      },
    });
  }

  private findTargetTile(x: number, y: number): Hexagon | null {
    const sqrt3 = Math.sqrt(3);
    const q = Math.round((2 * x) / (3 * this.size));
    const r = Math.round(y / (sqrt3 * this.size) - x / (3 * this.size));

    if (q >= 0 && q < this.tiles.length && r >= 0 && r < this.tiles[0].length) {
      return this.tiles[q][r];
    }
    return null;
  }

  private checkForMatches(tile: Hexagon): void {
    const visited: Set<string> = new Set();
    const sameColorTiles: Hexagon[] = [];
    const color = tile.bubble?.color || 0;

    this.floodFill(tile, color, sameColorTiles, visited);

    if (sameColorTiles.length >= 3) {
      sameColorTiles.forEach((t) => t.removeBubble());
      // this.handleFallingBubbles();
    }
  }

  private floodFill(
    tile: Hexagon,
    color: number,
    sameColorTiles: Hexagon[],
    visited: Set<string>,
  ): void {
    const key = `${tile.q},${tile.r}`;
    if (!tile || visited.has(key) || tile.bubble?.color !== color) {
      return;
    }

    visited.add(key);
    sameColorTiles.push(tile);

    tile.neighbors.forEach((neighbor) =>
      this.floodFill(neighbor, color, sameColorTiles, visited),
    );
  }

  /*private handleFallingBubbles(): void {
    // Implement logic to make remaining bubbles fall and fill gaps
  }*/
}
