/**
 * Service responsible for calculating trajectory details
 * (direction, speed) based on user input.
 */
export class TrajectoryCalculator {
  /**
   * Calculates a normalized direction vector from two points.
   * @param start - The starting point of the swipe/gesture.
   * @param end - The ending point of the swipe/gesture.
   * @returns A normalized direction vector { x, y }.
   */
  calculateDirection(
    start: { x: number; y: number },
    end: { x: number; y: number },
  ): { x: number; y: number } {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    // If there's no movement, default direction to upward
    if (length === 0) {
      console.warn('Zero-length swipe: defaulting direction to upward.');
      return { x: 0, y: -1 };
    }

    return { x: dx / length, y: dy / length };
  }

  /**
   * Calculates the shot speed based on swipe/gesture length.
   * @param start - The starting point of the swipe/gesture.
   * @param end - The ending point of the swipe/gesture.
   * @returns The shot speed (units per second).
   */
  calculateSpeed(
    start: { x: number; y: number },
    end: { x: number; y: number },
  ): number {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Example: speedFactor scales the raw distance to a speed
    const speedFactor = 0.6;
    const rawSpeed = distance * speedFactor;

    // Clamp speed to a reasonable range
    return Math.max(200, Math.min(rawSpeed, 1000));
  }
}
