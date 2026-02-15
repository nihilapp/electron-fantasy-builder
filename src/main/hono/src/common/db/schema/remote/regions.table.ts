import { foreignKey, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { nationsTable } from './nations.table';
import { projectsTable } from './projects.table';

/**
 * 지역 테이블 (원격 Postgres). prj_no, up_region_no(자기참조), ntn_no FK.
 */
export const regionsTable = pgTable(
  'regions',
  {
    regionNo: serial('region_no').primaryKey(),
    prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
    upRegionNo: integer('up_region_no'),
    regionNm: text('region_nm').notNull(),
    regionType: text('region_type'),
    explorStat: text('explor_stat'),
    regionExpln: text('region_expln'),
    locDesc: text('loc_desc'),
    climateEnv: text('climate_env'),
    terrainFeat: text('terrain_feat'),
    envSpec: text('env_spec'),
    funcFeat: text('func_feat'),
    dangerLvl: text('danger_lvl'),
    dangerFctr: text('danger_fctr'),
    inhabitInfo: text('inhabit_info'),
    unknownEntity: text('unknown_entity'),
    mainFclty: text('main_fclty'),
    rsrcList: text('rsrc_list'),
    ntnNo: integer('ntn_no').references(() => nationsTable.ntnNo),
    loreType: text('lore_type').default('REGION'),
    subLoreType: text('sub_lore_type'),
    ...commonColumnsPg,
  },
  (regions) => [
    foreignKey({
      columns: [ regions.upRegionNo, ],
      foreignColumns: [ regions.regionNo, ],
    }),
  ]
);
