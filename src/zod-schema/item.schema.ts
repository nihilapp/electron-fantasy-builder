/**
 * 아이템 VO용 Zod 스키마.
 * items 테이블 (local/remote 공통). prj_no 스코프.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 아이템 VO 스키마. 값 없으면 null. */
export const itemSchema = z
  .object({
    itemNo: z.number().int().nullable().optional().default(null),
    prjNo: z.number().int().nullable().optional().default(null),
    itemNm: z.string().nullable().optional().default(null),
    clsMain: z.string().nullable().optional().default(null),
    clsSub: z.string().nullable().optional().default(null),
    itemGrd: z.string().nullable().optional().default(null),
    logline: z.string().nullable().optional().default(null),
    appDesc: z.string().nullable().optional().default(null),
    visualFeat: z.string().nullable().optional().default(null),
    attrType: z.string().nullable().optional().default(null),
    dmgType: z.string().nullable().optional().default(null),
    mainFunc: z.string().nullable().optional().default(null),
    loreType: z.string().nullable().optional().default(null),
    subLoreType: z.string().nullable().optional().default(null),
  })
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyItem = () => itemSchema.parse({});
