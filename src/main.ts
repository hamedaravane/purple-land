import { Game, Types } from 'phaser';
import { BubbleShooterScene } from './scenes/BubbleShooterScene.ts';

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  parent: 'game-container',
  backgroundColor: 'transparent',
  scale: {
    mode: Phaser.Scale.EXPAND,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BubbleShooterScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
};

export default new Game(config);
