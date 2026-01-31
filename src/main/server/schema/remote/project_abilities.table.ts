import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 프로젝트 종속 어빌리티 테이블 (원격 Postgres). prj_no → projects.prj_no.
 */
export const projectAbilitiesTable = pgTable('project_abilities', {
  abilityNo: serial('ability_no').primaryKey(),
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
  ...commonColumnsPg,
});
