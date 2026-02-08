import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { NationVo } from '@app-types/vo.types';
import { nationSchema } from '@zod-schema/nation.schema';

import { nationsTable as localNationsTable } from '../../schema/local/nations.table';
import { nationsTable as remoteNationsTable } from '../../schema/remote/nations.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

/**
 * @description DB row → 국가 VO.
 * @param row DB 결과 한 행
 */
function nationRowToVo(row: Record<string, unknown>): NationVo {
  return rowToVo(row, nationSchema);
}

type NationsTable = typeof localNationsTable | typeof remoteNationsTable;

export const NationMapper = {
  /**
   * @description 목록 조회 (prjNo 스코프, del_yn = 'N', ntn_no 내림차순, 페이징, 검색).
   * @param prjNo 프로젝트 번호
   * @param params 검색/페이징 파라미터
   */
  async selectList(prjNo: number, params: NationVo): Promise<{ list: NationVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    const createWhere = (table: NationsTable) => {
      let where = and(eq(table.prjNo, prjNo), eq(table.delYn, 'N'))!;

      if (searchKeyword) {
        const keyword = `%${searchKeyword}%`;

        if (searchType === 'ntnNm') where = and(where, like(table.ntnNm, keyword))!;
        else if (searchType === 'logline') where = and(where, like(table.logline, keyword))!;
        else where = and(where, or(like(table.ntnNm, keyword), like(table.logline, keyword)))!;
      }

      return where;
    };

    if (mode === 'local') {
      const table = localNationsTable;
      const dbLocal = db as LocalDb;
      const where = createWhere(table);

      const [ countRow, ] = await dbLocal.select({ count: count(), }).from(table).where(where);
      const totalCnt = Number(countRow?.count ?? 0);

      let query = dbLocal.select().from(table).where(where).orderBy(desc(table.ntnNo)).$dynamic();

      if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);

      const rows = await query;

      return { list: rows.map((row) => nationRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
    }

    const table = remoteNationsTable;
    const dbRemote = db as RemoteDb;
    const where = createWhere(table);

    const [ countRow, ] = await dbRemote.select({ count: count(), }).from(table).where(where);
    const totalCnt = Number(countRow?.count ?? 0);

    let query = dbRemote.select().from(table).where(where).orderBy(desc(table.ntnNo)).$dynamic();

    if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);

    const rows = await query;

    return { list: rows.map((row) => nationRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
  },

  /**
   * @description 상세 조회 (prjNo + ntnNo).
   * @param prjNo 프로젝트 번호
   * @param ntnNo 국가 번호
   */
  async selectByNo(prjNo: number, ntnNo: number): Promise<NationVo | null> {
    const db = getDb();
    const mode = getDbMode();

    if (mode === 'local') {
      const [ row, ] = await (db as LocalDb).select().from(localNationsTable).where(and(eq(localNationsTable.prjNo, prjNo), eq(localNationsTable.ntnNo, ntnNo))).limit(1);
      return row
        ? nationRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }

    const [ row, ] = await (db as RemoteDb).select().from(remoteNationsTable).where(and(eq(remoteNationsTable.prjNo, prjNo), eq(remoteNationsTable.ntnNo, ntnNo))).limit(1);
    return row
      ? nationRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 국가 생성.
   * @param vo 생성할 VO
   */
  async insert(vo: NationVo): Promise<NationVo> {
    const db = getDb();
    const mode = getDbMode();
    const prjNo = vo.prjNo ?? 0;
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      prjNo,
      ntnNm: (vo.ntnNm ?? '').toString().trim(),
      ntnType: vo.ntnType ?? null,
      logline: vo.logline ?? null,
      capitalNm: vo.capitalNm ?? null,
      rulerTxt: vo.rulerTxt ?? null,
      polSys: vo.polSys ?? null,
      adminLaw: vo.adminLaw ?? null,
      stateRlgn: vo.stateRlgn ?? null,
      rlgnDesc: vo.rlgnDesc ?? null,
      natIdlg: vo.natIdlg ?? null,
      mainPlcy: vo.mainPlcy ?? null,
      tabooAct: vo.tabooAct ?? null,
      diplPlcy: vo.diplPlcy ?? null,
      intrCnfl: vo.intrCnfl ?? null,
      hiddenFact: vo.hiddenFact ?? null,
      econStruct: vo.econStruct ?? null,
      socCltr: vo.socCltr ?? null,
      milPwr: vo.milPwr ?? null,
      histDesc: vo.histDesc ?? null,
      currIssue: vo.currIssue ?? null,
      loreType: vo.loreType ?? 'NATION',
      subLoreType: vo.subLoreType ?? null,
    };

    if (mode === 'local') {
      const [ inserted, ] = await (db as LocalDb).insert(localNationsTable).values({ ...values, crtDt: now as string, updtDt: now as string, }).returning();
      if (!inserted) throw new Error('NationMapper.insert: no row returned');
      return nationRowToVo(inserted as unknown as Record<string, unknown>);
    }

    const [ inserted, ] = await (db as RemoteDb).insert(remoteNationsTable).values({ ...values, crtDt: now as Date, updtDt: now as Date, }).returning();
    if (!inserted) throw new Error('NationMapper.insert: no row returned');
    return nationRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description 국가 수정 (prjNo + ntnNo).
   * @param prjNo 프로젝트 번호
   * @param ntnNo 국가 번호
   * @param vo 수정할 필드 (부분)
   */
  async update(prjNo: number, ntnNo: number, vo: Partial<NationVo>): Promise<NationVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values: Record<string, unknown> = {
      ntnNm: vo.ntnNm ?? undefined,
      ntnType: vo.ntnType ?? undefined,
      logline: vo.logline ?? undefined,
      capitalNm: vo.capitalNm ?? undefined,
      rulerTxt: vo.rulerTxt ?? undefined,
      polSys: vo.polSys ?? undefined,
      adminLaw: vo.adminLaw ?? undefined,
      stateRlgn: vo.stateRlgn ?? undefined,
      rlgnDesc: vo.rlgnDesc ?? undefined,
      natIdlg: vo.natIdlg ?? undefined,
      mainPlcy: vo.mainPlcy ?? undefined,
      tabooAct: vo.tabooAct ?? undefined,
      diplPlcy: vo.diplPlcy ?? undefined,
      intrCnfl: vo.intrCnfl ?? undefined,
      hiddenFact: vo.hiddenFact ?? undefined,
      econStruct: vo.econStruct ?? undefined,
      socCltr: vo.socCltr ?? undefined,
      milPwr: vo.milPwr ?? undefined,
      histDesc: vo.histDesc ?? undefined,
      currIssue: vo.currIssue ?? undefined,
      loreType: vo.loreType ?? undefined,
      subLoreType: vo.subLoreType ?? undefined,
      updtDt: now,
    };

    if (mode === 'local') {
      const [ updated, ] = await (db as LocalDb).update(localNationsTable).set(values).where(and(eq(localNationsTable.prjNo, prjNo), eq(localNationsTable.ntnNo, ntnNo))).returning();
      return updated
        ? nationRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }

    const [ updated, ] = await (db as RemoteDb).update(remoteNationsTable).set(values).where(and(eq(remoteNationsTable.prjNo, prjNo), eq(remoteNationsTable.ntnNo, ntnNo))).returning();
    return updated
      ? nationRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 소프트 삭제 (prjNo + ntnNo).
   * @param prjNo 프로젝트 번호
   * @param ntnNo 국가 번호
   */
  async delete(prjNo: number, ntnNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    if (mode === 'local') {
      const result = await (db as LocalDb).update(localNationsTable).set({ delYn: 'Y', delDt: now as string, }).where(and(eq(localNationsTable.prjNo, prjNo), eq(localNationsTable.ntnNo, ntnNo))).returning({ ntnNo: localNationsTable.ntnNo, });
      return result.length > 0;
    }

    const result = await (db as RemoteDb).update(remoteNationsTable).set({ delYn: 'Y', delDt: now as Date, }).where(and(eq(remoteNationsTable.prjNo, prjNo), eq(remoteNationsTable.ntnNo, ntnNo))).returning({ ntnNo: remoteNationsTable.ntnNo, });
    return result.length > 0;
  },
};
