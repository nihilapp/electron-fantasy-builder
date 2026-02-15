import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { charactersTable } from './characters.table';
import { commonColumnsPg } from './common.columns';
import { itemsTable } from './items.table';

/**
 * 인물-아이템 소유/장비 매핑 테이블 (원격 Postgres). char_no → characters, item_no → items.
 */
export const charItemMapsTable = pgTable('char_item_maps', {
  ownNo: serial('own_no').primaryKey(),
  charNo: integer('char_no').notNull().references(() => charactersTable.charNo),
  itemNo: integer('item_no').notNull().references(() => itemsTable.itemNo),
  itemCnt: integer('item_cnt').notNull(),
  equipYn: varchar('equip_yn', { length: 1, }),
  rmk: text('rmk'),
  ...commonColumnsPg,
});
