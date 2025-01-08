/**
 * Emitted when the player loses a life.
 */
export class PlayerLifeLostEvent {
  constructor(
    public readonly remainingLives: number,
    public readonly lostAtTimestamp?: number,
  ) {}
}

/**
 * Emitted when the next bubble to shoot is generated (e.g., new color, power-up).
 */
export class NextBubbleGeneratedEvent {
  constructor(
    public readonly bubbleColor: string,
    public readonly generatedAtTimestamp?: number,
  ) {}
}

/**
 * Emitted when a power-up is activated (e.g., multicolor shot).
 */
export class PowerUpActivatedEvent {
  constructor(
    public readonly powerUpId: string,
    public readonly powerUpName: string,
    public readonly durationSec?: number,
  ) {}
}
