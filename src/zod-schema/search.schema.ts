/**
 * 검색용 Zod 스키마.
 * SearchVo (page, searchKeyword, searchType) 등 검색 공통 필드. 전부 선택값.
 */

import { z } from 'zod';

/** 검색 공통. page/pageSize는 기본값 1,10. 나머지는 값 없으면 null. */
export const searchSchema = z.object({
  page: z.number().int().min(1).nullable().optional().default(null),
  pageSize: z.number().int().min(1).nullable().optional().default(null),
  searchKeyword: z.string().nullable().optional().default(null),
  searchType: z.string().nullable().optional().default(null),
}).strict();
