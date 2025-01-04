import { GameObjects, Input, Scene } from 'phaser';

export class Aimer extends GameObjects.Graphics {
  private readonly startX: number;
  private readonly startY: number;
  private endX: number;
  private endY: number;
  private isAiming: boolean = false;

  constructor(scene: Scene, startX: number, startY: number) {
    super(scene, { x: startX, y: startY });
    this.startX = startX;
    this.startY = startY;
    this.endX = startX;
    this.endY = startY;
    scene.add.existing(this);
  }

  /**
   * Begins the aiming process.
   * @param pointer The pointer event.
   */
  public startAiming(pointer: Input.Pointer): void {
    this.isAiming = true;
    this.updateAim(pointer);
  }

  /**
   * Updates the aim direction.
   * @param pointer The pointer event.
   */
  public updateAim(pointer: Input.Pointer): void {
    if (!this.isAiming) return;
    this.endX = pointer.x;
    this.endY = pointer.y;
    this.drawAim();
  }

  /**
   * Ends the aiming process.
   */
  public endAiming(): { dx: number; dy: number } {
    this.isAiming = false;
    this.clear();
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    return { dx, dy };
  }

  /**
   * Draws the aiming trajectory.
   */
  private drawAim(): void {
    this.clear();
    this.lineStyle(4, 0xffffff, 1);
    this.beginPath();
    this.moveTo(this.startX, this.startY);
    this.lineTo(this.endX, this.endY);
    this.strokePath();
  }
}
