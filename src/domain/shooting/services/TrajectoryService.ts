import { PositionOrDirection } from '@shared/types';

export class TrajectoryService {
  /**
   * Calculate direction from bottom bubble center to tapped point.
   */
  calculateDirection(
    shooterPos: PositionOrDirection,
    touchPos: PositionOrDirection,
  ): PositionOrDirection {
    const dx = touchPos.x - shooterPos.x;
    const dy = touchPos.y - shooterPos.y;
    const mag = Math.sqrt(dx * dx + dy * dy);
    if (mag === 0) return { x: 0, y: 1 };
    return { x: dx / mag, y: dy / mag };
  }

  /**
   * Optionally compute angle if you want direct angle usage:
   * angle in radians between this ray and x-axis
   */
  calculateAngle(
    shooterPos: PositionOrDirection,
    touchPos: PositionOrDirection,
  ): number {
    const dx = touchPos.x - shooterPos.x;
    const dy = touchPos.y - shooterPos.y;
    return Math.atan2(dy, dx);
  }
}
