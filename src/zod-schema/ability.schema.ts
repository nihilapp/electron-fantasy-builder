/**
 * 어빌리티 VO용 Zod 스키마.
 * abilities 테이블 (local/remote 공통).
 * 권역(domain)·원천(source)·계통(lineage)·형태(form). 태그는 commonSchema.tags 사용.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 어빌리티 VO 스키마. 값 없으면 null. */
export const abilitySchema = z
  .object({
    abilityNo: z.number().int().nullable().optional().default(null),
    abilityNm: z.string().nullable().optional().default(null),
    abilityDomain: z.string().nullable().optional().default(null),
    abilitySource: z.string().nullable().optional().default(null),
    abilityLineage: z.string().nullable().optional().default(null),
    abilityForm: z.string().nullable().optional().default(null),
    abilityExpln: z.string().nullable().optional().default(null),
    castTime: z.number().int().nullable().optional().default(null),
    coolTime: z.number().int().nullable().optional().default(null),
    dmgType: z.string().nullable().optional().default(null),
    statEffType: z.string().nullable().optional().default(null),
    trgtType: z.string().nullable().optional().default(null),
    useCnd: z.string().nullable().optional().default(null),
    useCost: z.string().nullable().optional().default(null),
  })
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyAbility = () => abilitySchema.parse({});
