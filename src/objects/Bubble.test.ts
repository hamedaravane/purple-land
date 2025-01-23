import { describe, expect, test, vi } from 'vitest';
import { Bubble } from './Bubble';
import Phaser from 'phaser';
import { ColorObj } from '../constants/BubbleColors.ts';

export const PINK: ColorObj = { label: 'pink', color: 0xee70a3 };

const createMockScene = () => ({
  physics: {
    add: {
      existing: vi.fn((obj) => {
        obj.body = {
          setCollideWorldBounds: vi.fn(),
          setVelocity: vi.fn(),
          setBounce: vi.fn(),
        };
      }),
    },
  },
  add: {
    existing: vi.fn(),
  },
  tweens: {
    add: vi.fn(),
  },
});

describe('Bubble', () => {
  vi.mock('@constants/BubbleColors', () => ({
    ORANGE: { label: 'test-orange', color: 0xff0000 },
  }));
  test('initializes with correct properties', () => {
    const scene = createMockScene();
    const bubble = new Bubble(scene as any, 100, 200, 32, PINK, true);

    expect(bubble.isShooter).toBe(true);
    expect(bubble.color).toEqual(PINK);
    expect(bubble.diameter).toBe(32);
    expect(bubble.x).toBe(100);
    expect(bubble.y).toBe(200);
  });

  test('configures physics body on initialization', () => {
    const scene = createMockScene();
    const bubble = new Bubble(scene as any, 0, 0, 32);

    expect(scene.physics.add.existing).toHaveBeenCalled();
    expect(
      (bubble.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds,
    ).toHaveBeenCalledWith(true);
    expect(
      (bubble.body as Phaser.Physics.Arcade.Body).setBounce,
    ).toHaveBeenCalledWith(1, 1);
    expect(
      (bubble.body as Phaser.Physics.Arcade.Body).setVelocity,
    ).toHaveBeenCalledWith(0, 0);
  });

  test('shot() sets velocity when is shooter', () => {
    const scene = createMockScene();
    const bubble = new Bubble(scene as any, 100, 200, 32, PINK, true);
    (bubble.body as Phaser.Physics.Arcade.Body).setVelocity = vi.fn();

    bubble.shot({ x: 300, y: 200 }, 600);
    expect(
      (bubble.body as Phaser.Physics.Arcade.Body).setVelocity,
    ).toHaveBeenCalledWith(600, 0);
  });

  test('shot() does nothing when not shooter', () => {
    const scene = createMockScene();
    const bubble = new Bubble(scene as any, 100, 200, 32, PINK, false);
    (bubble.body as Phaser.Physics.Arcade.Body).setVelocity = vi.fn();

    bubble.shot({ x: 300, y: 200 }, 600);
    expect(
      (bubble.body as Phaser.Physics.Arcade.Body).setVelocity,
    ).not.toHaveBeenCalled();
  });

  test('snapTo() updates position and adds tween', () => {
    const scene = createMockScene();
    const bubble = new Bubble(scene as any, 0, 0, 32);

    bubble.snapTo(100, 200);
    expect(bubble.x).toBe(100);
    expect(bubble.y).toBe(200);
    expect(scene.tweens.add).toHaveBeenCalledWith({
      targets: bubble,
      x: 100,
      y: 200,
      duration: 100,
      ease: 'Power2',
    });
  });

  test('setBubbleSize() calculates scale when texture loaded', () => {
    const scene = createMockScene();
    const bubble = new Bubble(scene as any, 0, 0, 64);
    bubble.width = 32;
    const setScaleSpy = vi.spyOn(bubble, 'setScale');

    bubble.setBubbleSize();
    expect(setScaleSpy).toHaveBeenCalledWith(2);
  });

  test('setBubbleSize() waits for texture load when width 0', () => {
    const scene = createMockScene();
    const bubble = new Bubble(scene as any, 0, 0, 64);
    const onceSpy = vi.spyOn(bubble, 'once');

    bubble.setBubbleSize();
    expect(onceSpy).toHaveBeenCalledWith(
      Phaser.Loader.Events.COMPLETE,
      expect.any(Function),
    );

    // Trigger texture load callback
    bubble.width = 32;
    const callback = onceSpy.mock.calls[0][1];
    const setScaleSpy = vi.spyOn(bubble, 'setScale');
    callback();
    expect(setScaleSpy).toHaveBeenCalledWith(2);
  });
});
