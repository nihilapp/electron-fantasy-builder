import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { RegionVo } from '@app-types/vo.types';
import { regionSchema } from '@zod-schema/region.schema';

import type { LocalDb } from '../common/db/client/local';
import type { RemoteDb } from '../common/db/client/remote';
import { getDb } from '../common/db/context';
import { getDbMode } from '../common/db/context';
import { rowToVo } from '../common/db/rowToVo';
import { regionsTable as localRegionsTable } from '../common/db/schema/local/regions.table';
import { regionsTable as remoteRegionsTable } from '../common/db/schema/remote/regions.table';

/**
 * @description DB row → 지역 VO.
 * @param row DB 결과 한 행
 */
function regionRowToVo(row: Record<string, unknown>): RegionVo {
  return rowToVo(row, regionSchema);
}

type RegionsTable = typeof localRegionsTable | typeof remoteRegionsTable;

export const RegionMapper = {
  /**
   * @description 목록 조회 (prjNo 스코프, del_yn = 'N', region_no 내림차순, 페이징, 검색).
   * @param prjNo 프로젝트 번호
   * @param params 검색/페이징 파라미터
   */
  async selectList(prjNo: number, params: RegionVo): Promise<{ list: RegionVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    const createWhere = (table: RegionsTable) => {
      let where = and(eq(table.prjNo, prjNo), eq(table.delYn, 'N'))!;

      if (searchKeyword) {
        const keyword = `%${searchKeyword}%`;

        if (searchType === 'regionNm') where = and(where, like(table.regionNm, keyword))!;
        else if (searchType === 'regionExpln') where = and(where, like(table.regionExpln, keyword))!;
        else {
          where = and(
            where,
            or(
              like(table.regionNm, keyword),
              like(table.regionExpln, keyword),
              like(table.tags, keyword)
            )
          )!;
        }
      }

      return where;
    };

    if (mode === 'local') {
      const table = localRegionsTable;
      const dbLocal = db as LocalDb;
      const where = createWhere(table);

      const [ countRow, ] = await dbLocal.select({ count: count(), }).from(table).where(where);
      const totalCnt = Number(countRow?.count ?? 0);

      let query = dbLocal.select().from(table).where(where).orderBy(desc(table.regionNo)).$dynamic();

      if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);

      const rows = await query;

      return { list: rows.map((row) => regionRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
    }

    const table = remoteRegionsTable;
    const dbRemote = db as RemoteDb;
    const where = createWhere(table);

    const [ countRow, ] = await dbRemote.select({ count: count(), }).from(table).where(where);
    const totalCnt = Number(countRow?.count ?? 0);

    let query = dbRemote.select().from(table).where(where).orderBy(desc(table.regionNo)).$dynamic();

    if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);

    const rows = await query;

    return { list: rows.map((row) => regionRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
  },

  /**
   * @description 상세 조회 (prjNo + regionNo).
   * @param prjNo 프로젝트 번호
   * @param regionNo 지역 번호
   */
  async selectByNo(prjNo: number, regionNo: number): Promise<RegionVo | null> {
    const db = getDb();
    const mode = getDbMode();

    if (mode === 'local') {
      const [ row, ] = await (db as LocalDb).select().from(localRegionsTable).where(and(eq(localRegionsTable.prjNo, prjNo), eq(localRegionsTable.regionNo, regionNo))).limit(1);
      return row
        ? regionRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }

    const [ row, ] = await (db as RemoteDb).select().from(remoteRegionsTable).where(and(eq(remoteRegionsTable.prjNo, prjNo), eq(remoteRegionsTable.regionNo, regionNo))).limit(1);
    return row
      ? regionRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 지역 생성.
   * @param vo 생성할 VO
   */
  async insert(vo: RegionVo): Promise<RegionVo> {
    const db = getDb();
    const mode = getDbMode();
    const prjNo = vo.prjNo ?? 0;
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      prjNo,
      upRegionNo: vo.upRegionNo ?? null,
      regionNm: (vo.regionNm ?? '').toString().trim(),
      regionType: vo.regionType ?? null,
      explorStat: vo.explorStat ?? null,
      regionExpln: vo.regionExpln ?? null,
      locDesc: vo.locDesc ?? null,
      climateEnv: vo.climateEnv ?? null,
      terrainFeat: vo.terrainFeat ?? null,
      envSpec: vo.envSpec ?? null,
      funcFeat: vo.funcFeat ?? null,
      dangerLvl: vo.dangerLvl ?? null,
      dangerFctr: vo.dangerFctr ?? null,
      inhabitInfo: vo.inhabitInfo ?? null,
      unknownEntity: vo.unknownEntity ?? null,
      mainFclty: vo.mainFclty ?? null,
      rsrcList: vo.rsrcList ?? null,
      ntnNo: vo.ntnNo ?? null,
      loreType: vo.loreType ?? 'REGION',
      subLoreType: vo.subLoreType ?? null,
    };

    if (mode === 'local') {
      const [ inserted, ] = await (db as LocalDb).insert(localRegionsTable).values({ ...values, crtDt: now as string, updtDt: now as string, }).returning();
      if (!inserted) throw new Error('RegionMapper.insert: no row returned');
      return regionRowToVo(inserted as unknown as Record<string, unknown>);
    }

    const [ inserted, ] = await (db as RemoteDb).insert(remoteRegionsTable).values({ ...values, crtDt: now as Date, updtDt: now as Date, }).returning();
    if (!inserted) throw new Error('RegionMapper.insert: no row returned');
    return regionRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description 지역 수정 (prjNo + regionNo).
   * @param prjNo 프로젝트 번호
   * @param regionNo 지역 번호
   * @param vo 수정할 필드 (부분)
   */
  async update(prjNo: number, regionNo: number, vo: Partial<RegionVo>): Promise<RegionVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values: Record<string, unknown> = {
      upRegionNo: vo.upRegionNo ?? undefined,
      regionNm: vo.regionNm ?? undefined,
      regionType: vo.regionType ?? undefined,
      explorStat: vo.explorStat ?? undefined,
      regionExpln: vo.regionExpln ?? undefined,
      locDesc: vo.locDesc ?? undefined,
      climateEnv: vo.climateEnv ?? undefined,
      terrainFeat: vo.terrainFeat ?? undefined,
      envSpec: vo.envSpec ?? undefined,
      funcFeat: vo.funcFeat ?? undefined,
      dangerLvl: vo.dangerLvl ?? undefined,
      dangerFctr: vo.dangerFctr ?? undefined,
      inhabitInfo: vo.inhabitInfo ?? undefined,
      unknownEntity: vo.unknownEntity ?? undefined,
      mainFclty: vo.mainFclty ?? undefined,
      rsrcList: vo.rsrcList ?? undefined,
      ntnNo: vo.ntnNo ?? undefined,
      loreType: vo.loreType ?? undefined,
      subLoreType: vo.subLoreType ?? undefined,
      updtDt: now,
    };

    if (mode === 'local') {
      const [ updated, ] = await (db as LocalDb).update(localRegionsTable).set(values).where(and(eq(localRegionsTable.prjNo, prjNo), eq(localRegionsTable.regionNo, regionNo))).returning();
      return updated
        ? regionRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }

    const [ updated, ] = await (db as RemoteDb).update(remoteRegionsTable).set(values).where(and(eq(remoteRegionsTable.prjNo, prjNo), eq(remoteRegionsTable.regionNo, regionNo))).returning();
    return updated
      ? regionRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 소프트 삭제 (prjNo + regionNo).
   * @param prjNo 프로젝트 번호
   * @param regionNo 지역 번호
   */
  async delete(prjNo: number, regionNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    if (mode === 'local') {
      const result = await (db as LocalDb).update(localRegionsTable).set({ delYn: 'Y', delDt: now as string, }).where(and(eq(localRegionsTable.prjNo, prjNo), eq(localRegionsTable.regionNo, regionNo))).returning({ regionNo: localRegionsTable.regionNo, });
      return result.length > 0;
    }

    const result = await (db as RemoteDb).update(remoteRegionsTable).set({ delYn: 'Y', delDt: now as Date, }).where(and(eq(remoteRegionsTable.prjNo, prjNo), eq(remoteRegionsTable.regionNo, regionNo))).returning({ regionNo: remoteRegionsTable.regionNo, });
    return result.length > 0;
  },
};
