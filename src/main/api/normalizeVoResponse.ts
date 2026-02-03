import type { z } from 'zod';

import { abilitySchema } from '@zod-schema/ability.schema';
import { projectSchema } from '@zod-schema/project.schema';
import { traitSchema } from '@zod-schema/trait.schema';

/** URL 경로 prefix → VO 스키마. 응답 정규화(없는 필드 null)용. */
const URL_SCHEMA_MAP: [prefix: string, schema: z.ZodType][] = [
  [ '/projects', projectSchema, ],
  [ '/traits', traitSchema, ],
  [ '/abilities', abilitySchema, ],
];

/**
 * @description 요청 URL에 대응하는 VO 스키마를 반환.
 * @param url axios config.url (상대 경로 예: /projects, /projects/1)
 */
export function getVoSchemaForUrl(url: string | undefined) {
  if (!url) return null;

  const path = url.split('?')[0];

  for (const [ prefix, schema, ] of URL_SCHEMA_MAP) {
    if (path === prefix || path.startsWith(`${prefix}/`)) return schema;
  }

  return null;
}

/**
 * @description 객체가 ResponseType 래퍼 형태인지 판별.
 * @param obj 검사할 값
 */
function isResponseEnvelope(
  obj: unknown
): obj is {
  data?: unknown;
  error?: boolean;
  code?: unknown;
  message?: string;
} {
  return typeof obj === 'object' && obj !== null && 'code' in obj;
}

/**
 * @description data가 list 배열을 가진 목록 응답인지 판별.
 * @param data 응답 body.data
 */
function hasList(data: unknown): data is { list: unknown[] } {
  return (
    typeof data === 'object'
    && data !== null
    && Array.isArray((data as { list?: unknown }).list)
  );
}

/**
 * @description ResponseType/ListResponseType의 data(또는 data.list 항목)를 스키마로 parse해 없는 필드를 null로 채운 객체로 교체. parse 실패 시 원본 body 그대로 반환.
 * @param body API 응답 body (unknown)
 * @param schema VO용 Zod 스키마
 */
export function normalizeResponseData(
  body: unknown,
  schema: z.ZodType
) {
  if (!isResponseEnvelope(body) || body.data === undefined) return body;

  const data = body.data;

  if (data === null) return body;

  try {
    if (hasList(data)) {
      const list = data.list.map((item) => schema.parse(item));

      return {
        ...body,
        data: {
          ...data,
          list,
        },
      };
    }

    if (typeof data === 'object' && data !== null) {
      return {
        ...body,
        data: schema.parse(data),
      };
    }
  }
  catch {
    // parse 실패 시 원본 유지
  }

  return body;
}
