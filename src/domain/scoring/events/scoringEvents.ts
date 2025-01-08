/**
 * Emitted whenever the score is updated (incremented, reset, etc.).
 */
export class ScoreUpdatedEvent {
  constructor(public readonly newScoreValue: number) {}
}
