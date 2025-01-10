import Phaser from 'phaser';
import BootScene from '@scenes/BootScene.ts';
import GameScene from '@scenes/GameScene.ts';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  scene: [BootScene, GameScene],
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: NaN, y: 0 } },
  },
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});
