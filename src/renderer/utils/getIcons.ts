import { iconsData } from '~/data/icon-name.data';

/**
 * @description 아이콘 데이터에서 지정된 이름에 해당하는 아이콘 데이터를 반환.
 * @param setName - 아이콘 이름
 * */
export function getIcons(setName: string) {
  return iconsData[setName as keyof typeof iconsData];
}
