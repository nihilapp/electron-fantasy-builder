import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 사건 테이블 (원격 Postgres). prj_no → projects.prj_no.
 */
export const eventsTable = pgTable('events', {
  eventNo: serial('event_no').primaryKey(),
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
  ...commonColumnsPg,
});
