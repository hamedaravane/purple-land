import { Bubble } from '../entities/Bubble';

/**
 * Emitted when one or more bubbles are popped.
 */
export class BubblesPoppedEvent {
  constructor(public readonly poppedBubbles: Bubble[]) {}
}

/**
 * Emitted when the bubble cluster changes (e.g., bubbles added/removed).
 */
export class ClusterUpdatedEvent {
  constructor(public readonly updatedBubbles: Bubble[]) {}
}
