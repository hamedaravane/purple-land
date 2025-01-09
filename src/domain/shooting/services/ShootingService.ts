import { Shot } from '../entities/Shot';

export class ShootingService {
  private shots: Shot[] = [];
  private shotIdCounter = 0;

  fireShot(
    start: { x: number; y: number },
    direction: { x: number; y: number },
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
