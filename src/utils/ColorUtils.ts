import BubbleColors, { ColorObj } from '@constants/BubbleColors';

export function getBubbleColor(): ColorObj {
  const randomKey = Math.floor(Math.random() * BubbleColors.length);
  return {
    label: BubbleColors[randomKey].label,
    color: BubbleColors[randomKey].color,
  };
}
