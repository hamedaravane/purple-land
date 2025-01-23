import { BubbleManager } from '@managers/BubbleManager.ts';

export default class GameScene extends Phaser.Scene {
  bubbleManager: BubbleManager;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
    this.bubbleManager = new BubbleManager(this, 10, 14);
    this.bubbleManager.createGrid();
    this.bubbleManager.spawnNewShootingBubble();
  }

  update() {
    this.bubbleManager.checkCollision();
  }
}
