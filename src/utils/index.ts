import { ButtonConfig } from '@types';
import BubbleColors, { ColorObj } from '@constants/BubbleColors';

export function generateButton(config: ButtonConfig) {
  const { colorStyle, state, shape } = config;
  const cornerRadius = config.cornerRadius ? `-${config.cornerRadius}` : '';
  return `${colorStyle}-${state}-${shape}${cornerRadius}`;
}

export function getBubbleColor(): ColorObj {
  const randomKey = Math.floor(Math.random() * BubbleColors.length);
  return {
    label: BubbleColors[randomKey].label,
    color: BubbleColors[randomKey].color,
  };
}
