import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 그룹 관계 테이블 (원격 Postgres). prj_no → projects.prj_no.
 * src_type/src_no, trgt_type/trgt_no 로 엔티티 간 관계 표현.
 */
export const groupRelationsTable = pgTable('group_relations', {
  relNo: serial('rel_no').primaryKey(),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  srcType: varchar('src_type', { length: 50, }).notNull(),
  srcNo: integer('src_no').notNull(),
  trgtType: varchar('trgt_type', { length: 50, }).notNull(),
  trgtNo: integer('trgt_no').notNull(),
  relType: varchar('rel_type', { length: 50, }).notNull(),
  relDesc: text('rel_desc'),
  ...commonColumnsPg,
});
