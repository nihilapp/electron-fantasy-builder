/**
 * 국가 VO용 Zod 스키마.
 * nations 테이블 (local/remote 공통). prj_no 스코프.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 국가 VO 스키마. 값 없으면 null. */
export const nationSchema = z
  .object({
    ntnNo: z.number().int().nullable().optional().default(null),
    prjNo: z.number().int().nullable().optional().default(null),
    ntnNm: z.string().nullable().optional().default(null),
    ntnType: z.string().nullable().optional().default(null),
    logline: z.string().nullable().optional().default(null),
    capitalNm: z.string().nullable().optional().default(null),
    rulerTxt: z.string().nullable().optional().default(null),
    polSys: z.string().nullable().optional().default(null),
    adminLaw: z.string().nullable().optional().default(null),
    stateRlgn: z.string().nullable().optional().default(null),
    rlgnDesc: z.string().nullable().optional().default(null),
    natIdlg: z.string().nullable().optional().default(null),
    mainPlcy: z.string().nullable().optional().default(null),
    tabooAct: z.string().nullable().optional().default(null),
    diplPlcy: z.string().nullable().optional().default(null),
    intrCnfl: z.string().nullable().optional().default(null),
    hiddenFact: z.string().nullable().optional().default(null),
    econStruct: z.string().nullable().optional().default(null),
    socCltr: z.string().nullable().optional().default(null),
    milPwr: z.string().nullable().optional().default(null),
    histDesc: z.string().nullable().optional().default(null),
    currIssue: z.string().nullable().optional().default(null),
    loreType: z.string().nullable().optional().default(null),
    subLoreType: z.string().nullable().optional().default(null),
  })
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyNation = () => nationSchema.parse({});
