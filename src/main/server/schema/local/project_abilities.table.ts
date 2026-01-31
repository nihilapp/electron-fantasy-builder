import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 프로젝트 종속 어빌리티 테이블 (로컬 SQLite). prj_no → projects.prj_no.
 */
export const projectAbilitiesTable = sqliteTable('project_abilities', {
  abilityNo: integer('ability_no').primaryKey({ autoIncrement: true, }),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  abilityNm: text('ability_nm').notNull(),
  abilityType: text('ability_type'),
  abilityLcls: text('ability_lcls'),
  abilityExpln: text('ability_expln'),
  trgtType: text('trgt_type'),
  dmgType: text('dmg_type'),
  statEffType: text('stat_eff_type'),
  useCost: text('use_cost'),
  coolTime: integer('cool_time'),
  castTime: integer('cast_time'),
  useCnd: text('use_cnd'),
  ...commonColumnsSqlite,
});
