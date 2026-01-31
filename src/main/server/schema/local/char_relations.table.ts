import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { charactersTable } from './characters.table';
import { commonColumnsSqlite } from './common.columns';

/**
 * 인물-인물 관계 테이블 (로컬 SQLite). src_char_no, trgt_char_no → characters.char_no.
 */
export const charRelationsTable = sqliteTable('char_relations', {
  relNo: integer('rel_no').primaryKey({ autoIncrement: true, }),
  srcCharNo: integer('src_char_no').notNull().references(() => charactersTable.charNo),
  trgtCharNo: integer('trgt_char_no').notNull().references(() => charactersTable.charNo),
  relType: text('rel_type').notNull(),
  relDesc: text('rel_desc'),
  intimacyLvl: integer('intimacy_lvl'),
  ...commonColumnsSqlite,
});
