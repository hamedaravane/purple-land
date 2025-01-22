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
