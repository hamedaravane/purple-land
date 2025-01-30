import BubbleColors, { ColorObj } from '@constants/BubbleColors';

export function getBubbleColor(): ColorObj {
  const randomKey = Math.floor(Math.random() * BubbleColors.length);
  return {
    label: BubbleColors[randomKey].label,
    color: BubbleColors[randomKey].color,
  };
}

export function darkenColor(baseColor: number, ratio = 0.25): number {
  let r = (baseColor >> 16) & 0xff;
  let g = (baseColor >> 8) & 0xff;
  let b = baseColor & 0xff;

  r = Math.floor(r * (1 - ratio));
  g = Math.floor(g * (1 - ratio));
  b = Math.floor(b * (1 - ratio));

  return (r << 16) + (g << 8) + b;
}
