import { Level } from '../aggregates/Level';

export class ProgressionService {
  constructor(private level: Level) {}

  handleBubblesCleared(): void {
    this.level.advanceLevel();
  }

  resetLevel(): void {
    this.level.resetLevel();
  }
}
