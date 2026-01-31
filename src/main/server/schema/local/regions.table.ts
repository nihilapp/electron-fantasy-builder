import { foreignKey, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { nationsTable } from './nations.table';
import { projectsTable } from './projects.table';

/**
 * 지역 테이블 (로컬 SQLite). prj_no, up_region_no(자기참조), ntn_no FK.
 */
export const regionsTable = sqliteTable(
  'regions',
  {
    regionNo: integer('region_no').primaryKey({ autoIncrement: true, }),
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
    ...commonColumnsSqlite,
  },
  (regions) => [
    foreignKey({
      columns: [ regions.upRegionNo, ],
      foreignColumns: [ regions.regionNo, ],
    }),
  ]
);
