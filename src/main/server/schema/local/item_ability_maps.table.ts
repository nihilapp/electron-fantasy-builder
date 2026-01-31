import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { itemsTable } from './items.table';

/**
 * 아이템-어빌리티 매핑 테이블 (로컬 SQLite). item_no → items.item_no.
 */
export const itemAbilityMapsTable = sqliteTable('item_ability_maps', {
  mapNo: integer('map_no').primaryKey({ autoIncrement: true, }),
  itemNo: integer('item_no').notNull().references(() => itemsTable.itemNo),
  abilityNo: integer('ability_no').notNull(),
  abilityType: text('ability_type').notNull(), // GLOBAL | PROJECT
  profLvl: integer('prof_lvl'),
  abilityRmk: text('ability_rmk'),
});
