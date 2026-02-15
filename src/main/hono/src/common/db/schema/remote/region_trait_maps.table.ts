import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { regionsTable } from './regions.table';

/**
 * 지역-특성 매핑 테이블 (원격 Postgres). region_no → regions.region_no.
 */
export const regionTraitMapsTable = pgTable('region_trait_maps', {
  mapNo: serial('map_no').primaryKey(),
  regionNo: integer('region_no').notNull().references(() => regionsTable.regionNo),
  traitNo: integer('trait_no').notNull(),
  traitType: varchar('trait_type', { length: 20, }).notNull(), // GLOBAL | PROJECT
  traitRmk: text('trait_rmk'),
});
