import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { creaturesTable } from './creatures.table';
import { nationsTable } from './nations.table';
import { organizationsTable } from './organizations.table';
import { projectsTable } from './projects.table';

/**
 * 인물 테이블 (원격 Postgres). prj_no, race_no, ntn_no, org_no FK.
 */
export const charactersTable = pgTable('characters', {
  charNo: serial('char_no').primaryKey(),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  charNm: text('char_nm').notNull(),
  aliasNm: text('alias_nm'),
  roleType: text('role_type'),
  logline: text('logline'),
  narrFunc: text('narr_func'),
  raceNo: integer('race_no').references(() => creaturesTable.creatureNo),
  ntnNo: integer('ntn_no').references(() => nationsTable.ntnNo),
  orgNo: integer('org_no').references(() => organizationsTable.orgNo),
  orgRank: text('org_rank'),
  ...commonColumnsPg,
});
