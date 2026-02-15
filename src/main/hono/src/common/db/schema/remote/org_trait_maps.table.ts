import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { organizationsTable } from './organizations.table';

/**
 * 조직-특성 매핑 테이블 (원격 Postgres). org_no → organizations.org_no.
 */
export const orgTraitMapsTable = pgTable('org_trait_maps', {
  mapNo: serial('map_no').primaryKey(),
  orgNo: integer('org_no').notNull().references(() => organizationsTable.orgNo),
  traitNo: integer('trait_no').notNull(),
  traitType: varchar('trait_type', { length: 20, }).notNull(), // GLOBAL | PROJECT
  traitRmk: text('trait_rmk'),
});
