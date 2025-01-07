/**
 * Represents the player's current score.
 */
export class Score {
  /**
   * Constructs a new Score instance.
   * @param value - The initial score value.
   */
  constructor(public value: number = 0) {}

  /**
   * Increments the score by a specified amount.
   * @param points - The number of points to add.
   */
  increment(points: number): void {
    if (points < 0) {
      console.warn('Attempted to increment score by a negative value.');
      return;
    }
    this.value += points;
    console.log(`Score increased by ${points}. New score: ${this.value}.`);
  }

  /**
   * Decrements the score by a specified amount.
   * @param points - The number of points to subtract.
   */
  decrement(points: number): void {
    if (points < 0) {
      console.warn('Attempted to decrement score by a negative value.');
      return;
    }
    this.value = Math.max(this.value - points, 0);
    console.log(`Score decreased by ${points}. New score: ${this.value}.`);
  }

  /**
   * Resets the score to zero.
   */
  reset(): void {
    this.value = 0;
    console.log('Score has been reset to 0.');
  }
}
