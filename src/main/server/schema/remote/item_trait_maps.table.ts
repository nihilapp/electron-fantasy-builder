import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { itemsTable } from './items.table';

/**
 * 아이템-특성 매핑 테이블 (원격 Postgres). item_no → items.item_no.
 */
export const itemTraitMapsTable = pgTable('item_trait_maps', {
  mapNo: serial('map_no').primaryKey(),
  itemNo: integer('item_no').notNull().references(() => itemsTable.itemNo),
  traitNo: integer('trait_no').notNull(),
  traitType: varchar('trait_type', { length: 20, }).notNull(), // GLOBAL | PROJECT
  traitRmk: text('trait_rmk'),
});
