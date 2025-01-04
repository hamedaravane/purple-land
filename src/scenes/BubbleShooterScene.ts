import {
  Scene,
  Physics,
  GameObjects,
  Sound,
  Input,
  Types,
  Math as PhaserMath,
} from 'phaser';

export class BubbleShooterScene extends Scene {
  private grid: Array<Array<Physics.Arcade.Sprite | null>> = [];
  private numRows = 10;
  private numCols = 12;
  private bubbleSize = 64;
  private bubbleColors = 5;
  private descendInterval = 1;

  private score = 0;
  private level = 1;

  private bubbleGroup?: Physics.Arcade.StaticGroup;
  private shooterBubble?: Physics.Arcade.Sprite;

  private scoreText?: GameObjects.Text;
  private levelText?: GameObjects.Text;

  private popSound?: Sound.BaseSound;
  private shootSound?: Sound.BaseSound;

  private initialPointerPos?: { x: number; y: number };
  private finalPointerPos?: { x: number; y: number };

  constructor() {
    super({ key: 'BubbleShooterScene' });
  }

  public preload() {
    this.load.spritesheet('bubbles', '/assets/images/bubbles.png', {
      frameWidth: 64,
      frameHeight: 64,
      margin: 4,
      spacing: 4,
    });
    this.load.audio('pop', '/assets/audio/pop.wav');
    this.load.audio('shoot', '/assets/audio/shoot.wav');
  }

  public create() {
    this.createAudio();
    this.createUI();
    this.createInitialBubbles();
    this.createShooterBubble();
    this.setupInput();
  }

  public update() {}

  private createAudio() {
    this.popSound = this.sound.add('pop');
    this.shootSound = this.sound.add('shoot');
  }

