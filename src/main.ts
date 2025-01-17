import Phaser from 'phaser';
import BootScene from '@scenes/BootScene.ts';
import GameScene from '@scenes/GameScene.ts';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 390,
  height: 844,
  pixelArt: false,
  title: 'Purple Land',
  scene: [BootScene, GameScene],
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});
