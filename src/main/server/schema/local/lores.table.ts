import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 전승/설화 테이블 (로컬 SQLite). prj_no → projects.prj_no.
 */
export const loresTable = sqliteTable('lores', {
  loreNo: integer('lore_no').primaryKey({ autoIncrement: true, }),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  loreNm: text('lore_nm').notNull(),
  loreType: text('lore_type'),
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
  ...commonColumnsSqlite,
});
