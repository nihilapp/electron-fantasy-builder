import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 전승/설화 테이블 (원격 Postgres). prj_no → projects.prj_no.
 */
export const loresTable = pgTable('lores', {
  loreNo: serial('lore_no').primaryKey(),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  loreNm: text('lore_nm').notNull(),
  loreType: text('lore_type').default('LORE'),
  subLoreType: text('sub_lore_type'),
  mainSubj: text('main_subj'),
  smry: text('smry'),
  transMthd: text('trans_mthd'),
  pubPerc: text('pub_perc'),
  lorePlot: text('lore_plot'),
  realFact: text('real_fact'),
  distRsn: text('dist_rsn'),
  diffDesc: text('diff_desc'),
  cltrImpact: text('cltr_impact'),
  plotConn: text('plot_conn'),
  rmk: text('rmk'),
  ...commonColumnsPg,
});
