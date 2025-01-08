import { Shot } from '../entities/Shot';

export class ShootingService {
  private shots: Shot[] = [];
  private shotIdCounter = 0;

  fireShot(
    start: { x: number; y: number },
    end: { x: number; y: number },
  ): Shot {
    const shot = new Shot(
      `shot-${this.shotIdCounter++}`,
      { x: start.x, y: start.y },
      { x: end.x - start.x, y: end.y - start.y },
      500,
    );
    this.shots.push(shot);
    return shot;
  }

  updateShots(deltaTime: number): void {
    for (const shot of this.shots) {
      if (shot.isActive) {
        shot.updatePosition(deltaTime);
      }
    }
    this.shots = this.shots.filter((shot) => shot.isActive);
  }

  deactivateShot(shotId: string): void {
    const shot = this.shots.find((s) => s.id === shotId);
    if (shot) shot.deactivate();
  }

  getActiveShots(): Shot[] {
    return this.shots.filter((shot) => shot.isActive);
  }
}
