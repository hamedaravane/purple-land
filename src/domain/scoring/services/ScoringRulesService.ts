import { Score } from '../aggregates/Score';

export class ScoringRulesService {
  constructor(private score: Score) {}

  applyBubblePoppedScoring(numBubbles: number): void {
    const base = 10;
    // e.g., simple multiplier
    let multiplier = 1;
    if (numBubbles >= 5) multiplier = 2;
    if (numBubbles >= 10) multiplier = 3;
    this.score.increment(base * numBubbles * multiplier);
  }
}
