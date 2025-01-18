import BubbleColors from '@constants/BubbleColors';

export function getBubbleColor(): { label: string; color: number } {
  const randomKey = Math.floor(Math.random() * BubbleColors.length);
  return {
    label: BubbleColors[randomKey].label,
    color: BubbleColors[randomKey].color,
  };
}
