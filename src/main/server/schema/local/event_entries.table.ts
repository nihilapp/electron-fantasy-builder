import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { commonColumnsSqlite } from './common.columns';
import { eventsTable } from './events.table';

/**
 * 사건-엔트리 매핑 테이블 (로컬 SQLite). event_no → events.event_no.
 */
export const eventEntriesTable = sqliteTable('event_entries', {
  entryNo: integer('entry_no').primaryKey({ autoIncrement: true, }),
  eventNo: integer('event_no').notNull().references(() => eventsTable.eventNo),
  entryType: text('entry_type').notNull(),
  entryTrgtNo: integer('entry_trgt_no').notNull(),
  entrySide: text('entry_side'),
  roleDesc: text('role_desc'),
  ...commonColumnsSqlite,
});
