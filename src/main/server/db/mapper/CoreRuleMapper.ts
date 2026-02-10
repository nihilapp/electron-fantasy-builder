import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { CoreRuleListItemVo, CoreRuleVo } from '@app-types/vo.types';
import { coreRuleListItemSchema, coreRuleSchema } from '@zod-schema/coreRule.schema';

import { coreRulesTable as localCoreRulesTable } from '../../schema/local/core_rules.table';
import { coreRulesTable as remoteCoreRulesTable } from '../../schema/remote/core_rules.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

/**
 * @description DB row → 코어룰 VO.
 * @param row DB 결과 한 행
 */
function coreRuleRowToVo(row: Record<string, unknown>): CoreRuleVo {
  return rowToVo(row, coreRuleSchema);
}

/**
 * @description DB row → 코어룰 목록 항목 VO (메타+이름만).
 * @param row DB 결과 한 행 (목록용 select 컬럼만 포함)
 */
function coreRuleListRowToVo(row: Record<string, unknown>): CoreRuleListItemVo {
  return rowToVo(row, coreRuleListItemSchema);
}

type CoreRulesTable = typeof localCoreRulesTable | typeof remoteCoreRulesTable;

export const CoreRuleMapper = {
  /**
   * @description 목록 조회 (prjNo 스코프, del_yn = 'N', core_no 내림차순, 페이징, 검색).
   * 반환 항목은 메타+이름만(식별자, coreNm, 공통 컬럼). 상세 본문은 상세 API에서만 조회.
   * @param prjNo 프로젝트 번호
   * @param params 검색/페이징 파라미터
   */
  async selectList(
    prjNo: number,
    params: CoreRuleVo
  ): Promise<{ list: CoreRuleListItemVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    const createWhere = (table: CoreRulesTable) => {
      let where = and(eq(table.prjNo, prjNo), eq(table.delYn, 'N'))!;
      if (searchKeyword) {
        const keyword = `%${searchKeyword}%`;
        if (searchType === 'coreNm') {
          where = and(where, like(table.coreNm, keyword))!;
        }
        else if (searchType === 'defDesc') {
          where = and(where, like(table.defDesc, keyword))!;
        }
        else {
          where = and(
            where,
            or(
              like(table.coreNm, keyword),
              like(table.defDesc, keyword),
              like(table.tags, keyword)
            )
          )!;
        }
      }
      return where;
    };

    if (mode === 'local') {
      const table = localCoreRulesTable;
      const dbLocal = db as LocalDb;
      const where = createWhere(table);

      const [ countRow, ] = await dbLocal
        .select({ count: count(), })
        .from(table)
        .where(where);
      const totalCnt = Number(countRow?.count ?? 0);

      let query = dbLocal
        .select({
          coreNo: table.coreNo,
          prjNo: table.prjNo,
          coreNm: table.coreNm,
          loreType: table.loreType,
          subLoreType: table.subLoreType,
          useYn: table.useYn,
          shrnYn: table.shrnYn,
          delYn: table.delYn,
          crtNo: table.crtNo,
          crtDt: table.crtDt,
          updtNo: table.updtNo,
          updtDt: table.updtDt,
          delNo: table.delNo,
          delDt: table.delDt,
        })
        .from(table)
        .where(where)
        .orderBy(desc(table.coreNo))
        .$dynamic();

      if (page && pageSize) {
        const offset = (page - 1) * pageSize;
        query = query.limit(pageSize).offset(offset);
      }

      const rows = await query;
      const list = rows.map((row) =>
        coreRuleListRowToVo(row as unknown as Record<string, unknown>)
      );

      return { list, totalCnt, };
    }

    const table = remoteCoreRulesTable;
    const dbRemote = db as RemoteDb;
    const where = createWhere(table);

    const [ countRow, ] = await dbRemote
      .select({ count: count(), })
      .from(table)
      .where(where);
    const totalCnt = Number(countRow?.count ?? 0);

    let query = dbRemote
      .select({
        coreNo: table.coreNo,
        prjNo: table.prjNo,
        coreNm: table.coreNm,
        loreType: table.loreType,
        subLoreType: table.subLoreType,
        useYn: table.useYn,
        shrnYn: table.shrnYn,
        delYn: table.delYn,
        crtNo: table.crtNo,
        crtDt: table.crtDt,
        updtNo: table.updtNo,
        updtDt: table.updtDt,
        delNo: table.delNo,
        delDt: table.delDt,
      })
      .from(table)
      .where(where)
      .orderBy(desc(table.coreNo))
      .$dynamic();

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query = query.limit(pageSize).offset(offset);
    }

    const rows = await query;
    const list = rows.map((row) =>
      coreRuleListRowToVo(row as unknown as Record<string, unknown>)
    );

    return { list, totalCnt, };
  },

  /**
   * @description 상세 조회 (prjNo + coreNo).
   * @param prjNo 프로젝트 번호
   * @param coreNo 코어룰 번호
   */
  async selectByNo(prjNo: number, coreNo: number): Promise<CoreRuleVo | null> {
    const db = getDb();
    const mode = getDbMode();

    const whereByNo = (table: CoreRulesTable) =>
      and(
        eq(table.prjNo, prjNo),
        eq(table.coreNo, coreNo),
        eq(table.delYn, 'N')
      )!;

    if (mode === 'local') {
      const table = localCoreRulesTable;
      const dbLocal = db as LocalDb;
      const [ row, ] = await dbLocal
        .select()
        .from(table)
        .where(whereByNo(table))
        .limit(1);
      return row
        ? coreRuleRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteCoreRulesTable;
    const dbRemote = db as RemoteDb;
    const [ row, ] = await dbRemote
      .select()
      .from(table)
      .where(whereByNo(table))
      .limit(1);
    return row
      ? coreRuleRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 코어룰 생성 (prjNo 필수).
   * @param vo 생성할 VO
   */
  async insert(vo: CoreRuleVo): Promise<CoreRuleVo> {
    const db = getDb();
    const mode = getDbMode();
    const prjNo = vo.prjNo ?? 0;
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      prjNo,
      coreNm: (vo.coreNm ?? '').toString().trim(),
      defDesc: vo.defDesc ?? null,
      aplyScope: vo.aplyScope ?? null,
      strcElem: vo.strcElem ?? null,
      mechDesc: vo.mechDesc ?? null,
      narrAply: vo.narrAply ?? null,
      tags: vo.tags ?? null,
      linkDocs: vo.linkDocs ?? null,
      rmk: vo.rmk ?? null,
      loreType: vo.loreType ?? 'CORE_RULE',
      subLoreType: vo.subLoreType ?? null,
    };

    if (mode === 'local') {
      const table = localCoreRulesTable;
      const dbLocal = db as LocalDb;
      const [ inserted, ] = await dbLocal
        .insert(table)
        .values({ ...values, crtDt: now as string, updtDt: now as string, })
        .returning();
      if (!inserted) throw new Error('CoreRuleMapper.insert: no row returned');
      return coreRuleRowToVo(inserted as unknown as Record<string, unknown>);
    }

    const table = remoteCoreRulesTable;
    const dbRemote = db as RemoteDb;
    const [ inserted, ] = await dbRemote
      .insert(table)
      .values({ ...values, crtDt: now as Date, updtDt: now as Date, })
      .returning();
    if (!inserted) throw new Error('CoreRuleMapper.insert: no row returned');
    return coreRuleRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description 코어룰 수정 (prjNo + coreNo).
   * @param prjNo 프로젝트 번호
   * @param coreNo 코어룰 번호
   * @param vo 수정할 필드 (부분)
   */
  async update(
    prjNo: number,
    coreNo: number,
    vo: Partial<CoreRuleVo>
  ): Promise<CoreRuleVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      coreNm: vo.coreNm ?? undefined,
      defDesc: vo.defDesc ?? undefined,
      aplyScope: vo.aplyScope ?? undefined,
      strcElem: vo.strcElem ?? undefined,
      mechDesc: vo.mechDesc ?? undefined,
      narrAply: vo.narrAply ?? undefined,
      tags: vo.tags ?? undefined,
      linkDocs: vo.linkDocs ?? undefined,
      rmk: vo.rmk ?? undefined,
      loreType: vo.loreType ?? undefined,
      subLoreType: vo.subLoreType ?? undefined,
      updtDt: now,
    };

    const where = and(
      eq(localCoreRulesTable.prjNo, prjNo),
      eq(localCoreRulesTable.coreNo, coreNo)
    );

    if (mode === 'local') {
      const table = localCoreRulesTable;
      const dbLocal = db as LocalDb;
      const [ updated, ] = await dbLocal
        .update(table)
        .set(values as Record<string, unknown>)
        .where(where)
        .returning();
      return updated
        ? coreRuleRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteCoreRulesTable;
    const dbRemote = db as RemoteDb;
    const whereRemote = and(eq(table.prjNo, prjNo), eq(table.coreNo, coreNo));
    const [ updated, ] = await dbRemote
      .update(table)
      .set(values as Record<string, unknown>)
      .where(whereRemote)
      .returning();
    return updated
      ? coreRuleRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 소프트 삭제 (prjNo + coreNo).
   * @param prjNo 프로젝트 번호
   * @param coreNo 코어룰 번호
   */
  async delete(prjNo: number, coreNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    if (mode === 'local') {
      const table = localCoreRulesTable;
      const dbLocal = db as LocalDb;
      const result = await dbLocal
        .update(table)
        .set({ delYn: 'Y', delDt: now as string, })
        .where(and(eq(table.prjNo, prjNo), eq(table.coreNo, coreNo)))
        .returning({ coreNo: table.coreNo, });
      return result.length > 0;
    }

    const table = remoteCoreRulesTable;
    const dbRemote = db as RemoteDb;
    const result = await dbRemote
      .update(table)
      .set({ delYn: 'Y', delDt: now as Date, })
      .where(and(eq(table.prjNo, prjNo), eq(table.coreNo, coreNo)))
      .returning({ coreNo: table.coreNo, });
    return result.length > 0;
  },
};
