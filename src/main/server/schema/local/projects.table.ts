import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { usersTable } from './users.table';

/**
 * 프로젝트 테이블 (로컬 SQLite). user_no → users.user_no FK.
 */
export const projectsTable = sqliteTable('projects', {
  prjNo: integer('prj_no').primaryKey({ autoIncrement: true, }),
  userNo: integer('user_no').notNull().references(() => usersTable.userNo),
  prjNm: text('prj_nm').notNull(),
  genreType: text('genre_type'),
  prjDesc: text('prj_desc'),
  cvrImgUrl: text('cvr_img_url'),
  prjExpln: text('prj_expln'),
  prjVer: text('prj_ver'),
  ...commonColumnsSqlite,
});
