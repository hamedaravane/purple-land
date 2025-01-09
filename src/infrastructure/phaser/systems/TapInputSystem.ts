import Phaser from 'phaser';

export class TapInputSystem {
  private isPointerDown = false;
  private start: { x: number; y: number } | null = null;

  constructor(
    private scene: Phaser.Scene,
    private onTap: (pointerUpPos: { x: number; y: number }) => void,
    private onDrawLine?: (
      start: { x: number; y: number },
      end: { x: number; y: number },
    ) => void,
  ) {}

  setup(): void {
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.isPointerDown = true;
      this.start = { x: pointer.x, y: pointer.y };
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isPointerDown && this.start && this.onDrawLine) {
        this.onDrawLine(this.start, { x: pointer.x, y: pointer.y });
      }
    });

    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      this.isPointerDown = false;
      if (this.start) {
        this.onTap({ x: pointer.x, y: pointer.y });
        this.start = null;
      }
    });
  }
}
