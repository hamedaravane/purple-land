import Phaser from 'phaser';

export const GAME_WIDTH = 1080;
export const GAME_HEIGHT = 1920;

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#0f022a',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game-container',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  render: {
    pixelArt: false,
    antialias: true,
  },
};