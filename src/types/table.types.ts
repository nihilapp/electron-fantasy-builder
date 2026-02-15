/**
 * Drizzle 테이블 타이핑.
 * GET(select) / POST(insert) 시 사용하는 row 타입.
 * 스키마에서 InferSelectModel / InferInsertModel 로 추론합니다.
 *
 * @see https://orm.drizzle.team/docs/select — 결과 타입 자동 추론
 * @see drizzle-orm table.d.ts — $inferSelect, $inferInsert, InferSelectModel, InferInsertModel
 */

import { exampleTable } from '@main/hono/schema/local';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

/** example 테이블 — GET(select) 결과 타입 */
export type ExampleTableGet = InferSelectModel<typeof exampleTable>;

/** example 테이블 — POST(insert) 시 전달 타입 (exNo는 autoIncrement/serial로 생략 가능) */
export type ExampleTablePost = InferInsertModel<typeof exampleTable>;
