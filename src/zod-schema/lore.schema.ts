/**
 * 전승/설화 VO용 Zod 스키마.
 * lores 테이블 (local/remote 공통). prj_no 스코프.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 전승/설화 VO 스키마. 값 없으면 null. */
export const loreSchema = z
  .object({
    loreNo: z.number().int().nullable().optional().default(null),
    prjNo: z.number().int().nullable().optional().default(null),
    loreNm: z.string().nullable().optional().default(null),
    loreType: z.string().nullable().optional().default(null),
    subLoreType: z.string().nullable().optional().default(null),
    mainSubj: z.string().nullable().optional().default(null),
    smry: z.string().nullable().optional().default(null),
    transMthd: z.string().nullable().optional().default(null),
    pubPerc: z.string().nullable().optional().default(null),
    lorePlot: z.string().nullable().optional().default(null),
    realFact: z.string().nullable().optional().default(null),
    distRsn: z.string().nullable().optional().default(null),
    diffDesc: z.string().nullable().optional().default(null),
    cltrImpact: z.string().nullable().optional().default(null),
    plotConn: z.string().nullable().optional().default(null),
    rmk: z.string().nullable().optional().default(null),
  })
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyLore = () => loreSchema.parse({});
