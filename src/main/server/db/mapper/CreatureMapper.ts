import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { CreatureVo } from '@app-types/vo.types';
import { creatureSchema } from '@zod-schema/creature.schema';

import { creaturesTable as localCreaturesTable } from '../../schema/local/creatures.table';
import { creaturesTable as remoteCreaturesTable } from '../../schema/remote/creatures.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

/**
 * @description DB row → 종족 VO.
 * @param row DB 결과 한 행
 */
function creatureRowToVo(row: Record<string, unknown>): CreatureVo {
  return rowToVo(row, creatureSchema);
}

type CreaturesTable = typeof localCreaturesTable | typeof remoteCreaturesTable;

export const CreatureMapper = {
  /**
   * @description 목록 조회 (prjNo 스코프, del_yn = 'N', creature_no 내림차순, 페이징, 검색).
   * @param prjNo 프로젝트 번호
   * @param params 검색/페이징 파라미터
   */
  async selectList(
    prjNo: number,
    params: CreatureVo
  ): Promise<{ list: CreatureVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    const createWhere = (table: CreaturesTable) => {
      let where = and(eq(table.prjNo, prjNo), eq(table.delYn, 'N'))!;
      if (searchKeyword) {
        const keyword = `%${searchKeyword}%`;
        if (searchType === 'creatureNm') {
          where = and(where, like(table.creatureNm, keyword))!;
        }
        else if (searchType === 'creatureExpln') {
          where = and(where, like(table.creatureExpln, keyword))!;
        }
        else {
          where = and(
            where,
            or(like(table.creatureNm, keyword), like(table.creatureExpln, keyword))
          )!;
        }
      }
      return where;
    };

    if (mode === 'local') {
      const table = localCreaturesTable;
      const dbLocal = db as LocalDb;
      const where = createWhere(table);

      const [ countRow, ] = await dbLocal
        .select({ count: count(), })
        .from(table)
        .where(where);
      const totalCnt = Number(countRow?.count ?? 0);

      let query = dbLocal
        .select()
        .from(table)
        .where(where)
        .orderBy(desc(table.creatureNo))
        .$dynamic();

      if (page && pageSize) {
        const offset = (page - 1) * pageSize;
        query = query.limit(pageSize).offset(offset);
      }

      const rows = await query;
      const list = rows.map((row) =>
        creatureRowToVo(row as unknown as Record<string, unknown>)
      );

      return { list, totalCnt, };
    }

    const table = remoteCreaturesTable;
    const dbRemote = db as RemoteDb;
    const where = createWhere(table);

    const [ countRow, ] = await dbRemote
      .select({ count: count(), })
      .from(table)
      .where(where);
    const totalCnt = Number(countRow?.count ?? 0);

    let query = dbRemote
      .select()
      .from(table)
      .where(where)
      .orderBy(desc(table.creatureNo))
      .$dynamic();

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query = query.limit(pageSize).offset(offset);
    }

    const rows = await query;
    const list = rows.map((row) =>
      creatureRowToVo(row as unknown as Record<string, unknown>)
    );

    return { list, totalCnt, };
  },

  /**
   * @description 상세 조회 (prjNo + creatureNo).
   * @param prjNo 프로젝트 번호
   * @param creatureNo 종족 번호
   */
  async selectByNo(prjNo: number, creatureNo: number): Promise<CreatureVo | null> {
    const db = getDb();
    const mode = getDbMode();

    if (mode === 'local') {
      const table = localCreaturesTable;
      const dbLocal = db as LocalDb;
      const [ row, ] = await dbLocal
        .select()
        .from(table)
        .where(and(eq(table.prjNo, prjNo), eq(table.creatureNo, creatureNo)))
        .limit(1);
      return row
        ? creatureRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteCreaturesTable;
    const dbRemote = db as RemoteDb;
    const [ row, ] = await dbRemote
      .select()
      .from(table)
      .where(and(eq(table.prjNo, prjNo), eq(table.creatureNo, creatureNo)))
      .limit(1);
    return row
      ? creatureRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 생성 (prjNo 필수).
   * @param vo 생성할 VO
   */
  async insert(vo: CreatureVo): Promise<CreatureVo> {
    const db = getDb();
    const mode = getDbMode();
    const prjNo = vo.prjNo ?? 0;
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      prjNo,
      creatureNm: (vo.creatureNm ?? '').toString().trim(),
      creatureType: vo.creatureType ?? null,
      dangerGrd: vo.dangerGrd ?? null,
      identStat: vo.identStat ?? null,
      creatureExpln: vo.creatureExpln ?? null,
    };

    if (mode === 'local') {
      const table = localCreaturesTable;
      const dbLocal = db as LocalDb;
      const [ inserted, ] = await dbLocal
        .insert(table)
        .values({ ...values, crtDt: now as string, updtDt: now as string, })
        .returning();
      if (!inserted) throw new Error('CreatureMapper.insert: no row returned');
      return creatureRowToVo(inserted as unknown as Record<string, unknown>);
    }

    const table = remoteCreaturesTable;
    const dbRemote = db as RemoteDb;
    const [ inserted, ] = await dbRemote
      .insert(table)
      .values({ ...values, crtDt: now as Date, updtDt: now as Date, })
      .returning();
    if (!inserted) throw new Error('CreatureMapper.insert: no row returned');
    return creatureRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description 수정 (prjNo + creatureNo).
   * @param prjNo 프로젝트 번호
   * @param creatureNo 종족 번호
   * @param vo 수정할 필드 (부분)
   */
  async update(
    prjNo: number,
    creatureNo: number,
    vo: Partial<CreatureVo>
  ): Promise<CreatureVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      creatureNm: vo.creatureNm ?? undefined,
      creatureType: vo.creatureType ?? undefined,
      dangerGrd: vo.dangerGrd ?? undefined,
      identStat: vo.identStat ?? undefined,
      creatureExpln: vo.creatureExpln ?? undefined,
      updtDt: now,
    };

    const where = and(
      eq(localCreaturesTable.prjNo, prjNo),
      eq(localCreaturesTable.creatureNo, creatureNo)
    );

    if (mode === 'local') {
      const table = localCreaturesTable;
      const dbLocal = db as LocalDb;
      const [ updated, ] = await dbLocal
        .update(table)
        .set(values as Record<string, unknown>)
        .where(where)
        .returning();
      return updated
        ? creatureRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteCreaturesTable;
    const dbRemote = db as RemoteDb;
    const whereRemote = and(eq(table.prjNo, prjNo), eq(table.creatureNo, creatureNo));
    const [ updated, ] = await dbRemote
      .update(table)
      .set(values as Record<string, unknown>)
      .where(whereRemote)
      .returning();
    return updated
      ? creatureRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 소프트 삭제 (prjNo + creatureNo).
   * @param prjNo 프로젝트 번호
   * @param creatureNo 종족 번호
   */
  async delete(prjNo: number, creatureNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    if (mode === 'local') {
      const table = localCreaturesTable;
      const dbLocal = db as LocalDb;
      const result = await dbLocal
        .update(table)
        .set({ delYn: 'Y', delDt: now as string, })
        .where(and(eq(table.prjNo, prjNo), eq(table.creatureNo, creatureNo)))
        .returning({ creatureNo: table.creatureNo, });
      return result.length > 0;
    }

    const table = remoteCreaturesTable;
    const dbRemote = db as RemoteDb;
    const result = await dbRemote
      .update(table)
      .set({ delYn: 'Y', delDt: now as Date, })
      .where(and(eq(table.prjNo, prjNo), eq(table.creatureNo, creatureNo)))
      .returning({ creatureNo: table.creatureNo, });
    return result.length > 0;
  },
};
