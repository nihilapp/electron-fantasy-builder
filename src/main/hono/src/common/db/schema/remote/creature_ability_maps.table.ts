import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { creaturesTable } from './creatures.table';

/**
 * 종족-어빌리티 매핑 테이블 (원격 Postgres). PK: map_no.
 */
export const creatureAbilityMapsTable = pgTable('creature_ability_maps', {
  mapNo: serial('map_no').primaryKey(),
  creatureNo: integer('creature_no')
    .notNull()
    .references(() => creaturesTable.creatureNo),
  abilityNo: integer('ability_no').notNull(),
  abilityType: varchar('ability_type', { length: 20, }).notNull(), // GLOBAL | PROJECT
  profLvl: integer('prof_lvl'),
  abilityRmk: text('ability_rmk'),
});
