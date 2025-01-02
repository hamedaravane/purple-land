import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { Orb } from '../objects/Orb';
import { GlitchWave } from '../objects/GlitchWave';
import { ArcadeObject } from '../types/ArcadeTypes'; // <-- Import the union type

export class MainScene extends Phaser.Scene {
  private player!: Player;
  private orbsGroup!: Phaser.Physics.Arcade.Group;
  private glitchWave!: GlitchWave;
  private scoreText!: Phaser.GameObjects.Text;
  private score: number = 0;

  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    this.player = new Player(
      this,
      this.scale.width / 2,
      this.scale.height - 100,
    );

    // 2. Create Orbs Group (Arcade Physics Group)
    this.orbsGroup = this.physics.add.group({
      classType: Orb,
      runChildUpdate: true,
    });
    this.spawnOrbs();

    // 3. Create Glitch Wave
    this.glitchWave = new GlitchWave(this, 0, this.scale.height);

    // 4. Setup Score Text
    this.scoreText = this.add
      .text(20, 20, 'Score: 0', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
      })
      .setScrollFactor(0);

    // 5. Input Event (Tap/Click to move player)
    this.input.on('pointerdown', () => {
      this.player.moveForward();
    });
  }

  update(time: number, delta: number): void {
    // Move the glitch wave
    this.glitchWave.updateWave(delta);

    // Overlap between player & orbs; pass 'handleOrbCollection' directly
    this.physics.overlap(
      this.player,
      this.orbsGroup,
      this.handleOrbCollection,
      undefined,
      this,
    );

    // Check if glitch wave caught the player
    if (this.glitchWave.checkPlayerCollision(this.player)) {
      this.endGame();
    }

    // Possibly spawn new orbs or safe zones over time...
  }

  private spawnOrbs(): void {
    // Example: spawn 5 orbs randomly
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(50, this.scale.width - 50);
      const y = Phaser.Math.Between(50, this.scale.height - 200);
      const orb = this.orbsGroup.get(x, y) as Orb;
      orb.activate();
    }
  }

  /**
   * Matches the broad union of types Arcade can pass:
   *  (object1: Body|Tile|GameObjectWithBody|StaticBody, object2: Body|Tile|GameObjectWithBody|StaticBody) => void
   */
  private handleOrbCollection(
    object1: ArcadeObject,
    object2: ArcadeObject,
  ): void {
    /**
     * We only expect to have a Player + an Orb here, so we can type-narrow:
     * 1) If it's a Body, check if 'gameObject' is a Player or Orb
     * 2) If it's a GameObjectWithBody, we can cast to Player/Orb
     * 3) If it's a Tile or StaticBody, ignore/return
     */

    // 1) Convert (or check) object1 => Player
    let maybePlayer: Player | null = null;
    if (object1 instanceof Phaser.Physics.Arcade.Body && object1.gameObject) {
      // If object1 is a Body, see if its 'gameObject' is a Player
      if (object1.gameObject instanceof Player) {
        maybePlayer = object1.gameObject;
      }
    } else if (object1 instanceof Player) {
      // If it's directly an instance of Player
      maybePlayer = object1;
    }

    // 2) Convert object2 => Orb
    let maybeOrb: Orb | null = null;
    if (object2 instanceof Phaser.Physics.Arcade.Body && object2.gameObject) {
      if (object2.gameObject instanceof Orb) {
        maybeOrb = object2.gameObject;
      }
    } else if (object2 instanceof Orb) {
      maybeOrb = object2;
    }

    // If we found a real Player + Orb, perform the collection logic
    if (maybePlayer && maybeOrb) {
      maybeOrb.collect();
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
    }
  }

  private endGame(): void {
    // Simple approach: restart the scene
    this.scene.restart();
  }
}
