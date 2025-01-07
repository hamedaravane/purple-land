/**
 * Represents a power-up that the player can activate.
 */
export type PowerUp = {
  id: string;
  name: string;
  duration: number; // Duration in seconds
};

/**
 * Represents the player's current state, including lives and active power-ups.
 */
export class Player {
  /**
   * Constructs a new Player instance.
   * @param lives - The number of lives the player starts with.
   * @param activePowerUps - An array of active power-ups.
   */
  constructor(
    public lives: number = 3,
    public activePowerUps: PowerUp[] = [],
  ) {}

  /**
   * Decrements the player's lives by one.
   * If lives reach zero, the player is considered dead.
   */
  loseLife(): void {
    if (this.lives > 0) {
      this.lives -= 1;
      console.log(`Player lost a life. Remaining lives: ${this.lives}.`);
    } else {
      console.warn('Player has no lives left.');
    }
  }

  /**
   * Increments the player's lives by one.
   * Useful for power-ups or bonuses.
   */
  gainLife(): void {
    this.lives += 1;
    console.log(`Player gained a life. Total lives: ${this.lives}.`);
  }

  /**
   * Adds a power-up to the player's active power-ups.
   * @param powerUp - The power-up to add.
   */
  activatePowerUp(powerUp: PowerUp): void {
    this.activePowerUps.push(powerUp);
    console.log(
      `Activated power-up: ${powerUp.name} for ${powerUp.duration} seconds.`,
    );
  }

  /**
   * Removes a power-up from the player's active power-ups.
   * @param powerUpId - The ID of the power-up to remove.
   */
  deactivatePowerUp(powerUpId: string): void {
    const index = this.activePowerUps.findIndex((pu) => pu.id === powerUpId);
    if (index !== -1) {
      const removed = this.activePowerUps.splice(index, 1)[0];
      console.log(`Deactivated power-up: ${removed.name}.`);
    } else {
      console.warn(`Power-up with ID ${powerUpId} not found.`);
    }
  }

  /**
   * Resets the player's state to the initial configuration.
   */
  reset(): void {
    this.lives = 3;
    this.activePowerUps = [];
    console.log('Player state has been reset.');
  }
}
