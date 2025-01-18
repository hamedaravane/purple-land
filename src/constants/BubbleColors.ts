export type ColorLabel =
  | 'orange'
  | 'yellow'
  | 'cyan'
  | 'light-blue'
  | 'purple'
  | 'pink';

export type ColorObj = { label: ColorLabel; color: number };

const BubbleColors: ColorObj[] = [
  { label: 'orange', color: 0xf56301 },
  { label: 'yellow', color: 0xf5d105 },
  { label: 'cyan', color: 0x00f697 },
  { label: 'light-blue', color: 0x9ae0f5 },
  { label: 'purple', color: 0x8d71d7 },
  { label: 'pink', color: 0xee70a3 },
];

export default BubbleColors;
