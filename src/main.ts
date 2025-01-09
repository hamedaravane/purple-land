import Phaser from 'phaser';
import { MainScene } from '@infrastructure/phaser/scenes/MainScene.ts';
import { BootScene } from '@infrastructure/phaser/scenes/BootScene.ts';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  scene: [BootScene, MainScene],
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0, x: 1 } },
  },
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});
