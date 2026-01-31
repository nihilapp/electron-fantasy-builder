import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 그룹 관계 테이블 (로컬 SQLite). prj_no → projects.prj_no.
 */
export const groupRelationsTable = sqliteTable('group_relations', {
  relNo: integer('rel_no').primaryKey({ autoIncrement: true, }),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  srcType: text('src_type').notNull(),
  srcNo: integer('src_no').notNull(),
  trgtType: text('trgt_type').notNull(),
  trgtNo: integer('trgt_no').notNull(),
  relType: text('rel_type').notNull(),
  relDesc: text('rel_desc'),
  ...commonColumnsSqlite,
});
