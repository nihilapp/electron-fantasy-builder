import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { organizationsTable } from './organizations.table';

/**
 * 조직-특성 매핑 테이블 (로컬 SQLite). org_no → organizations.org_no.
 */
export const orgTraitMapsTable = sqliteTable('org_trait_maps', {
  mapNo: integer('map_no').primaryKey({ autoIncrement: true, }),
  orgNo: integer('org_no').notNull().references(() => organizationsTable.orgNo),
  traitNo: integer('trait_no').notNull(),
  traitType: text('trait_type').notNull(), // GLOBAL | PROJECT
  traitRmk: text('trait_rmk'),
});
