import { Score } from '../aggregates/Score';

export class ScoringRulesService {
  constructor(private score: Score) {}

  applyBubblePoppedScoring(bubblesPopped: number): void {
    const basePoints = 10;
    const multiplier = this.calculateMultiplier(bubblesPopped);
    this.score.increment(basePoints * multiplier);
  }

  applyPenalty(penaltyPoints: number): void {
    this.score.decrement(penaltyPoints);
  }

  resetScore(): void {
    this.score.reset();
  }

  private calculateMultiplier(count: number): number {
    if (count >= 10) return 5;
    if (count >= 5) return 3;
    if (count >= 2) return 2;
    return 1;
  }
}
