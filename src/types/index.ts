export type Coordinate = { row: number; col: number };

export type KnownColor = 'green' | 'yellow' | 'pink' | 'purple' | 'blue';

export const COLOR_MAP: Record<KnownColor, number> = {
  green: 0x67eb00,
  yellow: 0xffdb0a,
  pink: 0xfc8aff,
  purple: 0xc286ff,
  blue: 0x4cdafe,
};
