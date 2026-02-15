import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { creaturesTable } from './creatures.table';

/**
 * 종족-어빌리티 매핑 테이블 (로컬 SQLite). PK: map_no.
 */
export const creatureAbilityMapsTable = sqliteTable('creature_ability_maps', {
  mapNo: integer('map_no').primaryKey({ autoIncrement: true, }),
  creatureNo: integer('creature_no')
    .notNull()
    .references(() => creaturesTable.creatureNo),
  abilityNo: integer('ability_no').notNull(),
  abilityType: text('ability_type').notNull(), // GLOBAL | PROJECT
  profLvl: integer('prof_lvl'),
  abilityRmk: text('ability_rmk'),
});
