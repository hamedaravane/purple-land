import BubbleColors from '@constants/BubbleColors.ts';

export function getRandomBubbleColor() {
  const colors = Object.values(BubbleColors).filter(
    (value) => typeof value === 'number',
  ) as number[];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
