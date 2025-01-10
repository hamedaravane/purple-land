import Phaser from 'phaser';
import { Bubble } from '@objects/Bubble.ts';

export class Aimer extends Phaser.GameObjects.Graphics {
  public readonly scene: Phaser.Scene;
  private readonly fromX: number;
  private readonly fromY: number;
  private readonly color: number;
  private readonly bubble: Bubble;
  private targetX: number = 0;
  private targetY: number = 0;

  constructor(scene: Phaser.Scene, bubble: Bubble) {
    super(scene);

    this.scene = scene;
    this.fromX = bubble.x;
    this.fromY = bubble.y;
    this.color = bubble.color;
    this.bubble = bubble;
    scene.add.existing(this);

    // Register input event listeners
    this.scene.input.on('pointerdown', this.onPointerDown, this);
    this.scene.input.on('pointermove', this.onPointerMove, this);
    this.scene.input.on('pointerup', this.onPointerUp, this);
  }

  onPointerDown() {
    this.clear();
  }

  onPointerMove(pointer: Phaser.Input.Pointer) {
    if (pointer.isDown) {
      this.clear();

      this.lineStyle(2, this.color);

      const dashLength = 10;
      const gapLength = 5;

      this.drawDashedLine(
        this.fromX,
        this.fromY,
        pointer.x,
        pointer.y,
        dashLength,
        gapLength,
      );

      // Store the last known pointer position for the shot
      this.targetX = pointer.x;
      this.targetY = pointer.y;

      // Extend the dashed line to the outside of the viewport
      const angle = Phaser.Math.Angle.Between(
        this.fromX,
        this.fromY,
        pointer.x,
        pointer.y,
      );
      const viewportDiagonal = Math.sqrt(
        Math.pow(this.scene.scale.width, 2) +
          Math.pow(this.scene.scale.height, 2),
      );
      const extendedX = pointer.x + Math.cos(angle) * viewportDiagonal;
      const extendedY = pointer.y + Math.sin(angle) * viewportDiagonal;

      this.drawDashedLine(
        pointer.x,
        pointer.y,
        extendedX,
        extendedY,
        dashLength,
        gapLength,
      );
    }
  }

  onPointerUp() {
    this.clear();
    if (this.targetX !== 0 && this.targetY !== 0) {
      this.bubble.shot({ x: this.targetX, y: this.targetY });
    }
  }

  drawDashedLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    dashLength: number,
    gapLength: number,
  ) {
    const totalLength = Phaser.Math.Distance.Between(x1, y1, x2, y2);
    const angle = Phaser.Math.Angle.Between(x1, y1, x2, y2);

    let remainingLength = totalLength;
    let currentX = x1;
    let currentY = y1;

    while (remainingLength > 0) {
      const segmentLength = Math.min(dashLength, remainingLength);

      const nextX = currentX + Math.cos(angle) * segmentLength;
      const nextY = currentY + Math.sin(angle) * segmentLength;

      // Draw the dashed segment
      this.moveTo(currentX, currentY);
      this.lineTo(nextX, nextY);

      remainingLength -= dashLength;

      // Skip the gap
      currentX = nextX + Math.cos(angle) * gapLength;
      currentY = nextY + Math.sin(angle) * gapLength;
      remainingLength -= gapLength;
    }

    this.strokePath();
  }
}
