import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { usersTable } from './users.table';

/**
 * 프로젝트 테이블 (원격 Postgres). user_no → users.user_no FK.
 */
export const projectsTable = pgTable('projects', {
  prjNo: serial('prj_no').primaryKey(),
  userNo: integer('user_no').notNull().references(() => usersTable.userNo),
  prjNm: text('prj_nm').notNull(),
  genreType: text('genre_type'),
  prjDesc: text('prj_desc'),
  cvrImgUrl: text('cvr_img_url'),
  prjExpln: text('prj_expln'),
  prjVer: text('prj_ver'),
  ...commonColumnsPg,
});
