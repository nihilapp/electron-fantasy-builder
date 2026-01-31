import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 아이템 테이블 (로컬 SQLite). prj_no → projects.prj_no.
 */
export const itemsTable = sqliteTable('items', {
  itemNo: integer('item_no').primaryKey({ autoIncrement: true, }),
  prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
  itemNm: text('item_nm').notNull(),
  clsMain: text('cls_main'),
  clsSub: text('cls_sub'),
  itemGrd: text('item_grd'),
  logline: text('logline'),
  appDesc: text('app_desc'),
  visualFeat: text('visual_feat'),
  attrType: text('attr_type'),
  dmgType: text('dmg_type'),
  mainFunc: text('main_func'),
  ...commonColumnsSqlite,
});
