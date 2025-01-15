import BubbleColors from '@constants/BubbleColors.ts';

export function getBubbleColor(): { label: string; color: number } {
  const keys = Array.from(BubbleColors.keys());
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { label: randomKey, color: BubbleColors.get(randomKey) as number };
}
