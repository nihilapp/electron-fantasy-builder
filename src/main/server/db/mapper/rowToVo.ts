import type { z } from 'zod';

import { getDbMode } from '../context';

/**
 * snake_case 키를 camelCase로 변환.
 * @example 'prj_no' -> 'prjNo', 'use_yn' -> 'useYn'
 */
function snakeToCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * 객체의 모든 키를 snake_case에서 camelCase로 변환 (1단계만).
 * DB row처럼 flat한 객체용. 이미 camelCase인 키가 있으면 그 값을 우선.
 */
function keysToCamel<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [ k, v, ] of Object.entries(obj)) {
    const camelKey = snakeToCamelKey(k);
    if (camelKey in out && k === camelKey) {
      out[camelKey] = v;
    }
    else if (!(camelKey in out)) {
      out[camelKey] = v;
    }
  }
  return out;
}

/**
 * DB row를 VO 스키마로 파싱해 VO로 변환.
 * - row 키를 snake_case → camelCase로 변환 후 스키마로 파싱.
 * - 매퍼마다 하드코딩하지 않고, 스키마만 넘기면 됨.
 * - DB가 숫자를 문자열로 주면 스키마에서 z.coerce.number() 등으로 처리하면 됨.
 *
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
