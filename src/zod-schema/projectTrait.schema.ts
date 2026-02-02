/**
 * 프로젝트 종속 특성 VO용 Zod 스키마.
 * project_traits 테이블 (local/remote 공통).
 * trait 필드 + prjNo, cnflTraitType. commonSchema, searchSchema 확장.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 프로젝트 종속 특성 VO 스키마. 값 없으면 null. */
export const projectTraitSchema = z
  .object({
    traitNo: z.number().int().nullable().optional().default(null),
    prjNo: z.number().int().nullable().optional().default(null),
    traitNm: z.string().nullable().optional().default(null),
    traitExpln: z.string().nullable().optional().default(null),
    traitLcls: z.string().nullable().optional().default(null),
    traitMcls: z.string().nullable().optional().default(null),
    aplyTrgt: z.string().nullable().optional().default(null),
    cnflTraitNo: z.number().int().nullable().optional().default(null),
    cnflTraitType: z.string().nullable().optional().default(null), // GLOBAL | PROJECT
  })
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyProjectTrait = () => projectTraitSchema.parse({});
