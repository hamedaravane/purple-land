import Phaser from 'phaser';
import { Bubble } from '@objects/Bubble';

export class Aimer extends Phaser.GameObjects.Graphics {
  private readonly origin: Phaser.Math.Vector2;
  private readonly bubble: Bubble;
  private readonly dashLength = 10;
  private readonly gapLength = 5;
  private readonly aimColor: number;
  private target: Phaser.Math.Vector2;

  constructor(scene: Phaser.Scene, bubble: Bubble) {
    super(scene);

    this.bubble = bubble;
    this.origin = new Phaser.Math.Vector2(bubble.x, bubble.y);
    this.target = new Phaser.Math.Vector2(0, 0);
    this.aimColor = bubble.color.color;

    scene.add.existing(this);
    this.registerInputListeners();
  }

  /**
   * Register input listeners for pointer events.
   */
  private registerInputListeners() {
    const input = this.scene.input;

    input.on('pointerdown', this.onPointerDown, this);
    input.on('pointermove', this.onPointerMove, this);
    input.on('pointerup', this.onPointerUp, this);
  }

  /**
   * Handle pointer down events (start aiming).
   */
  private onPointerDown(pointer: Phaser.Input.Pointer) {
    this.updateTarget(pointer);
    this.redrawAimingLine(pointer);
  }

  /**
   * Handle pointer move events (update aiming line).
   */
  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (pointer.isDown) {
      this.updateTarget(pointer);
      this.redrawAimingLine(pointer);
    }
  }

  /**
   * Handle pointer up events (fire bubble).
   */
  private onPointerUp() {
    this.clear();

    if (!this.target.equals(this.origin)) {
      this.bubble.shot({ x: this.target.x, y: this.target.y });
    }
  }

  /**
   * Update the target position based on pointer input.
   */
  private updateTarget(pointer: Phaser.Input.Pointer) {
    this.target.set(pointer.x, pointer.y);
  }

  /**
   * Redraw the aiming line.
   */
  private redrawAimingLine(pointer: Phaser.Input.Pointer) {
    this.clear();
    this.lineStyle(1, this.aimColor);

    const angle = Phaser.Math.Angle.Between(this.origin.x, this.origin.y, pointer.x, pointer.y);

    const lineLength = Math.sqrt(Math.pow(this.scene.scale.width, 2) + Math.pow(this.scene.scale.height, 2));

    const extendedTarget = new Phaser.Math.Vector2(
      pointer.x + Math.cos(angle) * lineLength,
      pointer.y + Math.sin(angle) * lineLength,
    );

    // Draw the dashed lines
    this.drawDashedLine(this.origin, new Phaser.Math.Vector2(pointer.x, pointer.y));
    this.drawDashedLine(new Phaser.Math.Vector2(pointer.x, pointer.y), extendedTarget);
  }

  /**
   * Draw a dashed line between two points.
   */
  private drawDashedLine(start: Phaser.Math.Vector2, end: Phaser.Math.Vector2) {
    const totalLength = Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y);
    const angle = Phaser.Math.Angle.Between(start.x, start.y, end.x, end.y);

    let remainingLength = totalLength;
    let currentPoint = start.clone();

    while (remainingLength > 0) {
      const segmentLength = Math.min(this.dashLength, remainingLength);

      const nextPoint = new Phaser.Math.Vector2(
        currentPoint.x + Math.cos(angle) * segmentLength,
        currentPoint.y + Math.sin(angle) * segmentLength,
      );

      this.moveTo(currentPoint.x, currentPoint.y);
      this.lineTo(nextPoint.x, nextPoint.y);

      // Move to the next gap start
      currentPoint.set(
        nextPoint.x + Math.cos(angle) * this.gapLength,
        nextPoint.y + Math.sin(angle) * this.gapLength,
      );

      remainingLength -= this.dashLength + this.gapLength;
    }

    this.strokePath();
  }

  /**
   * Unregister input listeners and destroy the object.
   */
  public destroy(...args: any[]) {
    const input = this.scene.input;

    input.off('pointerdown', this.onPointerDown, this);
    input.off('pointermove', this.onPointerMove, this);
    input.off('pointerup', this.onPointerUp, this);

    super.destroy(...args);
  }
}
