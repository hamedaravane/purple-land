import BubbleColors from '@constants/BubbleColors.ts';

export function getRandomBubbleColor() {
  const colors = Object.values(BubbleColors).filter(
    (value) => typeof value === 'number',
  ) as number[];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export function getRandomBubbleColorString(): keyof typeof BubbleColors {
  const colors = Object.keys(BubbleColors) as (keyof typeof BubbleColors)[];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export function getColorCode(colorName: keyof typeof BubbleColors): number {
  return BubbleColors[colorName];
}
