/**
 * 코어 설정 VO용 Zod 스키마.
 * core_rules 테이블 (local/remote 공통). prj_no 스코프.
 */

import { z } from 'zod';

import { commonSchema } from './common.schema';
import { searchSchema } from './search.schema';

/** 코어 설정 VO 스키마. 값 없으면 null. */
export const coreRuleSchema = z
  .object({
    coreNo: z.number().int().nullable().optional().default(null),
    prjNo: z.number().int().nullable().optional().default(null),
    coreNm: z.string().nullable().optional().default(null),
    defDesc: z.string().nullable().optional().default(null),
    aplyScope: z.string().nullable().optional().default(null),
    strcElem: z.string().nullable().optional().default(null),
    mechDesc: z.string().nullable().optional().default(null),
    narrAply: z.string().nullable().optional().default(null),
    linkDocs: z.string().nullable().optional().default(null),
    rmk: z.string().nullable().optional().default(null),
    loreType: z.string().nullable().optional().default(null),
    subLoreType: z.string().nullable().optional().default(null),
  })
  .extend(commonSchema.shape)
  .extend(searchSchema.shape);

/** 목록 API 응답용. 식별자 + 이름 + 메타만. (상세 본문·검색 필드 제외) */
export const coreRuleListItemSchema = coreRuleSchema.omit({
  defDesc: true,
  aplyScope: true,
  strcElem: true,
  mechDesc: true,
  narrAply: true,
  linkDocs: true,
  rmk: true,
  page: true,
  pageSize: true,
  searchKeyword: true,
  searchType: true,
});

export const getEmptyCoreRule = () => coreRuleSchema.parse({});
