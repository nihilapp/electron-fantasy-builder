import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { projectsTable } from './projects.table';

/**
 * 아이템 테이블 (원격 Postgres). prj_no → projects.prj_no.
 */
export const itemsTable = pgTable('items', {
  itemNo: serial('item_no').primaryKey(),
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
  loreType: text('lore_type').default('ITEM'),
  subLoreType: text('sub_lore_type'),
  ...commonColumnsPg,
});
