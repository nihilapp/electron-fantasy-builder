/**
 * 인물 VO용 Zod 스키마.
 * characters 테이블 (local/remote 공통). prj_no 스코프.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 인물 VO 스키마. 값 없으면 null. */
export const characterSchema = z
  .object({
    charNo: z.number().int().nullable().optional().default(null),
    prjNo: z.number().int().nullable().optional().default(null),
    charNm: z.string().nullable().optional().default(null),
    aliasNm: z.string().nullable().optional().default(null),
    roleType: z.string().nullable().optional().default(null),
    logline: z.string().nullable().optional().default(null),
    narrFunc: z.string().nullable().optional().default(null),
    raceNo: z.number().int().nullable().optional().default(null),
    ntnNo: z.number().int().nullable().optional().default(null),
    orgNo: z.number().int().nullable().optional().default(null),
    orgRank: z.string().nullable().optional().default(null),
  })
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyCharacter = () => characterSchema.parse({});
