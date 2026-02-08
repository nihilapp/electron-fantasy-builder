import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { creaturesTable } from './creatures.table';
import { nationsTable } from './nations.table';
import { organizationsTable } from './organizations.table';
import { projectsTable } from './projects.table';

/**
 * 인물 테이블 (로컬 SQLite). prj_no, race_no, ntn_no, org_no FK.
 */
export const charactersTable = sqliteTable('characters', {
  charNo: integer('char_no').primaryKey({ autoIncrement: true, }),
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
  loreType: text('lore_type').default('CHARACTER'),
  subLoreType: text('sub_lore_type'),
  ...commonColumnsSqlite,
});
