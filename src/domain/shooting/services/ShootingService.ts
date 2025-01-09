import { Shot } from '../entities/Shot';
import { PositionOrDirection } from '@shared/types';

export class ShootingService {
  private shots: Shot[] = [];
  private shotIdCounter = 0;

  fireShot(
    start: PositionOrDirection,
    direction: PositionOrDirection,
    speed: number,
    radius: number,
  ): Shot {
    const shot = new Shot(
      `shot-${this.shotIdCounter++}`,
      { x: start.x, y: start.y },
      direction,
      speed,
      radius,
    );
    this.shots.push(shot);
    return shot;
  }

  updateShots(dt: number): void {
    this.shots.forEach((s) => s.updatePosition(dt));
    this.shots = this.shots.filter((s) => s.isActive);
  }

  deactivateShot(id: string): void {
    const s = this.shots.find((x) => x.id === id);
    if (s) s.deactivate();
  }

  getActiveShots(): Shot[] {
    return this.shots.filter((s) => s.isActive);
  }
}
