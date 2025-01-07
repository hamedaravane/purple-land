export function adjacencyCheck(
  a: { x: number; y: number },
  b: { x: number; y: number }
): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distanceSquared = dx * dx + dy * dy;
  return distanceSquared <= 32 * 32;
}
