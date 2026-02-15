import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 생물/종족 테이블 (로컬 SQLite). prj_no → projects.prj_no.
 */
export const creaturesTable = sqliteTable('creatures', {
  creatureNo: integer('creature_no').primaryKey({ autoIncrement: true, }),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  creatureNm: text('creature_nm').notNull(),
  creatureType: text('creature_type'),
  dangerGrd: text('danger_grd'),
  identStat: text('ident_stat'),
  creatureExpln: text('creature_expln'),
  loreType: text('lore_type').default('CREATURE'),
  subLoreType: text('sub_lore_type'),
  ...commonColumnsSqlite,
});
