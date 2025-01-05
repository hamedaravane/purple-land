import Phaser from 'phaser';

/**
 * Represents data passed when restarting the scene (e.g., Game Over).
 */
/* interface SceneData {
  gameOver?: boolean;
  finalScore?: number;
} */

/**
 * BubbleShooterScene:
 * Manages the main gameplay mechanics for the bubble shooter game using a hexagonal grid.
 */
export class BubbleShooterScene extends Phaser.Scene {
  private popSound: Phaser.Sound.BaseSound;
  private shootSound: Phaser.Sound.BaseSound;
  private scoreText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private score = 0;
  private level = 1;

  constructor() {
    super({ key: 'BubbleShooterScene' });
  }

  /**
   * Preloads all necessary assets for the scene.
   */
  public preload() {
    // Load the bubbles spritesheet
    this.load.spritesheet('bubbles', 'assets/images/bubbles.png', {
      frameWidth: 64,
      frameHeight: 64,
      margin: 4,
      spacing: 4,
    });

    // Load audio files
    this.load.audio('pop', 'assets/audio/pop.wav');
    this.load.audio('shoot', 'assets/audio/shoot.wav');
  }

  /**
   * Creates game objects and initializes the scene.
   */
  public create() {
    this.createAudio();
    this.createUI();
    this.createTiles();
    this.createInitialBubbles();
    this.createShooterBubble();
    this.createAimer();
  }

  public update(time: number, delta: number) {
    console.log(`on update scene, time ${time} and delta: ${delta}`);
    console.log(`on update scene, popSound: ${this.popSound}`);
    console.log(`on update scene, shootSound: ${this.shootSound}`);
    console.log(`on update scene, scoreText: ${this.scoreText}`);
    console.log(`on update scene, levelText: ${this.levelText}`);
  }

  /**
   * Initializes audio objects.
   */
  private createAudio() {
    this.popSound = this.sound.add('pop');
    this.shootSound = this.sound.add('shoot');
  }

  /**
   * Creates UI elements like score and level displays.
   */
  private createUI() {
    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.levelText = this.add.text(10, 40, `Level: ${this.level}`, {
      fontSize: '24px',
      color: '#ffffff',
    });
  }

  /**
   * Sets up the hexagonal grid of tiles.
   */
  private createTiles() {}

  /**
   * Creates the initial bubbles on the grid.
   */
  private createInitialBubbles() {}

  /**
   * Creates the shooter bubble at the bottom center of the screen.
   */
  private createShooterBubble() {}

  /**
   * Creates the aimer for aiming and shooting bubbles.
   */
  private createAimer() {}
}
