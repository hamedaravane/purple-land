import { Bubble } from '../entities/Bubble';

export class BubblesPoppedEvent {
  constructor(public readonly poppedBubbles: Bubble[]) {}
}

export class ClusterUpdatedEvent {
  constructor(public readonly bubbles: Bubble[]) {}
}
