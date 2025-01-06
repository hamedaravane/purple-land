import Phaser from 'phaser';
import { Bubble } from './Bubble';
import { Hexagon } from './Hexagon.ts';

export class HexGrid {
  private readonly scene: Phaser.Scene;
  private readonly tiles: Hexagon[][];
  private readonly numCols: number;
  private readonly totalGridWidth: number;
  private readonly size: number;
  private readonly hexWidth: number;
  private hexHeight: number;
  private readonly hSpacing: number;
  private readonly vSpacing: number;

  constructor(scene: Phaser.Scene, numCols: number, totalGridWidth: number, numrs: number) {
    this.scene = scene;
    this.numCols = numCols;
    this.totalGridWidth = totalGridWidth;
    this.size = this.calculateHexSize();
    this.hexWidth = Math.sqrt(3) * this.size;
    this.hexHeight = 2 * this.size;
    this.hSpacing = 1.5 * this.size;
    this.vSpacing = Math.sqrt(3) * this.size;
    this.tiles = [];

    this.createGrid(numrs);
  }

  // Calculate hex size based on totalGridWidth and numCols
  private calculateHexSize(): number {
    return this.totalGridWidth / (Math.sqrt(3) + 1.5 * (this.numCols - 1));
  }

  // Create the grid with specified number of rows
  private createGrid(numRows: number): void {
    const gridCenterX = this.scene.cameras.main.width / 2;
    const gridStartY = this.scene.cameras.main.height / 2 - (this.vSpacing * (numRows - 1)) / 2;

    for (let row = 0; row < numRows; row++) {
      // Determine number of hexes in this row
      const isTopOrBottom = row === 0 || row === numRows - 1;
      const hexesInRow = isTopOrBottom ? this.numCols - 1 : this.numCols;

      // Calculate horizontal offset for staggered rows
      const isOffset = row % 2 !== 0; // Odd rows are offset
      const offsetX = isOffset ? this.hexWidth / 2 : 0;

      const rowHexes: Hexagon[] = [];

      for (let col = 0; col < hexesInRow; col++) {
        // Calculate x position
        const x = gridCenterX - (this.hexWidth / 2) * hexesInRow + col * this.hSpacing + offsetX;

        // Calculate y position
        const y = gridStartY + row * (this.vSpacing * 0.75); // 0.75 accounts for vertical overlap

        // Create and store the tile
        const tile = new Hexagon(this.scene, col, row, x, y, this.size);
        rowHexes.push(tile);
      }

      this.tiles.push(rowHexes);
    }
  }

  // Retrieve a tile by r and column
  public getTile(r: number, q: number): Hexagon | undefined {
    if (r < 0 || r >= this.tiles.length) return undefined;
    const rTiles = this.tiles[r];
    if (q < 0 || q >= rTiles.length) return undefined;
    return rTiles[q];
  }

  // Place a bubble near a target position
  public placeBubbleNear(x: number, y: number, bubble: Bubble): boolean {
    let closestTile: Hexagon | null = null;
    let minDistance = Infinity;

    this.tiles.forEach(rTiles => {
      rTiles.forEach(tile => {
        if (tile.isEmpty()) {
          const distance = Phaser.Math.Distance.Between(x, y, tile.x, tile.y);
          if (distance < minDistance) {
            minDistance = distance;
            closestTile = tile;
          }
        }
      });
    });

    if (closestTile) {
      closestTile.placeBubble(bubble);
      return true;
    }

    console.warn('No empty tile found near the target position.');
    return false;
  }

  // Implement match checking using flood-fill
  public findConnectedBubbles(r: number, q: number, color: string, visited: Set<string> = new Set()): Hexagon[] {
    const tile = this.getTile(r, q);
    if (!tile || tile.bubble?.color !== color || visited.has(`${r},${q}`)) {
      return [];
    }

    visited.add(`${r},${q}`);
    let connected: Hexagon[] = [tile];

    tile.getNeighbors(this).forEach(neighbor => {
      connected = connected.concat(this.findConnectedBubbles(neighbor.r, neighbor.q, color, visited));
    });

    return connected;
  }

  public checkForMatches(): void {
    const matches: Hexagon[][] = [];
    const visited: Set<string> = new Set();

    this.tiles.forEach(rTiles => {
      rTiles.forEach(tile => {
        if (tile.bubble && !visited.has(`${tile.r},${tile.q}`)) {
          const connected = this.findConnectedBubbles(tile.r, tile.q, tile.bubble.color, visited);
          if (connected.length >= 3) {
            matches.push(connected);
          }
        }
      });
    });

    // Pop all matching bubbles
    matches.forEach(match => {
      match.forEach(tile => {
        tile.removeBubble();
      });
    });
  }
}
