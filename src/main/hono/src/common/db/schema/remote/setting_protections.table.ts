import { bigint, integer, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';

import { projectsTable } from './projects.table';

/**
 * 설정 보호 테이블 (원격 Postgres).
 * prj_no + (setting_category, setting_no) 논리 참조. FK는 설정 쪽 테이블로 걸지 않음.
 * UNIQUE(prj_no, setting_category, setting_no) → 프로젝트당 동일 설정 1건.
 */
export const settingProtectionsTable = pgTable(
  'setting_protections',
  {
    protectionNo: serial('protection_no').primaryKey(),
    prjNo: integer('prj_no').notNull().references(() => projectsTable.prjNo),
    settingCategory: text('setting_category').notNull(),
    settingNo: bigint('setting_no', { mode: 'number', }).notNull(),
    crtDt: timestamp('crt_dt'),
    crtNo: bigint('crt_no', { mode: 'number', }),
  },
  (t) => [
    unique('setting_protections_prj_category_no_unique').on(
      t.prjNo,
      t.settingCategory,
      t.settingNo
    ),
  ]
);
