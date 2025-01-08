import { Bubble } from '../entities/Bubble';

export class BubbleCluster {
  private bubbles: Bubble[] = [];

  addBubble(bubble: Bubble): void {
    this.bubbles.push(bubble);
  }

  getBubbles(): Bubble[] {
    return this.bubbles;
  }

  removeBubble(bubbleId: string): void {
    const idx = this.bubbles.findIndex((b) => b.id === bubbleId);
    if (idx !== -1) {
      this.bubbles.splice(idx, 1);
    }
  }

  clearPoppedBubbles(): void {
    this.bubbles = this.bubbles.filter((b) => !b.isPopped);
  }
}
