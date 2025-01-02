import Phaser from 'phaser';

/**
 * Possible types that may appear in Phaser's overlap/collision callbacks.
 * We combine several relevant Arcade types:
 *  - GameObjectWithBody
 *  - Body
 *  - StaticBody
 *  - Tile
 */
export type ArcadeObject =
  | Phaser.Types.Physics.Arcade.GameObjectWithBody
  | Phaser.Physics.Arcade.Body
  | Phaser.Physics.Arcade.StaticBody
  | Phaser.Tilemaps.Tile;
