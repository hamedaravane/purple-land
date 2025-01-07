import { Score } from '@domain/scoring/aggregates/Score.ts';
import { Bubble } from '@domain/bubbles/entities/Bubble.ts';

/**
 * Service responsible for applying scoring rules based on game events.
 */
export class ScoringRulesService {
  /**
   * Constructs a new ScoringRulesService instance.
   * @param score - The Score aggregate to modify.
   */
  constructor(private score: Score) {}

  /**
   * Applies scoring rules when bubbles are popped.
   * @param poppedBubbles - An array of Bubble instances that were popped.
   */
  applyBubblePoppedScoring(poppedBubbles: Bubble[]): void {
    const basePoints = 10;
    const multiplier = this.calculateComboMultiplier(poppedBubbles.length);
    const pointsEarned = basePoints * multiplier;
    this.score.increment(pointsEarned);
    console.log(
      `Popped ${poppedBubbles.length} bubbles. Earned ${pointsEarned} points.`,
    );
  }

  /**
   * Calculates a combo multiplier based on the number of bubbles popped.
   * @param count - The number of bubbles popped in a single action.
   * @returns The combo multiplier.
   */
  private calculateComboMultiplier(count: number): number {
    if (count >= 10) return 5;
    if (count >= 5) return 3;
    if (count >= 2) return 2;
    return 1;
  }

  /**
   * Applies scoring rules when the player loses a life or fails a level.
   * @param penaltyPoints - The number of points to subtract.
   */
  applyPenalty(penaltyPoints: number): void {
    this.score.decrement(penaltyPoints);
    console.log(`Applied a penalty of ${penaltyPoints} points.`);
  }

  /**
   * Resets the score, typically used when starting a new game or level.
   */
  resetScore(): void {
    this.score.reset();
    console.log('Score has been reset.');
  }
}
