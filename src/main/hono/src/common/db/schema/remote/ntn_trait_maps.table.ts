import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { nationsTable } from './nations.table';

/**
 * 국가-특성 매핑 테이블 (원격 Postgres). ntn_no → nations.ntn_no.
 */
export const ntnTraitMapsTable = pgTable('ntn_trait_maps', {
  mapNo: serial('map_no').primaryKey(),
  ntnNo: integer('ntn_no').notNull().references(() => nationsTable.ntnNo),
  traitNo: integer('trait_no').notNull(),
  traitType: varchar('trait_type', { length: 20, }).notNull(), // GLOBAL | PROJECT
  traitRmk: text('trait_rmk'),
});
