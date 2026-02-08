import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { CharacterVo } from '@app-types/vo.types';
import { characterSchema } from '@zod-schema/character.schema';

import { charactersTable as localCharactersTable } from '../../schema/local/characters.table';
import { charactersTable as remoteCharactersTable } from '../../schema/remote/characters.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

/**
 * @description DB row → 인물 VO.
 * @param row DB 결과 한 행
 */
function characterRowToVo(row: Record<string, unknown>): CharacterVo {
  return rowToVo(row, characterSchema);
}

type CharactersTable = typeof localCharactersTable | typeof remoteCharactersTable;

export const CharacterMapper = {
  /**
   * @description 목록 조회 (prjNo 스코프, del_yn = 'N', char_no 내림차순, 페이징, 검색).
   * @param prjNo 프로젝트 번호
   * @param params 검색/페이징 파라미터
   */
  async selectList(
    prjNo: number,
    params: CharacterVo
  ): Promise<{ list: CharacterVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    const createWhere = (table: CharactersTable) => {
      let where = and(eq(table.prjNo, prjNo), eq(table.delYn, 'N'))!;

      if (searchKeyword) {
        const keyword = `%${searchKeyword}%`;

        if (searchType === 'charNm') {
          where = and(where, like(table.charNm, keyword))!;
        }
        else if (searchType === 'logline') {
          where = and(where, like(table.logline, keyword))!;
        }
        else {
          where = and(
            where,
            or(like(table.charNm, keyword), like(table.logline, keyword))
          )!;
        }
      }

      return where;
    };

    if (mode === 'local') {
      const table = localCharactersTable;
      const dbLocal = db as LocalDb;
      const where = createWhere(table);

      const [ countRow, ] = await dbLocal.select({ count: count(), }).from(table).where(where);
      const totalCnt = Number(countRow?.count ?? 0);

      let query = dbLocal.select().from(table).where(where).orderBy(desc(table.charNo)).$dynamic();

      if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);

      const rows = await query;

      return { list: rows.map((row) => characterRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
    }

    const table = remoteCharactersTable;
    const dbRemote = db as RemoteDb;
    const where = createWhere(table);

    const [ countRow, ] = await dbRemote.select({ count: count(), }).from(table).where(where);
    const totalCnt = Number(countRow?.count ?? 0);

    let query = dbRemote.select().from(table).where(where).orderBy(desc(table.charNo)).$dynamic();

    if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);

    const rows = await query;

    return { list: rows.map((row) => characterRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
  },

  /**
   * @description 상세 조회 (prjNo + charNo).
   * @param prjNo 프로젝트 번호
   * @param charNo 인물 번호
   */
  async selectByNo(prjNo: number, charNo: number): Promise<CharacterVo | null> {
    const db = getDb();
    const mode = getDbMode();

    if (mode === 'local') {
      const table = localCharactersTable;
      const dbLocal = db as LocalDb;
      const [ row, ] = await dbLocal.select().from(table).where(and(eq(table.prjNo, prjNo), eq(table.charNo, charNo))).limit(1);
      return row
        ? characterRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteCharactersTable;
    const dbRemote = db as RemoteDb;
    const [ row, ] = await dbRemote.select().from(table).where(and(eq(table.prjNo, prjNo), eq(table.charNo, charNo))).limit(1);
    return row
      ? characterRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 인물 생성.
   * @param vo 생성할 VO
   */
  async insert(vo: CharacterVo): Promise<CharacterVo> {
    const db = getDb();
    const mode = getDbMode();
    const prjNo = vo.prjNo ?? 0;
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      prjNo,
      charNm: (vo.charNm ?? '').toString().trim(),
      aliasNm: vo.aliasNm ?? null,
      roleType: vo.roleType ?? null,
      logline: vo.logline ?? null,
      narrFunc: vo.narrFunc ?? null,
      raceNo: vo.raceNo ?? null,
      ntnNo: vo.ntnNo ?? null,
      orgNo: vo.orgNo ?? null,
      orgRank: vo.orgRank ?? null,
      loreType: vo.loreType ?? 'CHARACTER',
      subLoreType: vo.subLoreType ?? null,
    };

    if (mode === 'local') {
      const [ inserted, ] = await (db as LocalDb).insert(localCharactersTable).values({ ...values, crtDt: now as string, updtDt: now as string, }).returning();
      if (!inserted) throw new Error('CharacterMapper.insert: no row returned');
      return characterRowToVo(inserted as unknown as Record<string, unknown>);
    }

    const [ inserted, ] = await (db as RemoteDb).insert(remoteCharactersTable).values({ ...values, crtDt: now as Date, updtDt: now as Date, }).returning();
    if (!inserted) throw new Error('CharacterMapper.insert: no row returned');
    return characterRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description 인물 수정 (prjNo + charNo).
   * @param prjNo 프로젝트 번호
   * @param charNo 인물 번호
   * @param vo 수정할 필드 (부분)
   */
  async update(prjNo: number, charNo: number, vo: Partial<CharacterVo>): Promise<CharacterVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values: Record<string, unknown> = {
      charNm: vo.charNm ?? undefined,
      aliasNm: vo.aliasNm ?? undefined,
      roleType: vo.roleType ?? undefined,
      logline: vo.logline ?? undefined,
      narrFunc: vo.narrFunc ?? undefined,
      raceNo: vo.raceNo ?? undefined,
      ntnNo: vo.ntnNo ?? undefined,
      orgNo: vo.orgNo ?? undefined,
      orgRank: vo.orgRank ?? undefined,
      loreType: vo.loreType ?? undefined,
      subLoreType: vo.subLoreType ?? undefined,
      updtDt: now,
    };

    if (mode === 'local') {
      const [ updated, ] = await (db as LocalDb).update(localCharactersTable).set(values).where(and(eq(localCharactersTable.prjNo, prjNo), eq(localCharactersTable.charNo, charNo))).returning();
      return updated
        ? characterRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }

    const [ updated, ] = await (db as RemoteDb).update(remoteCharactersTable).set(values).where(and(eq(remoteCharactersTable.prjNo, prjNo), eq(remoteCharactersTable.charNo, charNo))).returning();
    return updated
      ? characterRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 소프트 삭제 (prjNo + charNo).
   * @param prjNo 프로젝트 번호
   * @param charNo 인물 번호
   */
  async delete(prjNo: number, charNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    if (mode === 'local') {
      const result = await (db as LocalDb).update(localCharactersTable).set({ delYn: 'Y', delDt: now as string, }).where(and(eq(localCharactersTable.prjNo, prjNo), eq(localCharactersTable.charNo, charNo))).returning({ charNo: localCharactersTable.charNo, });
      return result.length > 0;
    }

    const result = await (db as RemoteDb).update(remoteCharactersTable).set({ delYn: 'Y', delDt: now as Date, }).where(and(eq(remoteCharactersTable.prjNo, prjNo), eq(remoteCharactersTable.charNo, charNo))).returning({ charNo: remoteCharactersTable.charNo, });
    return result.length > 0;
  },
};
