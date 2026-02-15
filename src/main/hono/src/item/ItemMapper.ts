import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { ItemVo } from '@app-types/vo.types';
import { itemSchema } from '@zod-schema/item.schema';

import type { LocalDb } from '../common/db/client/local';
import type { RemoteDb } from '../common/db/client/remote';
import { getDb } from '../common/db/context';
import { getDbMode } from '../common/db/context';
import { rowToVo } from '../common/db/rowToVo';
import { itemsTable as localItemsTable } from '../common/db/schema/local/items.table';
import { itemsTable as remoteItemsTable } from '../common/db/schema/remote/items.table';

/**
 * @description DB row → 아이템 VO.
 * @param row DB 결과 한 행
 */
function itemRowToVo(row: Record<string, unknown>): ItemVo {
  return rowToVo(row, itemSchema);
}

type ItemsTable = typeof localItemsTable | typeof remoteItemsTable;

export const ItemMapper = {
  /**
   * @description 목록 조회 (prjNo 스코프, del_yn = 'N', item_no 내림차순, 페이징, 검색).
   * @param prjNo 프로젝트 번호
   * @param params 검색/페이징 파라미터
   */
  async selectList(prjNo: number, params: ItemVo): Promise<{ list: ItemVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    const createWhere = (table: ItemsTable) => {
      let where = and(eq(table.prjNo, prjNo), eq(table.delYn, 'N'))!;

      if (searchKeyword) {
        const keyword = `%${searchKeyword}%`;

        if (searchType === 'itemNm') where = and(where, like(table.itemNm, keyword))!;
        else if (searchType === 'logline') where = and(where, like(table.logline, keyword))!;
        else {
          where = and(
            where,
            or(
              like(table.itemNm, keyword),
              like(table.logline, keyword),
              like(table.tags, keyword)
            )
          )!;
        }
      }

      return where;
    };

    if (mode === 'local') {
      const table = localItemsTable;
      const dbLocal = db as LocalDb;
      const where = createWhere(table);

      const [ countRow, ] = await dbLocal.select({ count: count(), }).from(table).where(where);
      const totalCnt = Number(countRow?.count ?? 0);

      let query = dbLocal.select().from(table).where(where).orderBy(desc(table.itemNo)).$dynamic();

      if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);

      const rows = await query;

      return { list: rows.map((row) => itemRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
    }

    const table = remoteItemsTable;
    const dbRemote = db as RemoteDb;
    const where = createWhere(table);

    const [ countRow, ] = await dbRemote.select({ count: count(), }).from(table).where(where);
    const totalCnt = Number(countRow?.count ?? 0);

    let query = dbRemote.select().from(table).where(where).orderBy(desc(table.itemNo)).$dynamic();

    if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);

    const rows = await query;

    return { list: rows.map((row) => itemRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
  },

  /**
   * @description 상세 조회 (prjNo + itemNo).
   * @param prjNo 프로젝트 번호
   * @param itemNo 아이템 번호
   */
  async selectByNo(prjNo: number, itemNo: number): Promise<ItemVo | null> {
    const db = getDb();
    const mode = getDbMode();

    if (mode === 'local') {
      const [ row, ] = await (db as LocalDb).select().from(localItemsTable).where(and(eq(localItemsTable.prjNo, prjNo), eq(localItemsTable.itemNo, itemNo))).limit(1);
      return row
        ? itemRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }

    const [ row, ] = await (db as RemoteDb).select().from(remoteItemsTable).where(and(eq(remoteItemsTable.prjNo, prjNo), eq(remoteItemsTable.itemNo, itemNo))).limit(1);
    return row
      ? itemRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 아이템 생성.
   * @param vo 생성할 VO
   */
  async insert(vo: ItemVo): Promise<ItemVo> {
    const db = getDb();
    const mode = getDbMode();
    const prjNo = vo.prjNo ?? 0;
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      prjNo,
      itemNm: (vo.itemNm ?? '').toString().trim(),
      clsMain: vo.clsMain ?? null,
      clsSub: vo.clsSub ?? null,
      itemGrd: vo.itemGrd ?? null,
      logline: vo.logline ?? null,
      appDesc: vo.appDesc ?? null,
      visualFeat: vo.visualFeat ?? null,
      attrType: vo.attrType ?? null,
      dmgType: vo.dmgType ?? null,
      mainFunc: vo.mainFunc ?? null,
      loreType: vo.loreType ?? 'ITEM',
      subLoreType: vo.subLoreType ?? null,
    };

    if (mode === 'local') {
      const [ inserted, ] = await (db as LocalDb).insert(localItemsTable).values({ ...values, crtDt: now as string, updtDt: now as string, }).returning();
      if (!inserted) throw new Error('ItemMapper.insert: no row returned');
      return itemRowToVo(inserted as unknown as Record<string, unknown>);
    }

    const [ inserted, ] = await (db as RemoteDb).insert(remoteItemsTable).values({ ...values, crtDt: now as Date, updtDt: now as Date, }).returning();
    if (!inserted) throw new Error('ItemMapper.insert: no row returned');
    return itemRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description 아이템 수정 (prjNo + itemNo).
   * @param prjNo 프로젝트 번호
   * @param itemNo 아이템 번호
   * @param vo 수정할 필드 (부분)
   */
  async update(prjNo: number, itemNo: number, vo: Partial<ItemVo>): Promise<ItemVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values: Record<string, unknown> = {
      itemNm: vo.itemNm ?? undefined,
      clsMain: vo.clsMain ?? undefined,
      clsSub: vo.clsSub ?? undefined,
      itemGrd: vo.itemGrd ?? undefined,
      logline: vo.logline ?? undefined,
      appDesc: vo.appDesc ?? undefined,
      visualFeat: vo.visualFeat ?? undefined,
      attrType: vo.attrType ?? undefined,
      dmgType: vo.dmgType ?? undefined,
      mainFunc: vo.mainFunc ?? undefined,
      loreType: vo.loreType ?? undefined,
      subLoreType: vo.subLoreType ?? undefined,
      updtDt: now,
    };

    if (mode === 'local') {
      const [ updated, ] = await (db as LocalDb).update(localItemsTable).set(values).where(and(eq(localItemsTable.prjNo, prjNo), eq(localItemsTable.itemNo, itemNo))).returning();
      return updated
        ? itemRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }

    const [ updated, ] = await (db as RemoteDb).update(remoteItemsTable).set(values).where(and(eq(remoteItemsTable.prjNo, prjNo), eq(remoteItemsTable.itemNo, itemNo))).returning();
    return updated
      ? itemRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 소프트 삭제 (prjNo + itemNo).
   * @param prjNo 프로젝트 번호
   * @param itemNo 아이템 번호
   */
  async delete(prjNo: number, itemNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    if (mode === 'local') {
      const result = await (db as LocalDb).update(localItemsTable).set({ delYn: 'Y', delDt: now as string, }).where(and(eq(localItemsTable.prjNo, prjNo), eq(localItemsTable.itemNo, itemNo))).returning({ itemNo: localItemsTable.itemNo, });
      return result.length > 0;
    }

    const result = await (db as RemoteDb).update(remoteItemsTable).set({ delYn: 'Y', delDt: now as Date, }).where(and(eq(remoteItemsTable.prjNo, prjNo), eq(remoteItemsTable.itemNo, itemNo))).returning({ itemNo: remoteItemsTable.itemNo, });
    return result.length > 0;
  },
};