  private createUI() {
    this.scoreText = this.add
      .text(10, 10, `Score: ${this.score}`, {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setDepth(10);

    this.levelText = this.add
      .text(10, 40, `Level: ${this.level}`, {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setDepth(10);
  }

  private setupInput() {
    this.input.on('pointerdown', (pointer: Input.Pointer) => {
      this.initialPointerPos = { x: pointer.x, y: pointer.y };
    });

    this.input.on('pointerup', (pointer: Input.Pointer) => {
      this.finalPointerPos = { x: pointer.x, y: pointer.y };
      this.shootBubble();
    });
  }

  private createInitialBubbles() {
    this.bubbleGroup = this.physics.add.staticGroup();

    for (let row = 0; row < this.numRows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.numCols; col++) {
        const colorIndex = PhaserMath.Between(0, this.bubbleColors - 1);
        const x = col * this.bubbleSize + this.bubbleSize / 2;
        const y = row * this.bubbleSize + this.bubbleSize / 2 + 50;

        const bubble = this.bubbleGroup.create(x, y, 'bubbles', colorIndex);
        bubble.setData('color', colorIndex);
        bubble.setData('row', row);
        bubble.setData('col', col);
        bubble.setCircle(this.bubbleSize / 2);

        this.grid[row][col] = bubble;
      }
    }
  }

  private createShooterBubble() {
    if (this.shooterBubble) {
      this.shooterBubble.destroy();
    }

    const colorIndex = PhaserMath.Between(0, this.bubbleColors - 1);
    const x = this.scale.width / 2;
    const y = this.scale.height - 100;

    this.shooterBubble = this.physics.add.sprite(x, y, 'bubbles', colorIndex);
    this.shooterBubble.setData('color', colorIndex);
    this.shooterBubble.setCircle(this.bubbleSize / 2);
    this.shooterBubble.setDepth(5);
  }

  private shootBubble() {
    if (!this.shooterBubble || !this.bubbleGroup) return;
    if (!this.initialPointerPos || !this.finalPointerPos) return;

    const dx = this.finalPointerPos.x - this.initialPointerPos.x;
    const dy = this.finalPointerPos.y - this.initialPointerPos.y;

    if (dx === 0 && dy === 0) return;

    this.shootSound?.play();

    const speed = 800;
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / magnitude) * speed;
    const vy = (dy / magnitude) * speed;

    this.shooterBubble.setVelocity(vx, vy);

    this.physics.add.collider(
      this.shooterBubble,
      this.bubbleGroup,
      () => this.handleBubbleCollision,
      undefined,
      this,
    );
  }

  private handleBubbleCollision = (
    shot: Types.Physics.Arcade.GameObjectWithBody,
    _static: Types.Physics.Arcade.GameObjectWithBody,
  ) => {
    const shotBubble = shot as Physics.Arcade.Sprite;
    shotBubble.setVelocity(0, 0);
    shotBubble.setImmovable(true);
    shotBubble.body!.immovable = true;

    const { x, y, row, col } = this.getNearestGridPosition(
      shotBubble.x,
      shotBubble.y,
    );
    shotBubble.setPosition(x, y);
    shotBubble.setData('row', row);
    shotBubble.setData('col', col);

    this.bubbleGroup?.add(shotBubble);
    this.grid[row][col] = shotBubble;

    this.checkForMatches(shotBubble);
    this.createShooterBubble();
    this.descendRows();
    this.checkGameOver();
  };

  private getNearestGridPosition(
    x: number,
    y: number,
  ): {
    x: number;
    y: number;
    row: number;
    col: number;
  } {
    let col = Math.round((x - this.bubbleSize / 2) / this.bubbleSize);
    let row = Math.round((y - this.bubbleSize / 2 - 50) / this.bubbleSize);

    col = PhaserMath.Clamp(col, 0, this.numCols - 1);
    row = PhaserMath.Clamp(row, 0, this.numRows - 1);

    return {
      x: col * this.bubbleSize + this.bubbleSize / 2,
      y: row * this.bubbleSize + this.bubbleSize / 2 + 50,
      row,
      col,
    };
  }

  private checkForMatches(shotBubble: Physics.Arcade.Sprite) {
    const color = shotBubble.getData('color') as number;
    const row = shotBubble.getData('row') as number;
    const col = shotBubble.getData('col') as number;

    const stack: Array<{ row: number; col: number }> = [{ row, col }];
    const visited = new Set([`${row},${col}`]);
    const matching: Physics.Arcade.Sprite[] = [];

    while (stack.length > 0) {
      const { row: r, col: c } = stack.pop()!;
      const bubble = this.grid[r][c];
      if (!bubble) continue;

      if ((bubble.getData('color') as number) === color) {
        matching.push(bubble);

        const neighbors = [
          { r: r - 1, c },
          { r: r + 1, c },
          { r, c: c - 1 },
          { r, c: c + 1 },
        ];

        for (const n of neighbors) {
          const key = `${n.r},${n.c}`;
          if (
            n.r >= 0 &&
            n.r < this.numRows &&
            n.c >= 0 &&
            n.c < this.numCols &&
            !visited.has(key) &&
            this.grid[n.r][n.c] != null
          ) {
            stack.push({ row: n.r, col: n.c });
            visited.add(key);
          }
        }
      }
    }

    if (matching.length >= 3) {
      this.popBubbles(matching);
    }
  }

  private popBubbles(bubbles: Physics.Arcade.Sprite[]) {
    this.popSound?.play();

    bubbles.forEach((bubble) => {
      const r = bubble.getData('row') as number;
      const c = bubble.getData('col') as number;

      this.tweens.add({
        targets: bubble,
        scaleX: 0,
        scaleY: 0,
        duration: 200,
        onComplete: () => {
          this.grid[r][c] = null;
          bubble.destroy();
        },
      });
    });

    this.score += bubbles.length * 10;
    this.scoreText?.setText(`Score: ${this.score}`);
  }

  private descendRows() {
    for (let row = this.numRows - 1; row >= 0; row--) {
      for (let col = 0; col < this.numCols; col++) {
        const bubble = this.grid[row][col];
        if (!bubble) continue;

        const newRow = row + this.descendInterval;
        if (newRow < this.numRows) {
          this.grid[newRow][col] = bubble;
          this.grid[row][col] = null;
          bubble.setData('row', newRow);
          bubble.setData('col', col);

          this.tweens.add({
            targets: bubble,
            y: newRow * this.bubbleSize + this.bubbleSize / 2 + 50,
            duration: 300,
          });
        } else {
          bubble.destroy();
          this.grid[row][col] = null;
        }
      }
    }
  }

  private checkGameOver() {
    for (let c = 0; c < this.numCols; c++) {
      if (this.grid[this.numRows - 1][c]) {
        this.handleGameOver();
        return;
      }
    }

    if (this.isGridEmpty()) {
      this.nextLevel();
    }
  }

  private handleGameOver() {
    this.scene.restart({ gameOver: true, finalScore: this.score });
  }

  private isGridEmpty(): boolean {
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        if (this.grid[row][col]) {
          return false;
        }
      }
    }
    return true;
  }

  private nextLevel() {
    this.level++;
    this.levelText?.setText(`Level: ${this.level}`);

    this.descendInterval = Math.min(this.descendInterval + 1, 3);
    this.numRows = Math.min(this.numRows + 1, 12);

    this.resetGrid();
    this.createInitialBubbles();
  }

  private resetGrid() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        const bubble = this.grid[row][col];
        bubble?.destroy();
        this.grid[row][col] = null;
      }
    }
    this.grid = [];
    this.bubbleGroup?.clear(true, true);
  }
}
