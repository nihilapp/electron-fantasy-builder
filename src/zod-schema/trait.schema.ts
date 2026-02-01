/**
 * 트레잇 VO용 Zod 스키마.
 * traits 테이블 (local/remote 공통).
 * traitSchema를 VO 역할로 사용: 요청 시 파싱해 VO 수신, 응답 TData에 VO 사용.
 * 모든 필드 선택값. commonSchema, searchSchema 확장.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 트레잇 VO 스키마. 값 없으면 null. */
export const traitSchema = z.object({
  traitNo: z.number().int().nullable().optional().default(null),
  traitNm: z.string().nullable().optional().default(null),
  traitExpln: z.string().nullable().optional().default(null),
  traitLcls: z.string().nullable().optional().default(null),
  traitMcls: z.string().nullable().optional().default(null),
  aplyTrgt: z.string().nullable().optional().default(null),
  cnflTraitNo: z.number().int().nullable().optional().default(null),
})
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyTrait = () => traitSchema.parse({});
