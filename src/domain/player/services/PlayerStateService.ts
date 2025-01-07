import { Player, PowerUp } from '../aggregates/Player';

/**
 * Service responsible for managing the player's state.
 */
export class PlayerStateService {
  constructor(private player: Player) {}

  /**
   * Handles the event when the player loses a life.
   */
  handlePlayerLifeLost(): void {
    this.player.loseLife();
    if (this.player.lives <= 0) {
      this.handleGameOver();
    }
    // Optionally, publish a PlayerLifeLostEvent here in the future
  }

  /**
   * Handles the event when the player gains a life.
   */
  handlePlayerGainedLife(): void {
    this.player.gainLife();
    // Optionally, publish a PlayerGainedLifeEvent here in the future
  }

  /**
   * Activates a power-up for the player.
   * @param powerUp - The power-up to activate.
   */
  activatePlayerPowerUp(powerUp: PowerUp): void {
    this.player.activatePowerUp(powerUp);
    // Optionally, publish a PowerUpActivatedEvent here in the future
  }

  /**
   * Deactivates a power-up for the player.
   * @param powerUpId - The ID of the power-up to deactivate.
   */
  deactivatePlayerPowerUp(powerUpId: string): void {
    this.player.deactivatePowerUp(powerUpId);
    // Optionally, publish a PowerUpDeactivatedEvent here in the future
  }

  /**
   * Resets the player's state, typically when restarting the game.
   */
  resetPlayerState(): void {
    this.player.reset();
    // Optionally, publish a PlayerStateResetEvent here in the future
  }

  /**
   * Handles the game over scenario when the player has no lives left.
   */
  private handleGameOver(): void {
    console.log('Game Over! Player has no lives left.');
    // Implement game over logic here, such as triggering events or notifying the application layer
    // Optionally, publish a GameOverEvent here in the future
  }
}
