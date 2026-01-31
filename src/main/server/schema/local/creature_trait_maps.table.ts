import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { creaturesTable } from './creatures.table';

/**
 * 종족-특성 매핑 테이블 (로컬 SQLite). PK: map_no.
 */
export const creatureTraitMapsTable = sqliteTable('creature_trait_maps', {
  mapNo: integer('map_no').primaryKey({ autoIncrement: true, }),
  creatureNo: integer('creature_no')
    .notNull()
    .references(() => creaturesTable.creatureNo),
  traitNo: integer('trait_no').notNull(),
  traitType: text('trait_type').notNull(), // GLOBAL | PROJECT
  traitRmk: text('trait_rmk'),
});
