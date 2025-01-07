import { ShootingService } from '@domain/shooting/services/ShootingService.ts';
import { Shot } from '@domain/shooting/entities/Shot.ts';

export class FireShotUseCase {
  constructor(private shootingService: ShootingService) {}

  execute(
    start: { x: number; y: number },
    end: { x: number; y: number },
  ): Shot {
    return this.shootingService.fireShot(start, end);
  }
}
