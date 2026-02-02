/**
 * 생물/종족 VO용 Zod 스키마.
 * creatures 테이블 (local/remote 공통). prj_no 스코프.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 생물/종족 VO 스키마. 값 없으면 null. */
export const creatureSchema = z
  .object({
    creatureNo: z.number().int().nullable().optional().default(null),
    prjNo: z.number().int().nullable().optional().default(null),
    creatureNm: z.string().nullable().optional().default(null),
    creatureType: z.string().nullable().optional().default(null),
    dangerGrd: z.string().nullable().optional().default(null),
    identStat: z.string().nullable().optional().default(null),
    creatureExpln: z.string().nullable().optional().default(null),
  })
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyCreature = () => creatureSchema.parse({});
