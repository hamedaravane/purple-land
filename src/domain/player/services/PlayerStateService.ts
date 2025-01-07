import { Player, PowerUp } from '../aggregates/Player';

export class PlayerStateService {
  constructor(private player: Player) {}

  handlePlayerLifeLost(): void {
    this.player.loseLife();
  }

  handlePlayerGainedLife(): void {
    this.player.gainLife();
  }

  activatePlayerPowerUp(powerUp: PowerUp): void {
    this.player.activatePowerUp(powerUp);
  }

  deactivatePlayerPowerUp(powerUpId: string): void {
    this.player.deactivatePowerUp(powerUpId);
  }

  resetPlayerState(): void {
    this.player.reset();
  }
}
