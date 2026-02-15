import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 프로젝트 종속 특성 테이블 (로컬 SQLite). prj_no → projects.prj_no.
 */
export const projectTraitsTable = sqliteTable('project_traits', {
  traitNo: integer('trait_no').primaryKey({ autoIncrement: true, }),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  traitNm: text('trait_nm').notNull(),
  traitExpln: text('trait_expln'),
  traitLcls: text('trait_lcls'),
  traitMcls: text('trait_mcls'),
  aplyTrgt: text('aply_trgt'),
  cnflTraitNo: integer('cnfl_trait_no'),
  cnflTraitType: text('cnfl_trait_type'), // GLOBAL | PROJECT
  ...commonColumnsSqlite,
});
