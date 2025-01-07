export class Score {
  constructor(public value: number = 0) {}

  increment(points: number): void {
    if (points > 0) {
      this.value += points;
    }
  }

  decrement(points: number): void {
    if (points > 0) {
      this.value = Math.max(0, this.value - points);
    }
  }

  reset(): void {
    this.value = 0;
  }
}
