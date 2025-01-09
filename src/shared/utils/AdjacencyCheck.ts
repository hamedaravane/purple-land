import { Bubble } from '@domain/bubbles/entities/Bubble.ts';
import { PositionOrDirection } from '@shared/types';

export function adjacencyCheck(
  a: PositionOrDirection,
  b: PositionOrDirection,
): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distanceSquared = dx * dx + dy * dy;
  return distanceSquared <= 32 * 32;
}

export function hexAdjacent(
  a: Bubble,
  b: Bubble,
  bubbleRadius: number,
): boolean {
  if (a.isPopped || b.isPopped) return false;

  // Typical hex adjacency threshold ~ 1.2 * bubbleDiameter
  // to ensure each bubble sees up to 6 neighbors.
  const dx = a.position.x - b.position.x;
  const dy = a.position.y - b.position.y;
  const distSq = dx * dx + dy * dy;
  const threshold = bubbleRadius * 2 * 1.2;
  return distSq <= threshold * threshold;
}

export function isHexAdjacent(dist: number, bubbleRadius: number): boolean {
  // For a neat hex arrangement, let's say adjacency if dist <= ~1.2 * diameter
  const threshold = bubbleRadius * 2 * 1.2;
  return dist <= threshold;
}
