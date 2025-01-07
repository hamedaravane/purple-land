export type Difficulty = {
  bubbleCount: number;
  descentRate: number;
};

export class Level {
  constructor(
    public number: number = 1,
    public difficulty: Difficulty = { bubbleCount: 10, descentRate: 1 },
  ) {}

  advanceLevel(): void {
    this.number += 1;
    this.updateDifficulty();
  }

  resetLevel(): void {
    this.number = 1;
    this.difficulty = { bubbleCount: 10, descentRate: 1 };
  }

  private updateDifficulty(): void {
    this.difficulty.bubbleCount += 5;
    this.difficulty.descentRate += 0.5;
  }
}
