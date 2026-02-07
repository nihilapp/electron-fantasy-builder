/**
 * 공통 Zod 스키마.
 * 테이블 공통 9컬럼 + rowNo, totalCnt (CommonVo).
 */

import { z } from 'zod';

/** Y/N 여부 enum (use_yn, shrn_yn, del_yn 등) */
export const ynEnum = z.enum([ 'Y', 'N', ]);

/** 날짜/시간 저장 형식: yyyy-MM-ddThh:mm:ss.sssZ (ISO 8601) */
const iso8601DateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/** 날짜/시간 필드 (nullable, optional, 문자열일 때 위 형식만 허용) */
const dateTimeSchema = z
  .string()
  .regex(iso8601DateTimeRegex, '날짜/시간 형식은 yyyy-MM-ddThh:mm:ss.sssZ 여야 합니다.')
  .nullable()
  .optional();

/** 테이블 공통 컬럼 (common.columns) + rowNo, totalCnt. 값 없으면 null. */
export const commonSchema = z.object({
  useYn: ynEnum.nullable().optional().default(null),
  shrnYn: ynEnum.nullable().optional().default(null),
  delYn: ynEnum.nullable().optional().default(null),
  /** 태그. 쉼표 구분 또는 JSON 배열 문자열. */
  tags: z.string().nullable().optional().default(null),
  crtNo: z.number().nullable().optional().default(null),
  crtDt: dateTimeSchema.optional().default(null),
  updtNo: z.number().nullable().optional().default(null),
  updtDt: dateTimeSchema.optional().default(null),
  delNo: z.number().nullable().optional().default(null),
  delDt: dateTimeSchema.optional().default(null),
  rowNo: z.number().nullable().optional().default(null),
  totalCnt: z.number().nullable().optional().default(null),
}).strict();
