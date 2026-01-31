import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { charactersTable } from './characters.table';
import { loresTable } from './lores.table';

/**
 * 전승-인물 매핑 테이블 (원격 Postgres). lore_no → lores, char_no → characters.
 */
export const loreCharMapsTable = pgTable('lore_char_maps', {
  mapNo: serial('map_no').primaryKey(),
  loreNo: integer('lore_no').notNull().references(() => loresTable.loreNo),
  charNo: integer('char_no').notNull().references(() => charactersTable.charNo),
  roleDesc: text('role_desc'),
});
