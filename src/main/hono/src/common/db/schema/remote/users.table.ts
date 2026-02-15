import { bigint, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';

/**
 * 사용자 테이블 (원격 Postgres).
 */
export const usersTable = pgTable('users', {
  userNo: serial('user_no').primaryKey(),
  userEml: text('user_eml').notNull(),
  userNm: text('user_nm'),
  userRole: varchar('user_role', { length: 20, }), // USER | ADMIN
  proflImgUrl: text('profl_img_url'),
  biogp: text('biogp'),
  enpswd: text('enpswd'),
  reshToken: text('resh_token'),
  acntLckYn: varchar('acnt_lck_yn', { length: 1, }),
  lgnFailNmtm: bigint('lgn_fail_nmtm', { mode: 'number', }),
  lastLgnDt: timestamp('last_lgn_dt'),
  lastLgnIp: text('last_lgn_ip'),
  lastPswdChgDt: timestamp('last_pswd_chg_dt'),
  emlAuthYn: varchar('eml_auth_yn', { length: 1, }),
  mktRecpAgreYn: varchar('mkt_recp_agre_yn', { length: 1, }),
  ...commonColumnsPg,
});
