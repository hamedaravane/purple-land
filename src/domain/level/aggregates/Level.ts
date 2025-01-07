/**
 * Represents a single game level.
 */
export class Level {
  /**
   * Constructs a new Level instance.
   * @param number - The current level number.
   * @param difficulty - Difficulty parameters for the level.
   */
  constructor(
    public number: number = 1,
    public difficulty: Difficulty = { bubbleCount: 10, descentRate: 1 },
  ) {}

  /**
   * Increments the level number and updates difficulty parameters.
   */
  advanceLevel(): void {
    this.number += 1;
    this.updateDifficulty();
    console.log(`Advanced to Level ${this.number}. Difficulty increased.`);
  }

  /**
   * Updates the difficulty parameters based on the current level number.
   * This method can be customized to adjust various difficulty aspects.
   */
  private updateDifficulty(): void {
    // Example: Increase bubble count and descent rate with each level
    this.difficulty.bubbleCount += 5;
    this.difficulty.descentRate += 0.5;
    // Additional difficulty adjustments can be added here
  }

  /**
   * Resets the level to the initial state.
   */
  resetLevel(): void {
    this.number = 1;
    this.difficulty = { bubbleCount: 10, descentRate: 1 };
    console.log('Level has been reset to Level 1.');
  }
}

/**
 * Defines the structure for difficulty parameters.
 */
export type Difficulty = {
  bubbleCount: number;
  descentRate: number;
  // Additional difficulty parameters can be added here
};
