import { PositionOrDirection } from '@shared/types';

export class Shot {
  constructor(
    public readonly id: string,
    public position: PositionOrDirection,
    public direction: PositionOrDirection,
    public speed: number,
    public radius: number,
    public isActive: boolean = true,
  ) {}

  updatePosition(deltaTime: number): void {
    if (!this.isActive) return;
    this.position.x += this.direction.x * this.speed * deltaTime;
    this.position.y += this.direction.y * this.speed * deltaTime;
  }

  deactivate(): void {
    this.isActive = false;
  }
}
