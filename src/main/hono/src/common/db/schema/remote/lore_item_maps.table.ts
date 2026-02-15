import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { itemsTable } from './items.table';
import { loresTable } from './lores.table';

/**
 * 전승-아이템 매핑 테이블 (원격 Postgres). lore_no → lores, item_no → items.
 */
export const loreItemMapsTable = pgTable('lore_item_maps', {
  mapNo: serial('map_no').primaryKey(),
  loreNo: integer('lore_no').notNull().references(() => loresTable.loreNo),
  itemNo: integer('item_no').notNull().references(() => itemsTable.itemNo),
  roleDesc: text('role_desc'),
});
