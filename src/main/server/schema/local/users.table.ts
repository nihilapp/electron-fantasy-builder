import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';

/**
 * 사용자 테이블 (로컬 SQLite).
 */
export const usersTable = sqliteTable('users', {
  userNo: integer('user_no').primaryKey({ autoIncrement: true, }),
  userEml: text('user_eml').notNull(),
  userNm: text('user_nm'),
  userRole: text('user_role'), // USER | ADMIN
  proflImgUrl: text('profl_img_url'),
  biogp: text('biogp'),
  enpswd: text('enpswd'),
  reshToken: text('resh_token'),
  acntLckYn: text('acnt_lck_yn'),
  lgnFailNmtm: integer('lgn_fail_nmtm'),
  lastLgnDt: text('last_lgn_dt'),
  lastLgnIp: text('last_lgn_ip'),
  lastPswdChgDt: text('last_pswd_chg_dt'),
  emlAuthYn: text('eml_auth_yn'),
  mktRecpAgreYn: text('mkt_recp_agre_yn'),
  ...commonColumnsSqlite,
});
