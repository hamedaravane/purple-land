export const SQRT3_OVER_2 = 0.866;

export const NEIGHBOR_OFFSETS = {
  even: [
    [-1, 0], // top-left
    [-1, 1], // top-right
    [0, -1], // Left
    [0, 1], // Right
    [1, 0], // bottom-left
    [1, 1], // bottom-right
  ],
  odd: [
    [-1, -1], // top-left
    [-1, 0], // top-right
    [0, -1], // Left
    [0, 1], // Right
    [1, -1], // bottom-left
    [1, 0], // bottom-right
  ],
};

export const NAVBAR_SCALE = 0.12;
export const NAVBAR_BUTTON_SPACING_MULTIPLIER = 3;

export const DEFAULT_BUTTON_HEIGHT = 48;
export const DEFAULT_BUTTON_WIDTH = 52;
export const DEFAULT_BUTTON_CORNER_RADIUS = 12;
export const TOP_BUTTON_SCALE = 0.85;
export const TOP_BUTTON_POSITION_OFFSET = 1 - TOP_BUTTON_SCALE;
