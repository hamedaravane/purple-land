export type Position = { x: number; y: number };

export class Bubble {
  constructor(
    public readonly id: string,
    public readonly color: string,
    public position: Position,
    public isPopped: boolean = false,
    public rowIndex: number = 0,
    public colIndex: number = 0,
  ) {}

  pop(): void {
    if (!this.isPopped) {
      this.isPopped = true;
    }
  }

  updatePosition(newPos: Position): void {
    this.position = newPos;
  }
}
