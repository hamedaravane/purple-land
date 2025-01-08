/**
 * Emitted when the bubble cluster (or the level) descends one row,
 * typically increasing difficulty.
 */
export class RowDescendedEvent {
  constructor(
    public readonly currentLevel: number,
    public readonly rowCount: number,
  ) {}
}

/**
 * Emitted when the current level is completed.
 */
export class LevelCompletedEvent {
  constructor(public readonly completedLevelNumber: number) {}
}

/**
 * Emitted when the game is over (e.g., no more lives,
 * bubble cluster reached the bottom, or some other condition).
 */
export class GameOverEvent {
  constructor(public readonly reason: string) {}
}
