import Phaser from 'phaser';

export class TapInputSystem {
  private isPointerDown = false;
  private startPos: { x: number; y: number } | null = null;

  constructor(
    private scene: Phaser.Scene,
    private onTapRelease: (endPos: { x: number; y: number }) => void,
    private onLineDraw?: (
      start: { x: number; y: number },
      end: { x: number; y: number },
    ) => void,
  ) {}

  setup(): void {
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.isPointerDown = true;
      this.startPos = { x: pointer.x, y: pointer.y };
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isPointerDown && this.startPos && this.onLineDraw) {
        this.onLineDraw(this.startPos, { x: pointer.x, y: pointer.y });
      }
    });

    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      this.isPointerDown = false;
      if (this.startPos) {
        this.onTapRelease({ x: pointer.x, y: pointer.y });
        this.startPos = null;
      }
    });
  }
}
