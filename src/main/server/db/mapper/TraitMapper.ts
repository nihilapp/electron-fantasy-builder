import { traitSchema } from '@zod-schema/trait.schema';
import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { TraitVo } from '@app-types/vo.types';

import { traitsTable as localTraitsTable } from '../../schema/local/traits.table';
import { traitsTable as remoteTraitsTable } from '../../schema/remote/traits.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

/** DB row → 트레잇 VO (공용 rowToVo + traitSchema) */
function traitRowToVo(row: Record<string, unknown>): TraitVo {
  return rowToVo(row, traitSchema);
}

export const TraitMapper = {
  /** 목록 조회 (del_yn = 'N', trait_no 내림차순, 페이징, 검색) */
  async selectList(params: TraitVo): Promise<{ list: TraitVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    // 공통 검색 조건 생성 로직
    const createWhere = (table: any) => {
      let where = eq(table.delYn, 'N');
      if (searchKeyword) {
        const keyword = `%${searchKeyword}%`;
        if (searchType === 'traitNm') {
          where = and(where, like(table.traitNm, keyword))!;
        }
        else if (searchType === 'traitExpln') {
          where = and(where, like(table.traitExpln, keyword))!;
        }
        else {
          // 전체 검색 (traitNm OR traitExpln)
          where = and(
            where,
            or(like(table.traitNm, keyword), like(table.traitExpln, keyword))
          )!;
        }
      }
      return where;
    };

    if (mode === 'local') {
      const table = localTraitsTable;
      const dbLocal = db as LocalDb;
      const where = createWhere(table);

      const [ countRow, ] = await dbLocal.select({ count: count(), }).from(table).where(where);
      const totalCnt = Number(countRow?.count ?? 0);

      let query = dbLocal
        .select()
        .from(table)
        .where(where)
        .orderBy(desc(table.traitNo))
        .$dynamic();

      if (page && pageSize) {
        const offset = (page - 1) * pageSize;
        query = query.limit(pageSize).offset(offset);
      }

      const rows = await query;
      const list = rows.map((r) => traitRowToVo(r as unknown as Record<string, unknown>));

      return { list, totalCnt, };
    }

    const table = remoteTraitsTable;
    const dbRemote = db as RemoteDb;
    const where = createWhere(table);

    const [ countRow, ] = await dbRemote.select({ count: count(), }).from(table).where(where);
    const totalCnt = Number(countRow?.count ?? 0);

    let query = dbRemote
      .select()
      .from(table)
      .where(where)
      .orderBy(desc(table.traitNo))
      .$dynamic();

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query = query.limit(pageSize).offset(offset);
    }

    const rows = await query;
    const list = rows.map((r) => traitRowToVo(r as unknown as Record<string, unknown>));

    return { list, totalCnt, };
  },

  /** 상세 조회 */
  async selectByNo(traitNo: number): Promise<TraitVo | null> {
    const db = getDb();
    const mode = getDbMode();

    if (mode === 'local') {
      const table = localTraitsTable;
      const dbLocal = db as LocalDb;
      const [ row, ] = await dbLocal.select().from(table).where(eq(table.traitNo, traitNo)).limit(1);
      return row
        ? traitRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteTraitsTable;
    const dbRemote = db as RemoteDb;
    const [ row, ] = await dbRemote.select().from(table).where(eq(table.traitNo, traitNo)).limit(1);
    return row
      ? traitRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /** 생성 */
  async insert(vo: TraitVo): Promise<TraitVo> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      traitNm: (vo.traitNm ?? '').toString().trim(),
      traitExpln: vo.traitExpln ?? null,
      traitLcls: vo.traitLcls ?? null,
      traitMcls: vo.traitMcls ?? null,
      aplyTrgt: vo.aplyTrgt ?? null,
      cnflTraitNo: vo.cnflTraitNo ?? null,
    };

    if (mode === 'local') {
      const table = localTraitsTable;
      const dbLocal = db as LocalDb;
      const [ inserted, ] = await dbLocal
        .insert(table)
        .values({ ...values, crtDt: now as string, updtDt: now as string, })
        .returning();
      if (!inserted) throw new Error('TraitMapper.insert: no row returned');
      return traitRowToVo(inserted as unknown as Record<string, unknown>);
    }

    const table = remoteTraitsTable;
    const dbRemote = db as RemoteDb;
    const [ inserted, ] = await dbRemote
      .insert(table)
      .values({ ...values, crtDt: now as Date, updtDt: now as Date, })
      .returning();
    if (!inserted) throw new Error('TraitMapper.insert: no row returned');
    return traitRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /** 수정 */
  async update(traitNo: number, vo: Partial<TraitVo>): Promise<TraitVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      traitNm: vo.traitNm ?? undefined,
      traitExpln: vo.traitExpln ?? undefined,
      traitLcls: vo.traitLcls ?? undefined,
      traitMcls: vo.traitMcls ?? undefined,
      aplyTrgt: vo.aplyTrgt ?? undefined,
      cnflTraitNo: vo.cnflTraitNo ?? undefined,
      updtDt: now,
    };

    if (mode === 'local') {
      const table = localTraitsTable;
      const dbLocal = db as LocalDb;
      const [ updated, ] = await dbLocal
        .update(table)
        .set(values as any)
        .where(eq(table.traitNo, traitNo))
        .returning();
      return updated
        ? traitRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteTraitsTable;
    const dbRemote = db as RemoteDb;
    const [ updated, ] = await dbRemote
      .update(table)
      .set(values as any)
      .where(eq(table.traitNo, traitNo))
      .returning();
    return updated
      ? traitRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /** 삭제 (Soft Delete) */
  async delete(traitNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    if (mode === 'local') {
      const table = localTraitsTable;
      const dbLocal = db as LocalDb;
      const result = await dbLocal
        .update(table)
        .set({ delYn: 'Y', delDt: now as string, })
        .where(eq(table.traitNo, traitNo))
        .returning({ traitNo: table.traitNo, });
      return result.length > 0;
    }

    const table = remoteTraitsTable;
    const dbRemote = db as RemoteDb;
    const result = await dbRemote
      .update(table)
      .set({ delYn: 'Y', delDt: now as Date, })
      .where(eq(table.traitNo, traitNo))
      .returning({ traitNo: table.traitNo, });
    return result.length > 0;
  },
};
