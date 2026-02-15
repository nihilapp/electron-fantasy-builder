import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { charactersTable } from './characters.table';
import { commonColumnsPg } from './common.columns';

/**
 * 인물-인물 관계 테이블 (원격 Postgres). src_char_no, trgt_char_no → characters.char_no.
 */
export const charRelationsTable = pgTable('char_relations', {
  relNo: serial('rel_no').primaryKey(),
  srcCharNo: integer('src_char_no').notNull().references(() => charactersTable.charNo),
  trgtCharNo: integer('trgt_char_no').notNull().references(() => charactersTable.charNo),
  relType: varchar('rel_type', { length: 50, }).notNull(),
  relDesc: text('rel_desc'),
  intimacyLvl: integer('intimacy_lvl'),
  ...commonColumnsPg,
});
