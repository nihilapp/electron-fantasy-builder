import { pgTable, serial, text } from 'drizzle-orm/pg-core';

/**
 * 원격 Postgres용 example 테이블.
 * 로컬 example과 동일 구조. TS 필드명(camelCase) → DB 컬럼명(snake_case) 매핑.
 */
export const exampleTable = pgTable('example', {
  exNo: serial('ex_no').primaryKey(),
  exName: text('ex_name').notNull(),
  exDesc: text('ex_desc'),
});
