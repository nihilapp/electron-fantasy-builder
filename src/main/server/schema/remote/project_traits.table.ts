import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 프로젝트 종속 특성 테이블 (원격 Postgres). prj_no → projects.prj_no.
 */
export const projectTraitsTable = pgTable('project_traits', {
  traitNo: serial('trait_no').primaryKey(),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  traitNm: text('trait_nm').notNull(),
  traitExpln: text('trait_expln'),
  traitLcls: text('trait_lcls'),
  traitMcls: text('trait_mcls'),
  aplyTrgt: text('aply_trgt'),
  cnflTraitNo: integer('cnfl_trait_no'),
  cnflTraitType: varchar('cnfl_trait_type', { length: 20, }), // GLOBAL | PROJECT
  ...commonColumnsPg,
});
