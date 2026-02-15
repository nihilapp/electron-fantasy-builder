import type { z } from 'zod';

import { getDbMode } from './context';

/**
 * @description snake_case 키를 camelCase로 변환.
 * @param key 변환할 키 문자열
 * @example 'prj_no' -> 'prjNo', 'use_yn' -> 'useYn'
 */
function snakeToCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase());
}

/**
 * @description 객체의 모든 키를 snake_case에서 camelCase로 변환 (1단계만). DB row처럼 flat한 객체용.
 * @param obj 키가 snake_case 또는 혼용인 객체
 */
function keysToCamel<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [ key, value, ] of Object.entries(obj)) {
    const camelKey = snakeToCamelKey(key);
    if (camelKey in out && key === camelKey) {
      out[camelKey] = value;
    }
    else if (!(camelKey in out)) {
      out[camelKey] = value;
    }
  }

  return out;
}

/**
 * @description DB row를 VO 스키마로 파싱해 VO로 변환. row 키를 snake_case → camelCase로 변환 후 스키마로 파싱.
 * @param row DB 결과 한 행 (키가 snake_case 또는 camelCase 혼용 가능)
 * @param schema VO용 Zod 스키마 (projectSchema 등)
 * @returns 스키마에 맞는 VO
 */
export function rowToVo<T>(
  row: Record<string, unknown>,
  schema: z.ZodType<T>
): T {
  const camel = keysToCamel(row);

  if (getDbMode() === 'local' && 'userNo' in camel) {
    const rest = { ...camel, };
    delete rest.userNo;

    return schema.parse(rest) as T;
  }

  return schema.parse(camel) as T;
}
