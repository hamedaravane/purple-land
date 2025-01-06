// Aimer.ts

import Phaser from 'phaser';

interface AimerConfig {
  shooterX: number;
  shooterY: number;
  lineLength?: number;
  maxChargeTime?: number; // in milliseconds
  chargeMultiplier?: number;
  bubblePreviewKey?: string;
  angleConstraints?: {
    min: number; // in radians
    max: number; // in radians
  };
}

export class Aimer {
  private scene: Phaser.Scene;
  private shooterX: number;
  private shooterY: number;
  private aimerGraphics: Phaser.GameObjects.Graphics;
  private readonly lineLength: number;
  private angle: number; // In radians
  private isCharging: boolean = false;
  private chargeStartTime: number = 0;
  private readonly maxChargeTime: number;
  private readonly chargeMultiplier: number;
  private readonly bubblePreview?: Phaser.GameObjects.Sprite;
  private readonly minAngle: number;
  private readonly maxAngle: number;

  // Bound methods to ensure proper removal
  private boundUpdateAngle: (pointer: Phaser.Input.Pointer) => void;
  private boundStartCharging: (pointer: Phaser.Input.Pointer) => void;
  private boundReleaseCharge: (pointer: Phaser.Input.Pointer) => void;

  constructor(scene: Phaser.Scene, config: AimerConfig) {
    this.scene = scene;
    this.shooterX = config.shooterX;
    this.shooterY = config.shooterY;
    this.lineLength = config.lineLength ?? 100;
    this.maxChargeTime = config.maxChargeTime ?? 2000; // Default to 2 seconds
    this.chargeMultiplier = config.chargeMultiplier ?? 2;
    this.minAngle = config.angleConstraints?.min ?? Phaser.Math.DegToRad(-75);
    this.maxAngle = config.angleConstraints?.max ?? Phaser.Math.DegToRad(75);

    // Initialize angle within constraints
    this.angle = Phaser.Math.Clamp(
      -Phaser.Math.DegToRad(90),
      this.minAngle,
      this.maxAngle,
    );

    // Initialize graphics
    this.aimerGraphics = this.scene.add.graphics();
    this.aimerGraphics.setPosition(this.shooterX, this.shooterY);
    this.aimerGraphics.setDepth(1); // Ensure it's above other elements

    // Initialize bubble preview if texture exists
    const bubblePreviewKey = config.bubblePreviewKey ?? 'bubble_preview';
    if (this.scene.textures.exists(bubblePreviewKey)) {
      this.bubblePreview = this.scene.add.sprite(0, 0, bubblePreviewKey);
      this.bubblePreview.setAlpha(0.5);
      this.bubblePreview.setScale(0.5);
      this.bubblePreview.setDepth(0); // Ensure it's below the aimer graphics
      this.bubblePreview.setVisible(true);
    } else {
      console.warn(
        `Texture "${bubblePreviewKey}" not found. Bubble preview will not be displayed.`,
      );
    }

    // Now, draw the aimer after initializing bubblePreview
    this.drawAimer();

    // Set up input handling with bound methods
    this.boundUpdateAngle = this.updateAngle.bind(this);
    this.boundStartCharging = this.startCharging.bind(this);
    this.boundReleaseCharge = this.releaseCharge.bind(this);

    this.scene.input.on('pointermove', this.boundUpdateAngle);
    this.scene.input.on('pointerdown', this.boundStartCharging);
    this.scene.input.on('pointerup', this.boundReleaseCharge);
  }

  /**
   * Draws the aiming line and positions the bubble preview.
   */
  private drawAimer(): void {
    this.aimerGraphics.clear();
    this.aimerGraphics.lineStyle(2, 0xff0000, 1); // Red line
    this.aimerGraphics.beginPath();

    const endX = this.lineLength * Math.cos(this.angle);
    const endY = this.lineLength * Math.sin(this.angle);
    this.aimerGraphics.moveTo(0, 0);
    this.aimerGraphics.lineTo(endX, endY);
    this.aimerGraphics.strokePath();
    this.aimerGraphics.closePath();

    // Update bubble preview position ONLY if it exists and is visible
    if (this.bubblePreview && this.bubblePreview.visible) {
      this.bubblePreview.setPosition(endX, endY);
    }
  }

  /**
   * Updates the aiming angle based on the pointer's current position.
   * @param _pointer The current pointer (unused).
   */
  private updateAngle(_pointer: Phaser.Input.Pointer): void {
    if (this.isCharging) return; // Don't update angle while charging

    const pointer = this.scene.input.activePointer;
    const dx = pointer.worldX - this.shooterX;
    const dy = pointer.worldY - this.shooterY;
    let angle = Math.atan2(dy, dx);

    // Clamp the angle within the specified constraints
    angle = Phaser.Math.Clamp(angle, this.minAngle, this.maxAngle);

    // Only redraw if the angle has changed significantly to avoid unnecessary renders
    if (Phaser.Math.Angle.Wrap(this.angle) !== Phaser.Math.Angle.Wrap(angle)) {
      this.angle = angle;
      this.drawAimer();
    }
  }

  /**
   * Starts the charging process when the pointer is pressed down.
   * @param _pointer The current pointer (unused).
   */
  private startCharging(_pointer: Phaser.Input.Pointer): void {
    if (this.isCharging) return; // Prevent multiple charging sessions

    this.isCharging = true;
    this.chargeStartTime = this.scene.time.now;

    // Visual feedback for charging (e.g., change line color)
    this.aimerGraphics.lineStyle(2, 0x00ff00, 1); // Green line during charging
    this.drawAimer();
  }

  /**
   * Releases the charge and emits the shoot event.
   * @param _pointer The current pointer (unused).
   */
  private releaseCharge(_pointer: Phaser.Input.Pointer): void {
    if (!this.isCharging) return;

    this.isCharging = false;
    const chargeDuration = this.scene.time.now - this.chargeStartTime;
    const chargeFactor =
      Phaser.Math.Clamp(chargeDuration / this.maxChargeTime, 0, 1) *
      this.chargeMultiplier;

    // Reset line color
    this.aimerGraphics.lineStyle(2, 0xff0000, 1); // Red line
    this.drawAimer();

    // Emit shootBubble event with direction and charge
    this.scene.events.emit('shootBubble', {
      direction: this.getDirection(),
      charge: chargeFactor,
    });
  }

  /**
   * Retrieves the shooting direction as a normalized vector.
   * @returns A Phaser.Math.Vector2 representing the direction.
   */
  public getDirection(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      Math.cos(this.angle),
      Math.sin(this.angle),
    ).normalize();
  }

  /**
   * Updates the shooter's position and repositions the aimer accordingly.
   * @param x New X position of the shooter.
   * @param y New Y position of the shooter.
   */
  public updateShooterPosition(x: number, y: number): void {
    this.shooterX = x;
    this.shooterY = y;
    this.aimerGraphics.setPosition(this.shooterX, this.shooterY);
    this.drawAimer();
  }

  /**
   * Cleans up the aimer by destroying graphics and removing event listeners.
   */
  public destroy(): void {
    this.aimerGraphics.destroy();
    if (this.bubblePreview) {
      this.bubblePreview.destroy();
    }
    this.scene.input.off('pointermove', this.boundUpdateAngle);
    this.scene.input.off('pointerdown', this.boundStartCharging);
    this.scene.input.off('pointerup', this.boundReleaseCharge);
  }
}
