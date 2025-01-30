export type Coordinate = { row: number; col: number };

export type ColorStyle = 'blue' | 'pink' | 'yellow' | 'purple' | 'green';
export type State = 'unpressed' | 'pressed';
export type Shape = 'rect' | 'circle' | 'square';
export type CornerRadius = 'sharp' | 'rounded';

export interface ButtonConfig {
  colorStyle: ColorStyle;
  state: State;
  shape: Shape;
  cornerRadius?: CornerRadius;
}
