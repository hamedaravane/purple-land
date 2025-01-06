import { Hexagon } from './Hexagon.ts';
import { Bubble } from './Bubble.ts';

export class HexagonalGrid {
  private tiles: Hexagon[][] = [];
  private scene: Phaser.Scene;
  private numCols: number;
  private numRows: number;
  private size: number;
  private hexWidth: number;
  private hexHeight: number;
  private hSpacing: number;
  private vSpacing: number;

  constructor(scene: Phaser.Scene, numCols: number, numRows: number) {
    this.scene = scene;
    this.numCols = numCols;
    this.numRows = numRows;
    this.size = this.calculateHexSize();
    this.hexWidth = Math.sqrt(3) * this.size;
    this.hexHeight = 2 * this.size;
    this.hSpacing = this.hexWidth;
    this.vSpacing = 1.5 * this.size;
    this.tiles = [];
    this.createGrid();

    // Listen to resize events
    this.scene.scale.on('resize', this.onResize, this);
  }

  private calculateHexSize() {
    return this.scene.scale.width / this.numCols / Math.sqrt(3);
  }

  private createGrid() {
    const gridStartY = this.calculateGridStartY();
    const gridCenterX = this.scene.scale.width / 2;

    const maxCols = this.calculateMaxColumns();

    for (let row = 0; row < this.numRows; row++) {
      const hexesInRow = this.getHexesInRow(maxCols);
      const totalRowWidth = this.calculateTotalRowWidth(hexesInRow);
      const gridStartX = this.calculateGridStartX(gridCenterX, totalRowWidth);
      const offsetX = this.getRowOffset(row);
      const rowHexes: Hexagon[] = [];
      for (let col = 0; col < hexesInRow; col++) {
        const x = this.calculateHexXPosition(gridStartX, col, offsetX);
        const y = this.calculateHexYPosition(gridStartY, row);
        const tile = new Hexagon(this.scene, col, row, x, y, this.size);
        rowHexes.push(tile);
      }
      this.tiles.push(rowHexes);
    }
  }

  private calculateGridStartY() {
    const totalGridHeight = (this.numRows - 1) * this.vSpacing + this.hexHeight;
    return (this.scene.scale.height - totalGridHeight) / 2;
  }

  // TODO: I should enhance this method later in order to have better look!
  private getHexesInRow(maxCols: number) {
    return maxCols;
  }

  private calculateTotalRowWidth(hexesInRow: number): number {
    if (hexesInRow <= 0) return 0;
    return (hexesInRow - 1) * this.hSpacing + this.hexWidth;
  }

  private calculateGridStartX(
    gridCenterX: number,
    totalRowWidth: number,
  ): number {
    return gridCenterX - totalRowWidth / 2;
  }

  private getRowOffset(row: number) {
    const isOffset = row % 2 !== 0; // Odd rows are offset
    return isOffset ? this.hSpacing / 2 : 0;
  }

  private calculateHexXPosition(
    gridStartX: number,
    col: number,
    offsetX: number,
  ): number {
    return gridStartX + col * this.hSpacing + offsetX;
  }

  private calculateHexYPosition(gridStartY: number, row: number) {
    return gridStartY + row * this.vSpacing;
  }

  private calculateMaxColumns(): number {
    const screenWidth = this.scene.scale.width;
    const maxGridWidth = screenWidth * 0.9; // Leave 5% padding on each side

    const maxCols = Math.floor(
      (maxGridWidth - this.hexWidth) / this.hSpacing + 1,
    );
    return Math.min(this.numCols, maxCols);
  }

  /**
   * Handler for resize events to recreate the grid based on new dimensions.
   */
  private onResize(): void {
    this.destroyGrid();
    this.createGrid();
  }

  /**
   * Destroys the current grid tiles.
   */
  private destroyGrid(): void {
    for (const rowHexes of this.tiles) {
      for (const tile of rowHexes) {
        tile.destroy(); // Assuming Hexagon class has a destroy method
      }
    }
    this.tiles = [];
  }

  public getTile(r: number, q: number): Hexagon | undefined {
    if (r < 0 || r >= this.tiles.length) return undefined;
    const rTiles = this.tiles[r];
    if (q < 0 || q >= rTiles.length) return undefined;
    return rTiles[q];
  }

  // Place a bubble near a target position
  public placeBubbleNear(x: number, y: number, bubble: Bubble) {
    let closestTile: Hexagon | null = null;
    let minDistance = Infinity;

    for (const rTiles of this.tiles) {
      for (const tile of rTiles) {
        if (tile.isEmpty()) {
          const distance = Phaser.Math.Distance.Between(x, y, tile.x, tile.y);
          if (distance < minDistance) {
            minDistance = distance;
            closestTile = tile;
          }
        }
      }
    }

    if (closestTile) {
      closestTile.placeBubble(bubble);
      return true;
    }

    console.warn('No empty tile found near the target position.');
    return false;
  }

  // Implement match checking using flood-fill
  public findConnectedBubbles(
    r: number,
    q: number,
    color: string,
    visited: Set<string> = new Set(),
  ): Hexagon[] {
    const tile = this.getTile(r, q);
    if (!tile || tile.bubble?.color !== color || visited.has(`${r},${q}`)) {
      return [];
    }

    visited.add(`${r},${q}`);
    let connected: Hexagon[] = [tile];

    tile.getNeighbors(this).forEach((neighbor) => {
      connected = connected.concat(
        this.findConnectedBubbles(neighbor.r, neighbor.q, color, visited),
      );
    });

    return connected;
  }

  public checkForMatches() {
    const matches: Hexagon[][] = [];
    const visited: Set<string> = new Set();

    this.tiles.forEach((rTiles) => {
      rTiles.forEach((tile) => {
        if (tile.bubble && !visited.has(`${tile.r},${tile.q}`)) {
          const connected = this.findConnectedBubbles(
            tile.r,
            tile.q,
            tile.bubble.color,
            visited,
          );
          if (connected.length >= 3) {
            matches.push(connected);
          }
        }
      });
    });

    // Pop all matching bubbles
    matches.forEach((match) => {
      match.forEach((tile) => {
        tile.removeBubble();
      });
    });
  }
}
