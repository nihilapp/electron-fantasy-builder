import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { charactersTable } from './characters.table';
import { commonColumnsSqlite } from './common.columns';

/**
 * 인물-그룹 관계 테이블 (로컬 SQLite). char_no → characters.char_no.
 */
export const charGroupRelationsTable = sqliteTable('char_group_relations', {
  relNo: integer('rel_no').primaryKey({ autoIncrement: true, }),
  charNo: integer('char_no').notNull().references(() => charactersTable.charNo),
  trgtRefType: text('trgt_ref_type').notNull(),
  trgtRefNo: integer('trgt_ref_no').notNull(),
  relType: text('rel_type').notNull(),
  relDesc: text('rel_desc'),
  ...commonColumnsSqlite,
});
