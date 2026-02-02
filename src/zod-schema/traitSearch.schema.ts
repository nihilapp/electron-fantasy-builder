/**
 * 특성(Trait) 통합 검색 쿼리용 Zod 스키마.
 * 전역 + 프로젝트 종속 풀 통합 검색. type으로 GLOBAL | PROJECT | ALL 구분.
 */

import { z } from 'zod';

export const traitSearchTypeEnum = z.enum([ 'GLOBAL', 'PROJECT', 'ALL', ]);

export type TraitSearchType = z.infer<typeof traitSearchTypeEnum>;

/** 특성 통합 검색 쿼리 스키마 */
export const traitSearchQuerySchema = z.object({
  type: traitSearchTypeEnum.optional().default('ALL'),
  searchKeyword: z.string().nullable().optional().default(null),
  searchType: z.string().nullable().optional().default(null),
  page: z.number().int().min(1).nullable().optional().default(1),
  pageSize: z.number().int().min(1).nullable().optional().default(10),
});

export type TraitSearchQueryVo = z.infer<typeof traitSearchQuerySchema>;
