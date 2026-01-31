import { foreignKey, integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';

/**
 * 전역 특성 테이블 (원격 Postgres). cnfl_trait_no → 자기 참조.
 */
export const traitsTable = pgTable(
  'traits',
  {
    traitNo: serial('trait_no').primaryKey(),
    traitNm: text('trait_nm').notNull(),
    traitExpln: text('trait_expln'),
    traitLcls: text('trait_lcls'),
    traitMcls: text('trait_mcls'),
    aplyTrgt: varchar('aply_trgt', { length: 20, }), // CHAR, ITEM, NATION, ORG, REGION
    cnflTraitNo: integer('cnfl_trait_no'),
    ...commonColumnsPg,
  },
  (traits) => [
    foreignKey({
      columns: [ traits.cnflTraitNo, ],
      foreignColumns: [ traits.traitNo, ],
    }),
  ]
);
