export type Position = {
  x: number;
  y: number;
};

export type Direction = {
  x: number;
  y: number;
};

/**
 * Represents a single shot fired by the player.
 */
export class Shot {
  /**
   * Constructs a new Shot instance.
   * @param id - Unique identifier for the shot.
   * @param position - Starting position of the shot.
   * @param direction - Normalized direction vector of the shot.
   * @param speed - Speed at which the shot travels.
   * @param isActive
   */
  constructor(
    public readonly id: string,
    public position: Position,
    public direction: Direction,
    public speed: number,
    public isActive: boolean = true,
  ) {}

  /**
   * Updates the position of the shot based on its direction and speed.
   * @param deltaTime - Time elapsed (in seconds) since the last update.
   */
  updatePosition(deltaTime: number): void {
    if (!this.isActive) return;
    this.position.x += this.direction.x * this.speed * deltaTime;
    this.position.y += this.direction.y * this.speed * deltaTime;
    console.log(
      `Shot ${this.id} moved to (${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)}).`,
    );
  }

  /**
   * Marks the shot as inactive, meaning it's no longer in play.
   */
  deactivate(): void {
    if (this.isActive) {
      this.isActive = false;
      console.log(`Shot ${this.id} deactivated.`);
    }
  }
}
