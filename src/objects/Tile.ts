// src/objects/Tile.ts
import { GameObjects, Scene } from "phaser";
import { Bubble } from "./Bubble";

/**
 * Represents a single hexagonal tile in the grid.
 */
export class Tile extends GameObjects.Container {
  public q: number; // Axial column
  public r: number; // Axial row
  public bubble: Bubble | null = null;
  public neighbors: Tile[] = [];

  constructor(scene: Scene, q: number, r: number, size: number) {
    // Calculate pixel position based on axial coordinates
    const x = size * (3 / 2 * q);
    const y = size * (Math.sqrt(3) * (r + q / 2));

    super(scene, x, y);

    this.q = q;
    this.r = r;
    this.scene.add.existing(this);
  }

  /**
   * Checks if the tile is occupied by a bubble.
   */
  public isOccupied(): boolean {
    return this.bubble !== null;
  }

  /**
   * Places a bubble in this tile.
   * @param bubble The bubble to place.
   */
  public placeBubble(bubble: Bubble): void {
    this.bubble = bubble;
    bubble.setTile(this);
    this.add(bubble);
  }

  /**
   * Removes the bubble from this tile.
   */
  public removeBubble(): void {
    if (this.bubble) {
      this.remove(this.bubble);
      this.bubble.destroy();
      this.bubble = null;
    }
  }

  /**
   * Sets up neighbor references based on axial directions.
   * @param neighbors Array of adjacent Tile instances.
   */
  public setNeighbors(neighbors: Tile[]): void {
    this.neighbors = neighbors;
  }
}
