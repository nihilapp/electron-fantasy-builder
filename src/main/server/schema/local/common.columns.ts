import { integer, text } from 'drizzle-orm/sqlite-core';

/**
 * FANTASY BUILDER 공통 필드 (CommonEntity).
 * 모든 엔티티 테이블에 포함. TS 필드명(camelCase) → DB 컬럼명(snake_case).
 */
export const commonColumnsSqlite = {
  useYn: text('use_yn').default('Y'),
  shrnYn: text('shrn_yn').default('N'),
  delYn: text('del_yn').default('N'),
  crtNo: integer('crt_no'),
  crtDt: text('crt_dt'),
  updtNo: integer('updt_no'),
  updtDt: text('updt_dt'),
  delNo: integer('del_no'),
  delDt: text('del_dt'),
};
