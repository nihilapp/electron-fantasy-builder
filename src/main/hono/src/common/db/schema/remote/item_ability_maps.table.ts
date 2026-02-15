import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { itemsTable } from './items.table';

/**
 * 아이템-어빌리티 매핑 테이블 (원격 Postgres). item_no → items.item_no.
 * 스킬 → 어빌리티 용어 통일.
 */
export const itemAbilityMapsTable = pgTable('item_ability_maps', {
  mapNo: serial('map_no').primaryKey(),
  itemNo: integer('item_no').notNull().references(() => itemsTable.itemNo),
  abilityNo: integer('ability_no').notNull(),
  abilityType: varchar('ability_type', { length: 20, }).notNull(), // GLOBAL | PROJECT
  profLvl: integer('prof_lvl'),
  abilityRmk: text('ability_rmk'),
});
