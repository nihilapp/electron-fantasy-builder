import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 프로젝트 종속 어빌리티 테이블 (로컬 SQLite). prj_no → projects.prj_no.
 * 권역(domain)·원천(source)·계통(lineage)·형태(form) 필수.
 */
export const projectAbilitiesTable = sqliteTable('project_abilities', {
  abilityNo: integer('ability_no').primaryKey({ autoIncrement: true, }),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  abilityNm: text('ability_nm').notNull(),
  abilityDomain: text('ability_domain').notNull(),
  abilitySource: text('ability_source').notNull(),
  abilityLineage: text('ability_lineage').notNull(),
  abilityForm: text('ability_form').notNull(),
  abilityExpln: text('ability_expln'),
  castTime: integer('cast_time'),
  coolTime: integer('cool_time'),
  dmgType: text('dmg_type'),
  statEffType: text('stat_eff_type'),
  trgtType: text('trgt_type'),
  useCnd: text('use_cnd'),
  useCost: text('use_cost'),
  ...commonColumnsSqlite,
});
