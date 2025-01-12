import Phaser from 'phaser';
import BootScene from '@scenes/BootScene.ts';
import GameScene from '@scenes/GameScene.ts';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 360,
  height: 800,
  pixelArt: false,
  title: 'Purple Land',
  scene: [BootScene, GameScene],
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});
