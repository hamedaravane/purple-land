export type PowerUp = {
  id: string;
  name: string;
  duration: number; // in seconds
};

export class Player {
  constructor(
    public lives: number = 3,
    public activePowerUps: PowerUp[] = [],
  ) {}

  loseLife(): void {
    if (this.lives > 0) {
      this.lives -= 1;
    }
  }

  gainLife(): void {
    this.lives += 1;
  }

  activatePowerUp(powerUp: PowerUp): void {
    this.activePowerUps.push(powerUp);
  }

  deactivatePowerUp(powerUpId: string): void {
    const idx = this.activePowerUps.findIndex((p) => p.id === powerUpId);
    if (idx !== -1) {
      this.activePowerUps.splice(idx, 1);
    }
  }

  reset(): void {
    this.lives = 3;
    this.activePowerUps = [];
  }
}
