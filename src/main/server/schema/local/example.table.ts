import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * 로컬 SQLite용 example 테이블.
 * TS 필드명(camelCase) → DB 컬럼명(snake_case) 매핑.
 */
export const exampleTable = sqliteTable('example', {
  exNo: integer('ex_no').primaryKey({ autoIncrement: true, }),
  exName: text('ex_name').notNull(),
  exDesc: text('ex_desc'),
});
