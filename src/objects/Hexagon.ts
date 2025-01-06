import Phaser from 'phaser';
import { Bubble } from './Bubble';
import { HexGrid } from './HexagonalGrid.ts';

export class Hexagon {
  public q: number;
  public r: number;
  public x: number;
  public y: number;
  public bubble: Bubble | null;
  private tileGraphics: Phaser.GameObjects.Graphics;
  private readonly size: number;

  constructor(scene: Phaser.Scene, q: number, r: number, x: number, y: number, size: number) {
    this.q = q;
    this.r = r;
    this.x = x;
    this.y = y;
    this.size = size;
    this.bubble = null;

    // Initialize tile graphics (optional)
    this.tileGraphics = scene.add.graphics({ x: this.x, y: this.y });
    this.drawTile();

    // Enable interactivity
    this.setupInteractivity(scene);
  }

  // Draw the hexagon
  private drawTile() {
    this.tileGraphics.clear();
    this.tileGraphics.lineStyle(1, 0xcccccc, 1); // Light gray border
    this.tileGraphics.beginPath();
    const points = Hexagon.getHexPoints(this.size);
    points.forEach((point, index) => {
      if (index === 0) {
        this.tileGraphics.moveTo(point.x, point.y);
      } else {
        this.tileGraphics.lineTo(point.x, point.y);
      }
    });
    this.tileGraphics.closePath();
    this.tileGraphics.strokePath();
  }

  // Static method to get hexagon points
  public static getHexPoints(size: number): Phaser.Geom.Point[] {
    const points: Phaser.Geom.Point[] = [];
    for (let i = 0; i < 6; i++) {
      const angle_deg = 60 * i - 30; // Pointy-topped
      const angle_rad = Phaser.Math.DegToRad(angle_deg);
      points.push(new Phaser.Geom.Point(size * Math.cos(angle_rad), size * Math.sin(angle_rad)));
    }
    return points;
  }

  // Place a bubble in this tile
  public placeBubble(bubble: Bubble) {
    if (this.bubble) {
      console.warn(`Tile (${this.q}, ${this.r}) is already occupied.`);
      return;
    }
    this.bubble = bubble;
    bubble.setPosition(this.x, this.y);
  }

  // Remove the bubble from this tile
  public removeBubble() {
    if (this.bubble) {
      this.bubble = null;
    }
  }

  // Check if the tile is empty
  public isEmpty(): boolean {
    return this.bubble === null;
  }

  // Get neighboring tiles
  public getNeighbors(grid: HexGrid): Hexagon[] {
    const directions = [
      { dq: 1, dr: 0 },
      { dq: 1, dr: -1 },
      { dq: 0, dr: -1 },
      { dq: -1, dr: 0 },
      { dq: -1, dr: 1 },
      { dq: 0, dr: 1 },
    ];

    return directions.map(dir => grid.getTile(this.r + dir.dr, this.q + dir.dq))
      .filter(tile => tile !== undefined) as Hexagon[];
  }

  // Setup interactivity
  private setupInteractivity(scene: Phaser.Scene) {
    this.tileGraphics.setInteractive(
      Hexagon.getHexPoints(this.size).map(p => ({ x: p.x, y: p.y })),
      Phaser.Geom.Polygon.Contains
    );

    this.tileGraphics.on('pointerdown', () => {
      if (this.bubble) {
        this.removeBubble();
        scene.events.emit('bubblePopped', this);
        // Additional logic like checking for matches
      }
    });

    this.tileGraphics.on('pointerover', () => {
      this.tileGraphics.lineStyle(2, 0x00ff00, 1); // Highlight with green border
      this.tileGraphics.strokePath();
    });

    this.tileGraphics.on('pointerout', () => {
      this.tileGraphics.lineStyle(1, 0xcccccc, 1); // Reset to light gray border
      this.tileGraphics.strokePath();
    });
  }
}
