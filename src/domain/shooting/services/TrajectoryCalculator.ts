export class TrajectoryCalculator {
  calculateDirection(
    start: { x: number; y: number },
    end: { x: number; y: number },
  ): { x: number; y: number } {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) {
      return { x: 0, y: -1 };
    }
    return { x: dx / length, y: dy / length };
  }

  calculateSpeed(
    start: { x: number; y: number },
    end: { x: number; y: number },
  ): number {
    const dist = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
    const factor = 4.0;
    return Math.min(Math.max(dist * factor, 200), 800);
  }
}
