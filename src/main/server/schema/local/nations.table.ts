import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 국가 테이블 (로컬 SQLite). prj_no → projects.prj_no.
 */
export const nationsTable = sqliteTable('nations', {
  ntnNo: integer('ntn_no').primaryKey({ autoIncrement: true, }),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  ntnNm: text('ntn_nm').notNull(),
  ntnType: text('ntn_type'),
  logline: text('logline'),
  capitalNm: text('capital_nm'),
  rulerTxt: text('ruler_txt'),
  polSys: text('pol_sys'),
  adminLaw: text('admin_law'),
  stateRlgn: text('state_rlgn'),
  rlgnDesc: text('rlgn_desc'),
  natIdlg: text('nat_idlg'),
  mainPlcy: text('main_plcy'),
  tabooAct: text('taboo_act'),
  diplPlcy: text('dipl_plcy'),
  intrCnfl: text('intr_cnfl'),
  hiddenFact: text('hidden_fact'),
  econStruct: text('econ_struct'),
  socCltr: text('soc_cltr'),
  milPwr: text('mil_pwr'),
  histDesc: text('hist_desc'),
  currIssue: text('curr_issue'),
  loreType: text('lore_type').default('NATION'),
  subLoreType: text('sub_lore_type'),
  ...commonColumnsSqlite,
});
