import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { charactersTable } from './characters.table';
import { commonColumnsSqlite } from './common.columns';
import { itemsTable } from './items.table';

/**
 * 인물-아이템 소유/장비 매핑 테이블 (로컬 SQLite). char_no → characters, item_no → items.
 */
export const charItemMapsTable = sqliteTable('char_item_maps', {
  ownNo: integer('own_no').primaryKey({ autoIncrement: true, }),
  charNo: integer('char_no').notNull().references(() => charactersTable.charNo),
  itemNo: integer('item_no').notNull().references(() => itemsTable.itemNo),
  itemCnt: integer('item_cnt').notNull(),
  equipYn: text('equip_yn'),
  rmk: text('rmk'),
  ...commonColumnsSqlite,
});
