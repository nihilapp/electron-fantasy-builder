import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { itemsTable } from './items.table';
import { loresTable } from './lores.table';

/**
 * 전승-아이템 매핑 테이블 (로컬 SQLite). lore_no → lores, item_no → items.
 */
export const loreItemMapsTable = sqliteTable('lore_item_maps', {
  mapNo: integer('map_no').primaryKey({ autoIncrement: true, }),
  loreNo: integer('lore_no').notNull().references(() => loresTable.loreNo),
  itemNo: integer('item_no').notNull().references(() => itemsTable.itemNo),
  roleDesc: text('role_desc'),
});
