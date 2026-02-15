import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

import { projectsTable } from './projects.table';

/**
 * 설정 보호 테이블 (로컬 SQLite).
 * prj_no + (setting_category, setting_no) 논리 참조. FK는 설정 쪽 테이블로 걸지 않음.
 * UNIQUE(prj_no, setting_category, setting_no) → 프로젝트당 동일 설정 1건.
 */
export const settingProtectionsTable = sqliteTable(
  'setting_protections',
  {
    protectionNo: integer('protection_no').primaryKey({ autoIncrement: true, }),
    prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
    settingCategory: text('setting_category').notNull(),
    settingNo: integer('setting_no').notNull(),
    crtDt: text('crt_dt'),
    crtNo: integer('crt_no'),
  },
  (t) => [
    unique('setting_protections_prj_category_no_unique').on(
      t.prjNo,
      t.settingCategory,
      t.settingNo
    ),
  ]
);
