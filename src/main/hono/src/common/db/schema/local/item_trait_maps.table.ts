import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { itemsTable } from './items.table';

/**
 * 아이템-특성 매핑 테이블 (로컬 SQLite). item_no → items.item_no.
 */
export const itemTraitMapsTable = sqliteTable('item_trait_maps', {
  mapNo: integer('map_no').primaryKey({ autoIncrement: true, }),
  itemNo: integer('item_no').notNull().references(() => itemsTable.itemNo),
  traitNo: integer('trait_no').notNull(),
  traitType: text('trait_type').notNull(), // GLOBAL | PROJECT
  traitRmk: text('trait_rmk'),
});
