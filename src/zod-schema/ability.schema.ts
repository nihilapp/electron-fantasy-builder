/**
 * 어빌리티 VO용 Zod 스키마.
 * abilities 테이블 (local/remote 공통).
 * abilitySchema를 VO 역할로 사용: 요청 시 파싱해 VO 수신, 응답 TData에 VO 사용.
 * 모든 필드 선택값. commonSchema, searchSchema 확장.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 어빌리티 VO 스키마. 값 없으면 null. */
export const abilitySchema = z.object({
  abilityNo: z.number().int().nullable().optional().default(null),
  abilityNm: z.string().nullable().optional().default(null),
  abilityType: z.string().nullable().optional().default(null),
  abilityLcls: z.string().nullable().optional().default(null),
  abilityExpln: z.string().nullable().optional().default(null),
  trgtType: z.string().nullable().optional().default(null),
  dmgType: z.string().nullable().optional().default(null),
  statEffType: z.string().nullable().optional().default(null),
  useCost: z.string().nullable().optional().default(null),
  coolTime: z.number().int().nullable().optional().default(null),
  castTime: z.number().int().nullable().optional().default(null),
  useCnd: z.string().nullable().optional().default(null),
})
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyAbility = () => abilitySchema.parse({});
