import { Level } from '../aggregates/Level';
import { ScoringRulesService } from '../../scoring/services/ScoringRulesService';

/**
 * Service responsible for managing level progression.
 */
export class ProgressionService {
  constructor(
    private level: Level,
    private scoringService: ScoringRulesService,
  ) {}

  /**
   * Handles the transition to the next level.
   */
  advanceToNextLevel(): void {
    this.level.advanceLevel();
    // Additional logic for transitioning to the next level can be added here
    console.log(`Transitioned to Level ${this.level.number}.`);
  }

  /**
   * Determines if the current level has been completed.
   * For simplicity, let's assume the level is completed when all bubbles are popped.
   * @param poppedBubbles - Array of bubbles that were popped.
   */
  handleBubblesPopped(poppedBubbles: any[]): void {
    // Apply scoring rules based on popped bubbles
    this.scoringService.applyBubblePoppedScoring(poppedBubbles);

    // Check if level completion criteria are met
    // This is a placeholder and should be replaced with actual logic
    if (this.checkLevelCompletion()) {
      this.advanceToNextLevel();
    }
  }

  /**
   * Checks if the current level has been completed.
   * @returns True if the level is completed, else false.
   */
  private checkLevelCompletion(): boolean {
    // Placeholder logic: In a real scenario, you'd check if all bubbles are popped
    // For demonstration, let's assume the level is completed when bubbleCount reaches zero
    // This should be replaced with actual game state checks
    return true; // Always returns true for simplicity
  }

  /**
   * Resets the level to its initial state.
   */
  resetLevel(): void {
    this.level.resetLevel();
    // Additional logic for resetting the level can be added here
    console.log('ProgressionService: Level has been reset.');
  }
}
