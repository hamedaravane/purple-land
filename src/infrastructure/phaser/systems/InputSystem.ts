import Phaser from "phaser";

/**
 * A fully functional InputSystem that handles swipe gestures:
 * - pointerdown sets start position
 * - pointerup sets end position
 * - fires a callback with (start, end)
 */
export class InputSystem {
  private swipeStart: { x: number; y: number } | null = null;
  private swipeEnd: { x: number; y: number } | null = null;

  constructor(
    private scene: Phaser.Scene,
    private onSwipeCallback: (start: { x: number; y: number }, end: { x: number; y: number }) => void
  ) {}

  setup(): void {
    // Listen for pointer down
    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.swipeStart = { x: pointer.x, y: pointer.y };
    });

    // Listen for pointer up
    this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (this.swipeStart) {
        this.swipeEnd = { x: pointer.x, y: pointer.y };
        this.onSwipeCallback(this.swipeStart, this.swipeEnd);
        this.swipeStart = null;
        this.swipeEnd = null;
      }
    });
  }
}