import { Bubble } from '@objects/Bubble';

export class BubbleManager {
  scene: Phaser.Scene;
  bubblesGroup: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.bubblesGroup = this.scene.add.group();
  }

  addExistingBubble(bubble: Bubble) {
    this.bubblesGroup.add(bubble);
    return bubble;
  }

  removeBubble(bubble: Bubble) {
    this.bubblesGroup.remove(bubble, true, true);
  }

  // checkCollisionsForBubbleGroup(shootingBubble: Bubble) {
  //   this.bubblesGroupChildren.forEach((targetBubble) => {
  //     this.addCollider(shootingBubble, targetBubble);
  //   });
  // }

  checkOverlapForBubbleGroup(shootingBubble: Bubble) {
    this.bubblesGroupChildren.forEach((targetBubble) => {
      this.addOverlap(shootingBubble, targetBubble);
    });
  }

  // private addCollider(shootingBubble: Bubble, targetBubble: Bubble) {
  //   this.scene.physics.add.collider(
  //     shootingBubble,
  //     targetBubble,
  //     this.onCollider,
  //     undefined,
  //     this,
  //   );
  // }

  private addOverlap(shootingBubble: Bubble, targetBubble: Bubble) {
    this.scene.physics.add.overlap(
      shootingBubble,
      targetBubble,
      this.onOverlap,
      undefined,
      this,
    );
  }

  get bubblesGroupChildren() {
    return this.bubblesGroup.getChildren() as Bubble[];
  }

  private onOverlap: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = () => {
    console.log('an overlap detected!');
  };

  // private onCollider: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback =
  //   () => {
  //     console.log('a collision detected!');
  //   };
}
