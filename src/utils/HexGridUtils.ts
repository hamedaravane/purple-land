/**
 * Utility class for hexagonal grid calculations.
 */
export class HexGridUtils {
  /**
   * Converts axial coordinates to pixel coordinates.
   * @param q Axial column.
   * @param r Axial row.
   * @param size Size (radius) of the hexagon.
   */
  public static axialToPixel(q: number, r: number, size: number): { x: number; y: number } {
    const x = size * (3 / 2 * q);
    const y = size * (Math.sqrt(3) * (r + q / 2));
    return { x, y };
  }

  /**
   * Converts pixel coordinates to axial coordinates.
   * @param x X-coordinate.
   * @param y Y-coordinate.
   * @param size Size (radius) of the hexagon.
   */
  public static pixelToAxial(x: number, y: number, size: number): { q: number; r: number } {
    const q = (2 / 3 * x) / size;
    const r = (-1 / 3 * x + Math.sqrt(3) / 3 * y) / size;
    return this.roundAxial(q, r);
  }

  /**
   * Rounds fractional axial coordinates to the nearest whole number.
   * @param q Fractional q.
   * @param r Fractional r.
   */
  public static roundAxial(q: number, r: number): { q: number; r: number } {
    let x = q;
    let z = r;
    let y = -x - z;

    let rx = Math.round(x);
    let ry = Math.round(y);
    let rz = Math.round(z);

    const x_diff = Math.abs(rx - x);
    const y_diff = Math.abs(ry - y);
    const z_diff = Math.abs(rz - z);

    if (x_diff > y_diff && x_diff > z_diff) {
      rx = -ry - rz;
    } else if (y_diff > z_diff) {
      ry = -rx - rz;
    } else {
      rz = -rx - ry;
    }

    return { q: rx, r: rz };
  }
}
