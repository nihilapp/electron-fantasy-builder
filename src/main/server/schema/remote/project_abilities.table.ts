import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 프로젝트 종속 어빌리티 테이블 (원격 Postgres). prj_no → projects.prj_no.
 * 권역(domain)·원천(source)·계통(lineage)·형태(form) 필수.
 * 텍스트 컬럼은 글자 수 제한 없음 (text).
 */
export const projectAbilitiesTable = pgTable('project_abilities', {
  abilityNo: serial('ability_no').primaryKey(),
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
  ...commonColumnsPg,
});
