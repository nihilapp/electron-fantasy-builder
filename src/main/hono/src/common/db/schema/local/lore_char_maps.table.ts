import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { charactersTable } from './characters.table';
import { loresTable } from './lores.table';

/**
 * 전승-인물 매핑 테이블 (로컬 SQLite). lore_no → lores, char_no → characters.
 */
export const loreCharMapsTable = sqliteTable('lore_char_maps', {
  mapNo: integer('map_no').primaryKey({ autoIncrement: true, }),
  loreNo: integer('lore_no').notNull().references(() => loresTable.loreNo),
  charNo: integer('char_no').notNull().references(() => charactersTable.charNo),
  roleDesc: text('role_desc'),
});
