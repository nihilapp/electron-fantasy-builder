import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { regionsTable } from './regions.table';

/**
 * 지역-특성 매핑 테이블 (로컬 SQLite). region_no → regions.region_no.
 */
export const regionTraitMapsTable = sqliteTable('region_trait_maps', {
  mapNo: integer('map_no').primaryKey({ autoIncrement: true, }),
  regionNo: integer('region_no').notNull().references(() => regionsTable.regionNo),
  traitNo: integer('trait_no').notNull(),
  traitType: text('trait_type').notNull(), // GLOBAL | PROJECT
  traitRmk: text('trait_rmk'),
});
