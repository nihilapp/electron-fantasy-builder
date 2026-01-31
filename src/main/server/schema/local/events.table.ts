import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 사건 테이블 (로컬 SQLite). prj_no → projects.prj_no.
 */
export const eventsTable = sqliteTable('events', {
  eventNo: integer('event_no').primaryKey({ autoIncrement: true, }),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  eventNm: text('event_nm').notNull(),
  occurTime: text('occur_time'),
  occurLoc: text('occur_loc'),
  smry: text('smry'),
  causePub: text('cause_pub'),
  causeReal: text('cause_real'),
  sideAChar: text('side_a_char'),
  sideAOrg: text('side_a_org'),
  sideANtn: text('side_a_ntn'),
  sideBChar: text('side_b_char'),
  sideBOrg: text('side_b_org'),
  sideBNtn: text('side_b_ntn'),
  sideCChar: text('side_c_char'),
  sideCOrg: text('side_c_org'),
  sideCNtn: text('side_c_ntn'),
  flowTrgr: text('flow_trgr'),
  flowCrisis: text('flow_crisis'),
  flowClimax: text('flow_climax'),
  flowConcl: text('flow_concl'),
  dmgRslt: text('dmg_rslt'),
  socChng: text('soc_chng'),
  currConn: text('curr_conn'),
  recOfficial: text('rec_official'),
  truthHid: text('truth_hid'),
  rmk: text('rmk'),
  ...commonColumnsSqlite,
});
