import { foreignKey, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';

/**
 * 전역 특성 테이블 (로컬 SQLite). cnfl_trait_no → 자기 참조.
 */
export const traitsTable = sqliteTable(
  'traits',
  {
    traitNo: integer('trait_no').primaryKey({ autoIncrement: true, }),
    traitNm: text('trait_nm').notNull(),
    traitExpln: text('trait_expln'),
    traitLcls: text('trait_lcls'),
    traitMcls: text('trait_mcls'),
    aplyTrgt: text('aply_trgt'), // CHAR, ITEM, NATION, ORG, REGION
    cnflTraitNo: integer('cnfl_trait_no'),
    ...commonColumnsSqlite,
  },
  (traits) => [
    foreignKey({
      columns: [ traits.cnflTraitNo, ],
      foreignColumns: [ traits.traitNo, ],
    }),
  ]
);
