import { z } from 'zod';

import { commonSchema } from './common.schema';

/**
 * 사용자 정보 VO 스키마.
 * users 테이블 기반.
 */
export const userSchema = commonSchema.extend({
  userNo: z.number().nullable().optional(),
  userEml: z.string().email().nullable().optional(),
  userNm: z.string().nullable().optional(),
  userRole: z.enum([ 'USER', 'ADMIN', ]).nullable().optional(),
  proflImgUrl: z.string().nullable().optional(),
  biogp: z.string().nullable().optional(),
  // 비밀번호 등 민감 정보는 기본 조회 VO에서 제외하거나 별도 처리
  enpswd: z.string().nullable().optional(),
  reshToken: z.string().nullable().optional(),
  acntLckYn: z.enum([ 'Y', 'N', ]).nullable().optional(),
  lgnFailNmtm: z.number().nullable().optional(),
  lastLgnDt: z.string().nullable().optional(), // ISO string from timestamp
  lastLgnIp: z.string().nullable().optional(),
  lastPswdChgDt: z.string().nullable().optional(), // ISO string
  emlAuthYn: z.enum([ 'Y', 'N', ]).nullable().optional(),
  mktRecpAgreYn: z.enum([ 'Y', 'N', ]).nullable().optional(),
});
