import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 코어 설정 테이블 (원격 Postgres). prj_no → projects.prj_no.
 */
export const coreRulesTable = pgTable('core_rules', {
  coreNo: serial('core_no').primaryKey(),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  coreNm: text('core_nm').notNull(),
  defDesc: text('def_desc'),
  aplyScope: text('aply_scope'),
  strcElem: text('strc_elem'),
  mechDesc: text('mech_desc'),
  narrAply: text('narr_aply'),
  linkDocs: text('link_docs'),
  rmk: text('rmk'),
  ...commonColumnsPg,
});
