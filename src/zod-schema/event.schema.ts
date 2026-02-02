/**
 * 사건 VO용 Zod 스키마.
 * events 테이블 (local/remote 공통). prj_no 스코프.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 사건 VO 스키마. 값 없으면 null. */
export const eventSchema = z
  .object({
    eventNo: z.number().int().nullable().optional().default(null),
    prjNo: z.number().int().nullable().optional().default(null),
    eventNm: z.string().nullable().optional().default(null),
    occurTime: z.string().nullable().optional().default(null),
    occurLoc: z.string().nullable().optional().default(null),
    smry: z.string().nullable().optional().default(null),
    causePub: z.string().nullable().optional().default(null),
    causeReal: z.string().nullable().optional().default(null),
    sideAChar: z.string().nullable().optional().default(null),
    sideAOrg: z.string().nullable().optional().default(null),
    sideANtn: z.string().nullable().optional().default(null),
    sideBChar: z.string().nullable().optional().default(null),
    sideBOrg: z.string().nullable().optional().default(null),
    sideBNtn: z.string().nullable().optional().default(null),
    sideCChar: z.string().nullable().optional().default(null),
    sideCOrg: z.string().nullable().optional().default(null),
    sideCNtn: z.string().nullable().optional().default(null),
    flowTrgr: z.string().nullable().optional().default(null),
    flowCrisis: z.string().nullable().optional().default(null),
    flowClimax: z.string().nullable().optional().default(null),
    flowConcl: z.string().nullable().optional().default(null),
    dmgRslt: z.string().nullable().optional().default(null),
    socChng: z.string().nullable().optional().default(null),
    currConn: z.string().nullable().optional().default(null),
    recOfficial: z.string().nullable().optional().default(null),
    truthHid: z.string().nullable().optional().default(null),
    rmk: z.string().nullable().optional().default(null),
  })
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

export const getEmptyEvent = () => eventSchema.parse({});
