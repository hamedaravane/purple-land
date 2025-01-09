import { Bubble } from '../entities/Bubble';

export class BubbleCluster {
  private bubbles: Bubble[] = [];

  addBubble(bubble: Bubble): void {
    this.bubbles.push(bubble);
  }

  getBubbles(): Bubble[] {
    return this.bubbles;
  }

  removePoppedBubbles(): void {
    this.bubbles = this.bubbles.filter((b) => !b.isPopped);
  }
}
