import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 생물/종족 테이블 (원격 Postgres). prj_no → projects.prj_no.
 */
export const creaturesTable = pgTable('creatures', {
  creatureNo: serial('creature_no').primaryKey(),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  creatureNm: text('creature_nm').notNull(),
  creatureType: text('creature_type'),
  dangerGrd: text('danger_grd'),
  identStat: text('ident_stat'),
  creatureExpln: text('creature_expln'),
  loreType: text('lore_type').default('CREATURE'),
  subLoreType: text('sub_lore_type'),
  ...commonColumnsPg,
});
