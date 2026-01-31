import { integer, pgTable, primaryKey, text, varchar } from 'drizzle-orm/pg-core';

import { charactersTable } from './characters.table';

/**
 * 인물-특성 매핑 테이블 (원격 Postgres). 복합 PK: char_no, trait_no, trait_type.
 */
export const charTraitMapsTable = pgTable(
  'char_trait_maps',
  {
    charNo: integer('char_no')
      .notNull()
      .references(() => charactersTable.charNo),
    traitNo: integer('trait_no').notNull(),
    traitType: varchar('trait_type', { length: 20, }).notNull(), // GLOBAL | PROJECT
    traitRmk: text('trait_rmk'),
  },
  (t) => ({ pk: primaryKey({ columns: [ t.charNo, t.traitNo, t.traitType, ], }), })
);
