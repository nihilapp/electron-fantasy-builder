import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { charactersTable } from './characters.table';

/**
 * 인물-어빌리티 매핑 테이블 (로컬 SQLite). 복합 PK: char_no, ability_no, ability_type.
 */
export const charAbilityMapsTable = sqliteTable(
  'char_ability_maps',
  {
    charNo: integer('char_no')
      .notNull()
      .references(() => charactersTable.charNo),
    abilityNo: integer('ability_no').notNull(),
    abilityType: text('ability_type').notNull(), // GLOBAL | PROJECT
    profLvl: integer('prof_lvl'),
    abilityRmk: text('ability_rmk'),
  },
  (t) => [ primaryKey({ columns: [ t.charNo, t.abilityNo, t.abilityType, ], }), ]
);
