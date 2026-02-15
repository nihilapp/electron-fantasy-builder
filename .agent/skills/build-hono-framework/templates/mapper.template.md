
```typescript
import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { __Entity__Vo } from '@app-types/vo.types';
import { __entity__Schema } from '@zod-schema/__entity__.schema';

import { __entity__sTable as local__Entity__sTable } from '../common/schema/local/__entity__s.table';
import { __entity__sTable as remote__Entity__sTable } from '../common/schema/remote/__entity__s.table';
import type { LocalDb } from '../common/db/client/local';
import type { RemoteDb } from '../common/db/client/remote';
import { getDb, getDbMode } from '../common/db/context';

import { rowToVo } from '../common/db/mapper/rowToVo';

/**
 * @description DB row to __Entity__ VO
 */
function __entity__RowToVo(row: Record<string, unknown>): __Entity__Vo {
  return rowToVo(row, __entity__Schema);
}

export const __Entity__Mapper = {
  /**
   * @description Select List (Paging, Search)
   */
  async selectList(params: __Entity__Vo): Promise<{ list: __Entity__Vo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    let table: any;
    let where: any;
    let queryBuilder: any;
    let dbClient: any;

    if (mode === 'local') {
      table = local__Entity__sTable;
      dbClient = db as LocalDb;
    } else {
      table = remote__Entity__sTable;
      dbClient = db as RemoteDb;
    }

    where = eq(table.delYn, 'N');

    if (searchKeyword) {
      const keyword = `%${searchKeyword}%`;
      // Default Search Logic: Name or Description
      // Adjust this based on your columns
      if (table.__entity__Nm) {
         where = and(where, like(table.__entity__Nm, keyword))!;
      }
    }

    const [ countRow, ] = await dbClient.select({ count: count(), }).from(table).where(where);
    const totalCnt = Number(countRow?.count ?? 0);

    let query = dbClient
      .select()
      .from(table)
      .where(where)
      .orderBy(desc(table.__entity__No))
      .$dynamic();

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query = query.limit(pageSize).offset(offset);
    }

    const rows = await query;
    const list = rows.map((row) =>
      __entity__RowToVo(row as unknown as Record<string, unknown>)
    );

    return { list, totalCnt, };
  },

  /**
   * @description Select By Primary Key
   */
  async selectByNo(__entity__No: number): Promise<__Entity__Vo | null> {
    const db = getDb();
    const mode = getDbMode();

    if (mode === 'local') {
      const table = local__Entity__sTable;
      const dbLocal = db as LocalDb;
      const [ row, ] = await dbLocal.select().from(table).where(eq(table.__entity__No, __entity__No)).limit(1);
      return row ? __entity__RowToVo(row as unknown as Record<string, unknown>) : null;
    }

    const table = remote__Entity__sTable;
    const dbRemote = db as RemoteDb;
    const [ row, ] = await dbRemote.select().from(table).where(eq(table.__entity__No, __entity__No)).limit(1);
    return row ? __entity__RowToVo(row as unknown as Record<string, unknown>) : null;
  },

  /**
   * @description Insert
   */
  async insert(vo: __Entity__Vo): Promise<__Entity__Vo> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local' ? new Date().toISOString() : new Date();

    // Map VO to Table Columns
    // IMPORTANT: Check column names in your schema
    const values: any = {
      // __entity__Nm: vo.__entity__Nm,
      crtDt: now,
      updtDt: now,
    };

    if (mode === 'local') {
      const table = local__Entity__sTable;
      const dbLocal = db as LocalDb;
      const [ inserted, ] = await dbLocal.insert(table).values(values).returning();
      if (!inserted) throw new Error('__Entity__Mapper.insert: no row returned');
      return __entity__RowToVo(inserted as unknown as Record<string, unknown>);
    }

    const table = remote__Entity__sTable;
    const dbRemote = db as RemoteDb;
    const [ inserted, ] = await dbRemote.insert(table).values(values).returning();
    if (!inserted) throw new Error('__Entity__Mapper.insert: no row returned');
    return __entity__RowToVo(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description Update
   */
  async update(__entity__No: number, vo: Partial<__Entity__Vo>): Promise<__Entity__Vo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local' ? new Date().toISOString() : new Date();

    const values = {
      ...vo,
      updtDt: now,
    };

    // Remove PK and audit fields if present in VO but not updatable
    delete (values as any).__entity__No;
    delete (values as any).crtDt;
    delete (values as any).crtNo;

    if (mode === 'local') {
      const table = local__Entity__sTable;
      const dbLocal = db as LocalDb;
      const [ updated, ] = await dbLocal.update(table).set(values).where(eq(table.__entity__No, __entity__No)).returning();
      return updated ? __entity__RowToVo(updated as unknown as Record<string, unknown>) : null;
    }

    const table = remote__Entity__sTable;
    const dbRemote = db as RemoteDb;
    const [ updated, ] = await dbRemote.update(table).set(values).where(eq(table.__entity__No, __entity__No)).returning();
    return updated ? __entity__RowToVo(updated as unknown as Record<string, unknown>) : null;
  },

  /**
   * @description Delete (Soft Delete)
   */
  async delete(__entity__No: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local' ? new Date().toISOString() : new Date();

    if (mode === 'local') {
      const table = local__Entity__sTable;
      const dbLocal = db as LocalDb;
      const result = await dbLocal.update(table).set({ delYn: 'Y', delDt: now as string, }).where(eq(table.__entity__No, __entity__No)).returning({ __entity__No: table.__entity__No, });
      return result.length > 0;
    }

    const table = remote__Entity__sTable;
    const dbRemote = db as RemoteDb;
    const result = await dbRemote.update(table).set({ delYn: 'Y', delDt: now as Date, }).where(eq(table.__entity__No, __entity__No)).returning({ __entity__No: table.__entity__No, });
    return result.length > 0;
  },
};
```
