import Phaser from 'phaser';
import { PositionOrDirection } from '@shared/types';

export class TapInputSystem {
  private isPointerDown = false;
  private graphics: Phaser.GameObjects.Graphics;

  constructor(
    private scene: Phaser.Scene,
    private shootingBubblePosition: PositionOrDirection | null = null,
  ) {
    this.graphics = this.scene.add.graphics();
  }

  setup(): void {
    this.scene.input.on('pointerdown', () => {
      this.isPointerDown = true;
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isPointerDown && this.shootingBubblePosition) {
        this.drawDashedLine(this.shootingBubblePosition, {
          x: pointer.x,
          y: pointer.y,
        });
      }
    });

    this.scene.input.on('pointerup', () => {
      this.isPointerDown = false;
      this.clearLine();
    });
  }

  private drawDashedLine(
    start: PositionOrDirection,
    end: PositionOrDirection,
  ): void {
    const dashLength = 10;
    const gapLength = 5;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const dashCount = Math.floor(distance / (dashLength + gapLength));

    this.graphics.clear();
    this.graphics.lineStyle(2, 0xffffff, 0.6);

    for (let i = 0; i < dashCount; i++) {
      const tStart = i / dashCount;
      const tEnd = (i + 0.5) / dashCount;

      const xStart = Phaser.Math.Interpolation.Linear([start.x, end.x], tStart);
      const yStart = Phaser.Math.Interpolation.Linear([start.y, end.y], tStart);
      const xEnd = Phaser.Math.Interpolation.Linear([start.x, end.x], tEnd);
      const yEnd = Phaser.Math.Interpolation.Linear([start.y, end.y], tEnd);

      this.graphics.beginPath();
      this.graphics.moveTo(xStart, yStart);
      this.graphics.lineTo(xEnd, yEnd);
      this.graphics.strokePath();
    }
  }

  private clearLine(): void {
    this.graphics.clear();
  }
}
