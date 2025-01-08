export type ShotPosition = { x: number; y: number };
export type ShotDirection = { x: number; y: number };

export class Shot {
  constructor(
    public readonly id: string,
    public position: ShotPosition,
    public direction: ShotDirection,
    public speed: number,
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
