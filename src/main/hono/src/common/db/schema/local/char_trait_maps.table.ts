import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { charactersTable } from './characters.table';

/**
 * 인물-특성 매핑 테이블 (로컬 SQLite). 복합 PK: char_no, trait_no, trait_type.
 */
export const charTraitMapsTable = sqliteTable(
  'char_trait_maps',
  {
    charNo: integer('char_no')
      .notNull()
      .references(() => charactersTable.charNo),
    traitNo: integer('trait_no').notNull(),
    traitType: text('trait_type').notNull(), // GLOBAL | PROJECT
    traitRmk: text('trait_rmk'),
  },
  (t) => [ primaryKey({ columns: [ t.charNo, t.traitNo, t.traitType, ], }), ]
);
