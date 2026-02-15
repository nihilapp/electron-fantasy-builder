import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 조직 테이블 (원격 Postgres). prj_no → projects.prj_no.
 */
export const organizationsTable = pgTable('organizations', {
  orgNo: serial('org_no').primaryKey(),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  orgNm: text('org_nm').notNull(),
  orgType: text('org_type'),
  logline: text('logline'),
  orgTheme: text('org_theme'),
  purpPub: text('purp_pub'),
  purpHid: text('purp_hid'),
  fndBg: text('fnd_bg'),
  orgStrc: text('org_strc'),
  orgScale: text('org_scale'),
  joinCond: text('join_cond'),
  exitRule: text('exit_rule'),
  mainAct: text('main_act'),
  actArea: text('act_area'),
  actMthd: text('act_mthd'),
  fundSrc: text('fund_src'),
  keyFig: text('key_fig'),
  histDesc: text('hist_desc'),
  currStat: text('curr_stat'),
  loreType: text('lore_type').default('ORGANIZATION'),
  subLoreType: text('sub_lore_type'),
  ...commonColumnsPg,
});
