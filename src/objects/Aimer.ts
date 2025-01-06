import Phaser from 'phaser';

export class Aimer {
  private scene: Phaser.Scene;
  private shooterX: number;
  private shooterY: number;
  private aimerGraphics: Phaser.GameObjects.Graphics;
  private readonly lineLength: number;
  private angle: number; // In radians
  private isCharging: boolean = false;
  private chargeStartTime: number = 0;
  private maxChargeTime: number = 2000; // 2 seconds
  private chargeMultiplier: number = 2;
  private readonly bubblePreview: Phaser.GameObjects.Sprite;

  constructor(
    scene: Phaser.Scene,
    shooterX: number,
    shooterY: number,
    lineLength: number = 100,
  ) {
    this.scene = scene;
    this.shooterX = shooterX;
    this.shooterY = shooterY;
    this.lineLength = lineLength;
    this.angle = -Math.PI / 2; // Default to upward

    // Initialize graphics
    this.aimerGraphics = this.scene.add.graphics();
    this.aimerGraphics.setPosition(this.shooterX, this.shooterY);
    this.drawAimer();

    // Initialize bubble preview
    this.bubblePreview = this.scene.add.sprite(0, 0, 'bubble_preview');
    this.bubblePreview.setAlpha(0.5);
    this.bubblePreview.setScale(0.5);
    this.aimerGraphics.setBelow(this.bubblePreview);

    // Set up input handling
    this.scene.input.on('pointermove', this.updateAngle, this);
    this.scene.input.on('pointerdown', this.startCharging, this);
    this.scene.input.on('pointerup', this.releaseCharge, this);
  }

  // Draw the aiming line and bubble preview
  private drawAimer(): void {
    this.aimerGraphics.clear();
    this.aimerGraphics.lineStyle(2, 0xff0000, 1); // Red line
    this.aimerGraphics.beginPath();
    const endX = this.lineLength * Math.cos(this.angle);
    const endY = this.lineLength * Math.sin(this.angle);
    this.aimerGraphics.moveTo(0, 0);
    this.aimerGraphics.lineTo(endX, endY);
    this.aimerGraphics.strokePath();

    // Update bubble preview position
    this.bubblePreview.setPosition(endX, endY);
  }

  // Update the aiming angle based on pointer position
  private updateAngle(pointer: Phaser.Input.Pointer): void {
    if (this.isCharging) return; // Don't update angle while charging

    const dx = pointer.x - this.shooterX;
    const dy = pointer.y - this.shooterY;
    let angle = Math.atan2(dy, dx);

    // Apply angle constraints (e.g., between -75 degrees and 75 degrees)
    const minAngle = Phaser.Math.DegToRad(-75);
    const maxAngle = Phaser.Math.DegToRad(75);

    if (angle < minAngle) angle = minAngle;
    if (angle > maxAngle) angle = maxAngle;

    this.angle = angle;
    this.drawAimer();
  }

  // Start charging the shot
  private startCharging(pointer: Phaser.Input.Pointer): void {
    this.isCharging = true;
    this.chargeStartTime = this.scene.time.now;
  }

  // Release charge and shoot bubble
  private releaseCharge(pointer: Phaser.Input.Pointer): void {
    if (this.isCharging) {
      this.isCharging = false;
      const chargeDuration = this.scene.time.now - this.chargeStartTime;
      const chargeFactor =
        Phaser.Math.Clamp(chargeDuration / this.maxChargeTime, 0, 1) *
        this.chargeMultiplier;

      // Emit shootBubble event with direction and charge
      this.scene.events.emit('shootBubble', {
        direction: this.getDirection(),
        charge: chargeFactor,
      });
    }
  }

  // Method to retrieve the shooting direction vector
  public getDirection(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(Math.cos(this.angle), Math.sin(this.angle));
  }

  // Optionally, update the aimer if the shooter moves
  public updateShooterPosition(x: number, y: number): void {
    this.shooterX = x;
    this.shooterY = y;
    this.aimerGraphics.setPosition(this.shooterX, this.shooterY);
    this.drawAimer();
  }

  // Clean up
  public destroy(): void {
    this.aimerGraphics.destroy();
    this.scene.input.off('pointermove', this.updateAngle, this);
    this.scene.input.off('pointerdown', this.startCharging, this);
    this.scene.input.off('pointerup', this.releaseCharge, this);
  }
}
