import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';

/**
 * 전역 어빌리티 테이블 (원격 Postgres).
 */
export const abilitiesTable = pgTable('abilities', {
  abilityNo: serial('ability_no').primaryKey(),
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
