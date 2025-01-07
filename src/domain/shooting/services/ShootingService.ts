import { Shot, Position, Direction } from '../entities/Shot';
import { TrajectoryCalculator } from './TrajectoryCalculator';

/**
 * Manages the creation and updating of Shot entities.
 */
export class ShootingService {
  private shots: Shot[] = [];
  private shotIdCounter = 0;

  /**
   * Constructs a new ShootingService instance.
   * @param trajectoryCalculator - Service that calculates direction and speed from user gestures.
   */
  constructor(private trajectoryCalculator: TrajectoryCalculator) {}

  /**
   * Fires a new shot based on user input (swipe start/end).
   * @param start - The starting point of the swipe/gesture.
   * @param end - The ending point of the swipe/gesture.
   * @returns The newly created Shot entity.
   */
  fireShot(start: Position, end: Position): Shot {
    const direction: Direction = this.trajectoryCalculator.calculateDirection(
      start,
      end,
    );
    const speed: number = this.trajectoryCalculator.calculateSpeed(start, end);

    const shot = new Shot(
      `shot-${this.shotIdCounter++}`,
      { x: start.x, y: start.y },
      direction,
      speed,
    );

    this.shots.push(shot);
    console.log(
      `Fired Shot ${shot.id} with direction (${direction.x.toFixed(2)}, ${direction.y.toFixed(2)}) and speed ${speed.toFixed(2)}.`,
    );

    return shot;
  }

  /**
   * Updates all active shots, moving them based on deltaTime.
   * @param deltaTime - Elapsed time (in seconds) since last update.
   */
  updateShots(deltaTime: number): void {
    this.shots.forEach((shot) => {
      if (shot.isActive) {
        shot.updatePosition(deltaTime);
        // Additional checks, e.g., out-of-bounds, collisions, can be triggered here
      }
    });

    // Optionally remove or filter out inactive shots
    this.shots = this.shots.filter((shot) => shot.isActive);
  }

  /**
   * Deactivates a shot by its ID (e.g., after collision or leaving the screen).
   * @param shotId - The ID of the shot to deactivate.
   */
  deactivateShot(shotId: string): void {
    const shot = this.shots.find((s) => s.id === shotId);
    if (shot) {
      shot.deactivate();
    }
  }

  /**
   * Retrieves all active shots.
   */
  getActiveShots(): Shot[] {
    return this.shots.filter((shot) => shot.isActive);
  }

  /**
   * Clears all shots (active or inactive).
   * Useful when resetting the game/level.
   */
  clearAllShots(): void {
    this.shots.forEach((shot) => shot.deactivate());
    this.shots = [];
    console.log('All shots have been cleared.');
  }
}
