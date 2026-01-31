import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

import { commonColumnsPg } from './common.columns';
import { eventsTable } from './events.table';

/**
 * 사건-엔트리 매핑 테이블 (원격 Postgres). event_no → events.event_no.
 */
export const eventEntriesTable = pgTable('event_entries', {
  entryNo: serial('entry_no').primaryKey(),
  eventNo: integer('event_no').notNull().references(() => eventsTable.eventNo),
  entryType: varchar('entry_type', { length: 50, }).notNull(),
  entryTrgtNo: integer('entry_trgt_no').notNull(),
  entrySide: varchar('entry_side', { length: 20, }),
  roleDesc: text('role_desc'),
  ...commonColumnsPg,
});
