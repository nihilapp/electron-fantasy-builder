import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @description clsx와 tailwind-merge를 사용하여 클래스를 병합.
 * @param inputs - 클래스 값
 * */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
