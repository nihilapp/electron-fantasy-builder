import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { creaturesTable } from './creatures.table';

/**
 * 종족-특성 매핑 테이블 (원격 Postgres). PK: map_no.
 */
export const creatureTraitMapsTable = pgTable('creature_trait_maps', {
  mapNo: serial('map_no').primaryKey(),
  creatureNo: integer('creature_no')
    .notNull()
    .references(() => creaturesTable.creatureNo),
  traitNo: integer('trait_no').notNull(),
  traitType: varchar('trait_type', { length: 20, }).notNull(), // GLOBAL | PROJECT
  traitRmk: text('trait_rmk'),
});
