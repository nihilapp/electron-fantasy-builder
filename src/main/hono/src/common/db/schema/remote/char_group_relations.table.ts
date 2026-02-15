import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { charactersTable } from './characters.table';
import { commonColumnsPg } from './common.columns';

/**
 * 인물-그룹 관계 테이블 (원격 Postgres). char_no → characters.char_no.
 * trgt_ref_type / trgt_ref_no 로 대상 엔티티 참조.
 */
export const charGroupRelationsTable = pgTable('char_group_relations', {
  relNo: serial('rel_no').primaryKey(),
  charNo: integer('char_no').notNull().references(() => charactersTable.charNo),
  trgtRefType: varchar('trgt_ref_type', { length: 50, }).notNull(),
  trgtRefNo: integer('trgt_ref_no').notNull(),
  relType: varchar('rel_type', { length: 50, }).notNull(),
  relDesc: text('rel_desc'),
  ...commonColumnsPg,
});
