import { iconsData } from '~/data/icon-name.data';

export function getIcons(setName: string) {
  return iconsData[setName as keyof typeof iconsData];
}
