import Phaser from 'phaser';
import { Bubble } from '@objects/Bubble.ts';

export class Aimer extends Phaser.GameObjects.Graphics {
  private readonly fromX: number;
  private readonly fromY: number;
  private readonly color: number;
  private readonly bubble: Bubble;
  private targetX: number = 0;
  private targetY: number = 0;
  private readonly dashLength: number = 10;
  private readonly gapLength: number = 5;

  constructor(scene: Phaser.Scene, bubble: Bubble) {
    super(scene);

    this.fromX = bubble.x;
    this.fromY = bubble.y;
    this.color = bubble.color;
    this.bubble = bubble;
    scene.add.existing(this);

    this.registerInputListeners();
  }

  /**
   * Registers input event listeners for drawing the aim line and shooting.
   */
  private registerInputListeners() {
    this.scene.input.on('pointerdown', this.onPointerDown, this);
    this.scene.input.on('pointermove', this.onPointerMove, this);
    this.scene.input.on('pointerup', this.onPointerUp, this);
  }

  /**
   * Handles the pointer down event to prepare the drawing.
   */
  private onPointerDown(pointer: Phaser.Input.Pointer) {
    this.clear();
    this.updateTargetPosition(pointer);
    this.drawAimLine(pointer);
  }

  /**
   * Handles the pointer move event to update the aim line dynamically.
   */
  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (pointer.isDown) {
      this.clear();
      this.updateTargetPosition(pointer);
      this.drawAimLine(pointer);
    }
  }

  /**
   * Handles the pointer up event to clear the aim line and shoot the bubble.
   */
  private onPointerUp() {
    this.clear();
    if (this.targetX && this.targetY) {
      this.bubble.shot({ x: this.targetX, y: this.targetY });
    }
  }

  /**
   * Updates the target position based on the pointer's current position.
   */
  private updateTargetPosition(pointer: Phaser.Input.Pointer) {
    this.targetX = pointer.x;
    this.targetY = pointer.y;
  }

  /**
   * Draws the aim line from the bubble's position to the pointer's position.
   */
  private drawAimLine(pointer: Phaser.Input.Pointer) {
    this.lineStyle(2, this.color);
    this.drawDashedLine(this.fromX, this.fromY, pointer.x, pointer.y);

    const angle = Phaser.Math.Angle.Between(
      this.fromX,
      this.fromY,
      pointer.x,
      pointer.y,
    );
    const viewportDiagonal = Math.sqrt(
      this.scene.scale.width ** 2 + this.scene.scale.height ** 2,
    );
    const extendedX = pointer.x + Math.cos(angle) * viewportDiagonal;
    const extendedY = pointer.y + Math.sin(angle) * viewportDiagonal;

    this.drawDashedLine(pointer.x, pointer.y, extendedX, extendedY);
  }

  /**
   * Draws a dashed line between two points.
   */
  private drawDashedLine(x1: number, y1: number, x2: number, y2: number) {
    const totalLength = Phaser.Math.Distance.Between(x1, y1, x2, y2);
    const angle = Phaser.Math.Angle.Between(x1, y1, x2, y2);

    let remainingLength = totalLength;
    let currentX = x1;
    let currentY = y1;

    while (remainingLength > 0) {
      const segmentLength = Math.min(this.dashLength, remainingLength);
      const nextX = currentX + Math.cos(angle) * segmentLength;
      const nextY = currentY + Math.sin(angle) * segmentLength;

      this.moveTo(currentX, currentY);
      this.lineTo(nextX, nextY);

      remainingLength -= this.dashLength;

      currentX = nextX + Math.cos(angle) * this.gapLength;
      currentY = nextY + Math.sin(angle) * this.gapLength;
      remainingLength -= this.gapLength;
    }

    this.strokePath();
  }
}
