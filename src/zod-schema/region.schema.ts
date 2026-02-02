/**
 * 지역 VO용 Zod 스키마.
 * regions 테이블 (local/remote 공통). prj_no 스코프.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 지역 VO 스키마. 값 없으면 null. */
export const regionSchema = z
  .object({
    regionNo: z.number().int().nullable().optional().default(null),
    prjNo: z.number().int().nullable().optional().default(null),
    upRegionNo: z.number().int().nullable().optional().default(null),
    regionNm: z.string().nullable().optional().default(null),
    regionType: z.string().nullable().optional().default(null),
    explorStat: z.string().nullable().optional().default(null),
    regionExpln: z.string().nullable().optional().default(null),
    locDesc: z.string().nullable().optional().default(null),
    climateEnv: z.string().nullable().optional().default(null),
    terrainFeat: z.string().nullable().optional().default(null),
    envSpec: z.string().nullable().optional().default(null),
    funcFeat: z.string().nullable().optional().default(null),
    dangerLvl: z.string().nullable().optional().default(null),
    dangerFctr: z.string().nullable().optional().default(null),
    inhabitInfo: z.string().nullable().optional().default(null),
    unknownEntity: z.string().nullable().optional().default(null),
    mainFclty: z.string().nullable().optional().default(null),
    rsrcList: z.string().nullable().optional().default(null),
    ntnNo: z.number().int().nullable().optional().default(null),
  })
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyRegion = () => regionSchema.parse({});
