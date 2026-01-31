import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';

/**
 * 프로젝트 테이블 (로컬 SQLite). 단일 사용자 환경 — user_no 없음.
 */
export const projectsTable = sqliteTable('projects', {
  prjNo: integer('prj_no').primaryKey({ autoIncrement: true, }),
  prjNm: text('prj_nm').notNull(),
  genreType: text('genre_type'),
  prjDesc: text('prj_desc'),
  cvrImgUrl: text('cvr_img_url'),
  prjExpln: text('prj_expln'),
  prjVer: text('prj_ver'),
  ...commonColumnsSqlite,
});
