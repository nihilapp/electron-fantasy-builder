import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';

/**
 * 전역 어빌리티 테이블 (로컬 SQLite).
 */
export const abilitiesTable = sqliteTable('abilities', {
  abilityNo: integer('ability_no').primaryKey({ autoIncrement: true, }),
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
