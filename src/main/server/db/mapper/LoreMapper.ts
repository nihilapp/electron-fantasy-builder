import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { LoreVo } from '@app-types/vo.types';
import { loreSchema } from '@zod-schema/lore.schema';

import { loresTable as localLoresTable } from '../../schema/local/lores.table';
import { loresTable as remoteLoresTable } from '../../schema/remote/lores.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

/**
 * @description DB row → 전승/설화 VO.
 * @param row DB 결과 한 행
 */
function loreRowToVo(row: Record<string, unknown>): LoreVo {
  return rowToVo(row, loreSchema);
}

type LoresTable = typeof localLoresTable | typeof remoteLoresTable;

export const LoreMapper = {
  /**
   * @description 목록 조회 (prjNo 스코프, del_yn = 'N', lore_no 내림차순, 페이징, 검색).
   * @param prjNo 프로젝트 번호
   * @param params 검색/페이징 파라미터
   */
  async selectList(prjNo: number, params: LoreVo): Promise<{ list: LoreVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;
    const createWhere = (table: LoresTable) => {
      let where = and(eq(table.prjNo, prjNo), eq(table.delYn, 'N'))!;
      if (searchKeyword) {
        const keyword = `%${searchKeyword}%`;
        if (searchType === 'loreNm') where = and(where, like(table.loreNm, keyword))!;
        else if (searchType === 'smry') where = and(where, like(table.smry, keyword))!;
        else where = and(where, or(like(table.loreNm, keyword), like(table.smry, keyword)))!;
      }
      return where;
    };
    if (mode === 'local') {
      const table = localLoresTable;
      const dbLocal = db as LocalDb;
      const where = createWhere(table);
      const [ countRow, ] = await dbLocal.select({ count: count(), }).from(table).where(where);
      const totalCnt = Number(countRow?.count ?? 0);
      let query = dbLocal.select().from(table).where(where).orderBy(desc(table.loreNo)).$dynamic();
      if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);
      const rows = await query;
      return { list: rows.map((row) => loreRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
    }
    const table = remoteLoresTable;
    const dbRemote = db as RemoteDb;
    const where = createWhere(table);
    const [ countRow, ] = await dbRemote.select({ count: count(), }).from(table).where(where);
    const totalCnt = Number(countRow?.count ?? 0);
    let query = dbRemote.select().from(table).where(where).orderBy(desc(table.loreNo)).$dynamic();
    if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);
    const rows = await query;
    return { list: rows.map((row) => loreRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
  },

  /**
   * @description 상세 조회 (prjNo + loreNo).
   * @param prjNo 프로젝트 번호
   * @param loreNo 전승/설화 번호
   */
  async selectByNo(prjNo: number, loreNo: number): Promise<LoreVo | null> {
    const db = getDb();
    const mode = getDbMode();
    if (mode === 'local') {
      const [ row, ] = await (db as LocalDb).select().from(localLoresTable).where(and(eq(localLoresTable.prjNo, prjNo), eq(localLoresTable.loreNo, loreNo))).limit(1);
      return row
        ? loreRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }
    const [ row, ] = await (db as RemoteDb).select().from(remoteLoresTable).where(and(eq(remoteLoresTable.prjNo, prjNo), eq(remoteLoresTable.loreNo, loreNo))).limit(1);
    return row
      ? loreRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 전승/설화 생성.
   * @param vo 생성할 VO
   */
  async insert(vo: LoreVo): Promise<LoreVo> {
    const db = getDb();
    const mode = getDbMode();
    const prjNo = vo.prjNo ?? 0;
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();
    const values = {
      prjNo,
      loreNm: (vo.loreNm ?? '').toString().trim(),
      loreType: vo.loreType ?? null,
      mainSubj: vo.mainSubj ?? null,
      smry: vo.smry ?? null,
      transMthd: vo.transMthd ?? null,
      pubPerc: vo.pubPerc ?? null,
      lorePlot: vo.lorePlot ?? null,
      realFact: vo.realFact ?? null,
      distRsn: vo.distRsn ?? null,
      diffDesc: vo.diffDesc ?? null,
      cltrImpact: vo.cltrImpact ?? null,
      plotConn: vo.plotConn ?? null,
      rmk: vo.rmk ?? null,
    };
    if (mode === 'local') {
      const [ inserted, ] = await (db as LocalDb).insert(localLoresTable).values({ ...values, crtDt: now as string, updtDt: now as string, }).returning();
      if (!inserted) throw new Error('LoreMapper.insert: no row returned');
      return loreRowToVo(inserted as unknown as Record<string, unknown>);
    }
    const [ inserted, ] = await (db as RemoteDb).insert(remoteLoresTable).values({ ...values, crtDt: now as Date, updtDt: now as Date, }).returning();
    if (!inserted) throw new Error('LoreMapper.insert: no row returned');
    return loreRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description 전승/설화 수정 (prjNo + loreNo).
   * @param prjNo 프로젝트 번호
   * @param loreNo 전승/설화 번호
   * @param vo 수정할 필드 (부분)
   */
  async update(prjNo: number, loreNo: number, vo: Partial<LoreVo>): Promise<LoreVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();
    const values: Record<string, unknown> = {
      loreNm: vo.loreNm ?? undefined,
      loreType: vo.loreType ?? undefined,
      mainSubj: vo.mainSubj ?? undefined,
      smry: vo.smry ?? undefined,
      transMthd: vo.transMthd ?? undefined,
      pubPerc: vo.pubPerc ?? undefined,
      lorePlot: vo.lorePlot ?? undefined,
      realFact: vo.realFact ?? undefined,
      distRsn: vo.distRsn ?? undefined,
      diffDesc: vo.diffDesc ?? undefined,
      cltrImpact: vo.cltrImpact ?? undefined,
      plotConn: vo.plotConn ?? undefined,
      rmk: vo.rmk ?? undefined,
      updtDt: now,
    };
    if (mode === 'local') {
      const [ updated, ] = await (db as LocalDb).update(localLoresTable).set(values).where(and(eq(localLoresTable.prjNo, prjNo), eq(localLoresTable.loreNo, loreNo))).returning();
      return updated
        ? loreRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }
    const [ updated, ] = await (db as RemoteDb).update(remoteLoresTable).set(values).where(and(eq(remoteLoresTable.prjNo, prjNo), eq(remoteLoresTable.loreNo, loreNo))).returning();
    return updated
      ? loreRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 소프트 삭제 (prjNo + loreNo).
   * @param prjNo 프로젝트 번호
   * @param loreNo 전승/설화 번호
   */
  async delete(prjNo: number, loreNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();
    if (mode === 'local') {
      const result = await (db as LocalDb).update(localLoresTable).set({ delYn: 'Y', delDt: now as string, }).where(and(eq(localLoresTable.prjNo, prjNo), eq(localLoresTable.loreNo, loreNo))).returning({ loreNo: localLoresTable.loreNo, });
      return result.length > 0;
    }
    const result = await (db as RemoteDb).update(remoteLoresTable).set({ delYn: 'Y', delDt: now as Date, }).where(and(eq(remoteLoresTable.prjNo, prjNo), eq(remoteLoresTable.loreNo, loreNo))).returning({ loreNo: remoteLoresTable.loreNo, });
    return result.length > 0;
  },
};
