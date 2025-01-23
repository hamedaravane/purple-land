import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BubbleGrid } from './BubbleGrid';

vi.mock('./Bubble', () => ({
  Bubble: vi.fn().mockImplementation(() => ({
    gridCoordinates: { row: 0, col: 0 },
    color: { color: 'red' },
    destroy: vi.fn(),
  })),
}));

describe('BubbleGrid', () => {
  let mockScene: any;
  let bubbleGrid: BubbleGrid;

  beforeEach(() => {
    mockScene = {
      scale: { width: 800, height: 600 },
    };
    bubbleGrid = new BubbleGrid(mockScene, 10, 10);
  });

  it('should initialize correctly', () => {
    expect(bubbleGrid.getCellWidth()).toBe(800 / 10);
  });
});
