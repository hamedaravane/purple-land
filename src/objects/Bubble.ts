import { Physics } from 'phaser';
import { Tile } from '@objects/Tile.ts';

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
  private _tile: Tile | null = null;
  private _state: BubbleState = BubbleState.Idle;

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

  public get tile(): Tile | null {
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
  public setTile(tile: Tile): void {
    this._tile = tile;
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
      },
    });
  }

  /**
   * Additional methods for special properties can be added here.
   */
}
