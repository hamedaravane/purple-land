import Phaser from 'phaser';
import { Bubble } from '@domain/bubbles/entities/Bubble.ts';
import { TapShootBubbleUseCase } from '@application/usecases/TapShootBubbleUseCase.ts';

/**
 * A system that handles "tap" input. When the user touches/clicks,
 * we draw a dashed line from the shooting bubble to the pointer.
 * On release (pointerup), we remove the line and run the TapShootBubbleUseCase.
 */
export class TapInputSystem {
  private isPointerDown = false;
  private pointerGraphics!: Phaser.GameObjects.Graphics;
  private readonly colorHex!: number; // for dashed line color

  constructor(
    private scene: Phaser.Scene,
    private shootingBubble: Bubble,
    private tapShootUseCase: TapShootBubbleUseCase,
    private bubbleRadius: number,
    private shotRadius: number,
  ) {
    // We'll match the bubble color if we want the line same color
    // For example, if bubble is "red", we convert that to a colorHex.
    // Here we do a quick hack: map string => hex.
    // Or if your bubble stores a numeric color, just use that.
    this.colorHex = 0xffffff; // default
    if (this.shootingBubble.color === 'red') this.colorHex = 0xff0000;
    if (this.shootingBubble.color === 'green') this.colorHex = 0x00ff00;
    if (this.shootingBubble.color === 'blue') this.colorHex = 0x0000ff;
    if (this.shootingBubble.color === 'yellow') this.colorHex = 0xffff00;
    if (this.shootingBubble.color === 'purple') this.colorHex = 0xff00ff;
  }

  setup(): void {
    this.pointerGraphics = this.scene.add.graphics({ x: 0, y: 0 });

    // 1) pointerdown
    this.scene.input.on('pointerdown', () => {
      // TODO: the pointer input arg removed, bug alert!
      this.isPointerDown = true;
    });

    // 2) pointermove: update dashed line if pointer is down
    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isPointerDown) {
        this.drawDashedLine(
          this.shootingBubble.position.x,
          this.shootingBubble.position.y,
          pointer.x,
          pointer.y,
        );
      }
    });

    // 3) pointerup: remove line + shoot bubble
    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      this.isPointerDown = false;
      this.pointerGraphics.clear();

      // Execute the use case
      this.tapShootUseCase.execute(
        { x: pointer.x, y: pointer.y },
        this.shotRadius,
        this.bubbleRadius,
      );
    });
  }

  private drawDashedLine(x1: number, y1: number, x2: number, y2: number): void {
    this.pointerGraphics.clear();

    this.pointerGraphics.lineStyle(2, this.colorHex, 1.0);

    // We'll do a simple approach: break the line into segments
    const dashLen = 8;
    const gapLen = 5;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    const angle = Math.atan2(dy, dx);
    let currentX = x1;
    let currentY = y1;
    this.pointerGraphics.beginPath();

    // We'll alternate dash-gap-dash-gap until we exceed length
    let remaining = length;
    while (remaining > 0) {
      const segment = Math.min(dashLen, remaining);
      const xEnd = currentX + Math.cos(angle) * segment;
      const yEnd = currentY + Math.sin(angle) * segment;

      // draw dash
      this.pointerGraphics.moveTo(currentX, currentY);
      this.pointerGraphics.lineTo(xEnd, yEnd);
      this.pointerGraphics.strokePath();

      // move forward
      currentX = xEnd + Math.cos(angle) * gapLen;
      currentY = yEnd + Math.sin(angle) * gapLen;
      remaining -= dashLen + gapLen;
    }
    this.pointerGraphics.closePath();
  }
}
