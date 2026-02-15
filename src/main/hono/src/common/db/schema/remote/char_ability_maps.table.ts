import { integer, pgTable, primaryKey, text, varchar } from 'drizzle-orm/pg-core';

import { charactersTable } from './characters.table';

/**
 * 인물-어빌리티 매핑 테이블 (원격 Postgres). 복합 PK: char_no, ability_no, ability_type.
 */
export const charAbilityMapsTable = pgTable(
  'char_ability_maps',
  {
    charNo: integer('char_no')
      .notNull()
      .references(() => charactersTable.charNo),
    abilityNo: integer('ability_no').notNull(),
    abilityType: varchar('ability_type', { length: 20, }).notNull(), // GLOBAL | PROJECT
    profLvl: integer('prof_lvl'),
    abilityRmk: text('ability_rmk'),
  },
  (t) => ({ pk: primaryKey({ columns: [ t.charNo, t.abilityNo, t.abilityType, ], }), })
);
