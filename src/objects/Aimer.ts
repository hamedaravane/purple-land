import Phaser from 'phaser';
import { Bubble } from '@objects/Bubble';

export class Aimer extends Phaser.GameObjects.Graphics {
  private readonly fromX: number;
  private readonly fromY: number;
  private readonly color: number;
  private readonly bubble: Bubble;
  private targetX = 0;
  private targetY = 0;
  private readonly dashLength = 10;
  private readonly gapLength = 5;

  constructor(scene: Phaser.Scene, bubble: Bubble) {
    super(scene);
    this.fromX = bubble.x;
    this.fromY = bubble.y;
    this.color = bubble.color;
    this.bubble = bubble;
    scene.add.existing(this);
    this.registerInputListeners();
  }

  private registerInputListeners() {
    this.scene.input.on('pointerdown', this.onPointerDown, this);
    this.scene.input.on('pointermove', this.onPointerMove, this);
    this.scene.input.on('pointerup', this.onPointerUp, this);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    this.clear();
    this.updateTargetPosition(pointer);
    this.drawAimLine(pointer);
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (pointer.isDown) {
      this.clear();
      this.updateTargetPosition(pointer);
      this.drawAimLine(pointer);
    }
  }

  private onPointerUp() {
    this.clear();
    if (this.targetX && this.targetY) {
      this.bubble.shot({ x: this.targetX, y: this.targetY });
    }
  }

  private updateTargetPosition(pointer: Phaser.Input.Pointer) {
    this.targetX = pointer.x;
    this.targetY = pointer.y;
  }

  private drawAimLine(pointer: Phaser.Input.Pointer) {
    this.lineStyle(1, this.color);
    this.drawDashedLine(this.fromX, this.fromY, pointer.x, pointer.y);
    const angle = Phaser.Math.Angle.Between(
      this.fromX,
      this.fromY,
      pointer.x,
      pointer.y,
    );
    const diag = Math.sqrt(
      this.scene.scale.width ** 2 + this.scene.scale.height ** 2,
    );
    const extX = pointer.x + Math.cos(angle) * diag;
    const extY = pointer.y + Math.sin(angle) * diag;
    this.drawDashedLine(pointer.x, pointer.y, extX, extY);
  }

  private drawDashedLine(x1: number, y1: number, x2: number, y2: number) {
    const length = Phaser.Math.Distance.Between(x1, y1, x2, y2);
    const angle = Phaser.Math.Angle.Between(x1, y1, x2, y2);
    let remaining = length;
    let cx = x1;
    let cy = y1;
    while (remaining > 0) {
      const seg = Math.min(this.dashLength, remaining);
      const nx = cx + Math.cos(angle) * seg;
      const ny = cy + Math.sin(angle) * seg;
      this.moveTo(cx, cy);
      this.lineTo(nx, ny);
      remaining -= this.dashLength;
      cx = nx + Math.cos(angle) * this.gapLength;
      cy = ny + Math.sin(angle) * this.gapLength;
      remaining -= this.gapLength;
    }
    this.strokePath();
  }
}
