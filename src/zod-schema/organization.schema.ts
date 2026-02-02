/**
 * 조직 VO용 Zod 스키마.
 * organizations 테이블 (local/remote 공통). prj_no 스코프.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 조직 VO 스키마. 값 없으면 null. */
export const organizationSchema = z
  .object({
    orgNo: z.number().int().nullable().optional().default(null),
    prjNo: z.number().int().nullable().optional().default(null),
    orgNm: z.string().nullable().optional().default(null),
    orgType: z.string().nullable().optional().default(null),
    logline: z.string().nullable().optional().default(null),
    orgTheme: z.string().nullable().optional().default(null),
    purpPub: z.string().nullable().optional().default(null),
    purpHid: z.string().nullable().optional().default(null),
    fndBg: z.string().nullable().optional().default(null),
    orgStrc: z.string().nullable().optional().default(null),
    orgScale: z.string().nullable().optional().default(null),
    joinCond: z.string().nullable().optional().default(null),
    exitRule: z.string().nullable().optional().default(null),
    mainAct: z.string().nullable().optional().default(null),
    actArea: z.string().nullable().optional().default(null),
    actMthd: z.string().nullable().optional().default(null),
    fundSrc: z.string().nullable().optional().default(null),
    keyFig: z.string().nullable().optional().default(null),
    histDesc: z.string().nullable().optional().default(null),
    currStat: z.string().nullable().optional().default(null),
  })
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyOrganization = () => organizationSchema.parse({});
