import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 코어 설정 테이블 (로컬 SQLite). prj_no → projects.prj_no.
 */
export const coreRulesTable = sqliteTable('core_rules', {
  coreNo: integer('core_no').primaryKey({ autoIncrement: true, }),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  coreNm: text('core_nm').notNull(),
  defDesc: text('def_desc'),
  aplyScope: text('aply_scope'),
  strcElem: text('strc_elem'),
  mechDesc: text('mech_desc'),
  narrAply: text('narr_aply'),
  linkDocs: text('link_docs'),
  rmk: text('rmk'),
  ...commonColumnsSqlite,
});
