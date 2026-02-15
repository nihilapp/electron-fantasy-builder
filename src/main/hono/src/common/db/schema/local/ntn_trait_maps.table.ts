import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { nationsTable } from './nations.table';

/**
 * 국가-특성 매핑 테이블 (로컬 SQLite). ntn_no → nations.ntn_no.
 */
export const ntnTraitMapsTable = sqliteTable('ntn_trait_maps', {
  mapNo: integer('map_no').primaryKey({ autoIncrement: true, }),
  ntnNo: integer('ntn_no').notNull().references(() => nationsTable.ntnNo),
  traitNo: integer('trait_no').notNull(),
  traitType: text('trait_type').notNull(), // GLOBAL | PROJECT
  traitRmk: text('trait_rmk'),
});
