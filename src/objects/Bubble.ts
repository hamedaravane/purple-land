import { Physics } from 'phaser';
import { Hexagon } from './Hexagon.ts';

/**
 * Enum representing possible bubble states.
 */
export enum BubbleState {
  Idle = 'IDLE',
  Moving = 'MOVING',
  Bursting = 'BURSTING',
  Frozen = 'FROZEN',
  // Add more states as needed
}

/**
 * Enum representing special bubble types.
 */
export enum BubbleType {
  Normal = 'NORMAL',
  Bomb = 'BOMB',
  Freeze = 'FREEZE',
  // Add more special types as needed
}

/**
 * Represents a bubble in the game.
 */
export class Bubble extends Physics.Arcade.Sprite {
  private readonly _color: number;
  private readonly _type: BubbleType;
  private _tile: Hexagon | null = null;
  private _state: BubbleState = BubbleState.Idle;
  public specialProperties: string[] = [];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: number,
    color: number,
    type: BubbleType = BubbleType.Normal,
  ) {
    super(scene, x, y, texture, frame);
    this._color = color;
    this._type = type;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setInteractive();
    this.setOrigin(0.5, 0.5);
    this.setCircle(this.width / 2);
  }

  /**
   * Gets the color of the bubble.
   */
  public get color(): number {
    return this._color;
  }

  /**
   * Gets the type of the bubble.
   */
  public get bubbleType(): BubbleType {
    return this._type;
  }

  public get tile(): Hexagon | null {
    return this._tile;
  }

  /**
   * Gets the current state of the bubble.
   */
  public get bubbleState(): BubbleState {
    return this._state;
  }

  /**
   * Sets the current state of the bubble.
   * @param newState The new state to set.
   */
  public setBubbleState(newState: BubbleState): void {
    this._state = newState;
    switch (newState) {
      case BubbleState.Bursting:
        this.burst();
        break;
      default:
        break;
    }
  }

  /**
   * Assigns the bubble to a tile.
   * @param tile The tile to assign to.
   */
  public setTile(tile: Hexagon): void {
    if (this._tile) {
      this._tile.removeBubble();
    }
    this._tile = tile;
    this._tile.placeBubble(this);
    this.setPosition(tile.x, tile.y);
  }

  /**
   * Moves the bubble to a new tile.
   * @param targetTile The tile to move to.
   */
  public moveToTile(targetTile: Hexagon): void {
    this.setBubbleState(BubbleState.Moving);
    this.scene.tweens.add({
      targets: this,
      x: targetTile.x,
      y: targetTile.y,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.setTile(targetTile);
        this.setBubbleState(BubbleState.Idle);
      },
    });
  }

  /**
   * Handles the bursting of the bubble.
   */
  private burst(): void {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      scaleY: 0,
      duration: 200,
      onComplete: () => {
        this.destroy();
        if (this._tile) {
          this._tile.removeBubble();
        }
      },
    });
  }

  /**
   * Applies a special property to the bubble.
   * @param property The special property to apply.
   */
  public applySpecialProperty(property: string): void {
    this.specialProperties.push(property);
    switch (property) {
      case 'bomb':
        // Implement bomb effect
        break;
      case 'freeze':
        // Implement freeze effect
        break;
      // Add more cases as needed
      default:
        console.log(`Unknown special property: ${property}`);
    }
  }

  /**
   * Checks if the bubble can be matched with others based on color or type.
   * @param otherBubble The other bubble to check against.
   * @returns True if it can be matched, false otherwise.
   */
  public canMatch(otherBubble: Bubble): boolean {
    return (
      this.color === otherBubble.color || this.bubbleType !== BubbleType.Normal
    );
  }
}
