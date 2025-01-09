import { Bubble } from '../entities/Bubble';

export class BubbleCluster {
  private bubbles: Bubble[] = [];

  constructor(public quantity: number = 20) {
    for (let i = 0; i < quantity; i++) {
      const bubble = new Bubble(
        `default-bubble-${i}`,
        'red',
        { x: 10, y: 20 },
        15,
      );
      this.addBubble(bubble);
    }
  }

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
