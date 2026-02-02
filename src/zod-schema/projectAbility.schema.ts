/**
 * 프로젝트 종속 어빌리티 VO용 Zod 스키마.
 * project_abilities 테이블 (local/remote 공통).
 * ability 필드 + prjNo. commonSchema, searchSchema 확장.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 프로젝트 종속 어빌리티 VO 스키마. 값 없으면 null. */
export const projectAbilitySchema = z
  .object({
    abilityNo: z.number().int().nullable().optional().default(null),
    prjNo: z.number().int().nullable().optional().default(null),
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

export const getEmptyProjectAbility = () => projectAbilitySchema.parse({});
