import { bigint, text, timestamp, varchar } from 'drizzle-orm/pg-core';

/**
 * FANTASY BUILDER 공통 필드 (CommonEntity).
 * 모든 엔티티 테이블에 포함. TS 필드명(camelCase) → DB 컬럼명(snake_case).
 */
export const commonColumnsPg = {
  useYn: varchar('use_yn', { length: 1, }).default('Y'),
  shrnYn: varchar('shrn_yn', { length: 1, }).default('N'),
  delYn: varchar('del_yn', { length: 1, }).default('N'),
  /** 태그. 쉼표 구분 문자열 또는 JSON 배열 문자열. */
  tags: text('tags'),
  crtNo: bigint('crt_no', { mode: 'number', }),
  crtDt: timestamp('crt_dt'),
  updtNo: bigint('updt_no', { mode: 'number', }),
  updtDt: timestamp('updt_dt'),
  delNo: bigint('del_no', { mode: 'number', }),
  delDt: timestamp('del_dt'),
};
