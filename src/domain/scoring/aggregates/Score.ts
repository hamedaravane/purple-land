export class Score {
  constructor(public value: number = 0) {}

  increment(points: number) {
    this.value += points;
  }

  reset() {
    this.value = 0;
  }
}
