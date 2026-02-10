import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { EventVo } from '@app-types/vo.types';
import { eventSchema } from '@zod-schema/event.schema';

import { eventsTable as localEventsTable } from '../../schema/local/events.table';
import { eventsTable as remoteEventsTable } from '../../schema/remote/events.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

/**
 * @description DB row → 사건 VO.
 * @param row DB 결과 한 행
 */
function eventRowToVo(row: Record<string, unknown>): EventVo {
  return rowToVo(row, eventSchema);
}

type EventsTable = typeof localEventsTable | typeof remoteEventsTable;

export const EventMapper = {
  /**
   * @description 목록 조회 (prjNo 스코프, del_yn = 'N', event_no 내림차순, 페이징, 검색).
   * @param prjNo 프로젝트 번호
   * @param params 검색/페이징 파라미터
   */
  async selectList(prjNo: number, params: EventVo): Promise<{ list: EventVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    const createWhere = (table: EventsTable) => {
      let where = and(eq(table.prjNo, prjNo), eq(table.delYn, 'N'))!;

      if (searchKeyword) {
        const keyword = `%${searchKeyword}%`;

        if (searchType === 'eventNm') where = and(where, like(table.eventNm, keyword))!;
        else if (searchType === 'smry') where = and(where, like(table.smry, keyword))!;
        else {
          where = and(
            where,
            or(
              like(table.eventNm, keyword),
              like(table.smry, keyword),
              like(table.tags, keyword)
            )
          )!;
        }
      }

      return where;
    };

    if (mode === 'local') {
      const table = localEventsTable;
      const dbLocal = db as LocalDb;
      const where = createWhere(table);

      const [ countRow, ] = await dbLocal.select({ count: count(), }).from(table).where(where);
      const totalCnt = Number(countRow?.count ?? 0);

      let query = dbLocal.select().from(table).where(where).orderBy(desc(table.eventNo)).$dynamic();

      if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);

      const rows = await query;

      return { list: rows.map((row) => eventRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
    }

    const table = remoteEventsTable;
    const dbRemote = db as RemoteDb;
    const where = createWhere(table);

    const [ countRow, ] = await dbRemote.select({ count: count(), }).from(table).where(where);
    const totalCnt = Number(countRow?.count ?? 0);

    let query = dbRemote.select().from(table).where(where).orderBy(desc(table.eventNo)).$dynamic();

    if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);

    const rows = await query;

    return { list: rows.map((row) => eventRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
  },

  /**
   * @description 상세 조회 (prjNo + eventNo).
   * @param prjNo 프로젝트 번호
   * @param eventNo 사건 번호
   */
  async selectByNo(prjNo: number, eventNo: number): Promise<EventVo | null> {
    const db = getDb();
    const mode = getDbMode();

    if (mode === 'local') {
      const [ row, ] = await (db as LocalDb).select().from(localEventsTable).where(and(eq(localEventsTable.prjNo, prjNo), eq(localEventsTable.eventNo, eventNo))).limit(1);
      return row
        ? eventRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }

    const [ row, ] = await (db as RemoteDb).select().from(remoteEventsTable).where(and(eq(remoteEventsTable.prjNo, prjNo), eq(remoteEventsTable.eventNo, eventNo))).limit(1);
    return row
      ? eventRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 사건 생성.
   * @param vo 생성할 VO
   */
  async insert(vo: EventVo): Promise<EventVo> {
    const db = getDb();
    const mode = getDbMode();
    const prjNo = vo.prjNo ?? 0;
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      prjNo,
      eventNm: (vo.eventNm ?? '').toString().trim(),
      occurTime: vo.occurTime ?? null,
      occurLoc: vo.occurLoc ?? null,
      smry: vo.smry ?? null,
      causePub: vo.causePub ?? null,
      causeReal: vo.causeReal ?? null,
      sideAChar: vo.sideAChar ?? null,
      sideAOrg: vo.sideAOrg ?? null,
      sideANtn: vo.sideANtn ?? null,
      sideBChar: vo.sideBChar ?? null,
      sideBOrg: vo.sideBOrg ?? null,
      sideBNtn: vo.sideBNtn ?? null,
      sideCChar: vo.sideCChar ?? null,
      sideCOrg: vo.sideCOrg ?? null,
      sideCNtn: vo.sideCNtn ?? null,
      flowTrgr: vo.flowTrgr ?? null,
      flowCrisis: vo.flowCrisis ?? null,
      flowClimax: vo.flowClimax ?? null,
      flowConcl: vo.flowConcl ?? null,
      dmgRslt: vo.dmgRslt ?? null,
      socChng: vo.socChng ?? null,
      currConn: vo.currConn ?? null,
      recOfficial: vo.recOfficial ?? null,
      truthHid: vo.truthHid ?? null,
      rmk: vo.rmk ?? null,
      loreType: vo.loreType ?? 'EVENT',
      subLoreType: vo.subLoreType ?? null,
    };

    if (mode === 'local') {
      const [ inserted, ] = await (db as LocalDb).insert(localEventsTable).values({ ...values, crtDt: now as string, updtDt: now as string, }).returning();
      if (!inserted) throw new Error('EventMapper.insert: no row returned');
      return eventRowToVo(inserted as unknown as Record<string, unknown>);
    }

    const [ inserted, ] = await (db as RemoteDb).insert(remoteEventsTable).values({ ...values, crtDt: now as Date, updtDt: now as Date, }).returning();
    if (!inserted) throw new Error('EventMapper.insert: no row returned');
    return eventRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description 사건 수정 (prjNo + eventNo).
   * @param prjNo 프로젝트 번호
   * @param eventNo 사건 번호
   * @param vo 수정할 필드 (부분)
   */
  async update(prjNo: number, eventNo: number, vo: Partial<EventVo>): Promise<EventVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values: Record<string, unknown> = {
      eventNm: vo.eventNm ?? undefined,
      occurTime: vo.occurTime ?? undefined,
      occurLoc: vo.occurLoc ?? undefined,
      smry: vo.smry ?? undefined,
      causePub: vo.causePub ?? undefined,
      causeReal: vo.causeReal ?? undefined,
      sideAChar: vo.sideAChar ?? undefined,
      sideAOrg: vo.sideAOrg ?? undefined,
      sideANtn: vo.sideANtn ?? undefined,
      sideBChar: vo.sideBChar ?? undefined,
      sideBOrg: vo.sideBOrg ?? undefined,
      sideBNtn: vo.sideBNtn ?? undefined,
      sideCChar: vo.sideCChar ?? undefined,
      sideCOrg: vo.sideCOrg ?? undefined,
      sideCNtn: vo.sideCNtn ?? undefined,
      flowTrgr: vo.flowTrgr ?? undefined,
      flowCrisis: vo.flowCrisis ?? undefined,
      flowClimax: vo.flowClimax ?? undefined,
      flowConcl: vo.flowConcl ?? undefined,
      dmgRslt: vo.dmgRslt ?? undefined,
      socChng: vo.socChng ?? undefined,
      currConn: vo.currConn ?? undefined,
      recOfficial: vo.recOfficial ?? undefined,
      truthHid: vo.truthHid ?? undefined,
      rmk: vo.rmk ?? undefined,
      loreType: vo.loreType ?? undefined,
      subLoreType: vo.subLoreType ?? undefined,
      updtDt: now,
    };

    if (mode === 'local') {
      const [ updated, ] = await (db as LocalDb).update(localEventsTable).set(values).where(and(eq(localEventsTable.prjNo, prjNo), eq(localEventsTable.eventNo, eventNo))).returning();
      return updated
        ? eventRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }

    const [ updated, ] = await (db as RemoteDb).update(remoteEventsTable).set(values).where(and(eq(remoteEventsTable.prjNo, prjNo), eq(remoteEventsTable.eventNo, eventNo))).returning();
    return updated
      ? eventRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 소프트 삭제 (prjNo + eventNo).
   * @param prjNo 프로젝트 번호
   * @param eventNo 사건 번호
   */
  async delete(prjNo: number, eventNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    if (mode === 'local') {
      const result = await (db as LocalDb).update(localEventsTable).set({ delYn: 'Y', delDt: now as string, }).where(and(eq(localEventsTable.prjNo, prjNo), eq(localEventsTable.eventNo, eventNo))).returning({ eventNo: localEventsTable.eventNo, });
      return result.length > 0;
    }

    const result = await (db as RemoteDb).update(remoteEventsTable).set({ delYn: 'Y', delDt: now as Date, }).where(and(eq(remoteEventsTable.prjNo, prjNo), eq(remoteEventsTable.eventNo, eventNo))).returning({ eventNo: remoteEventsTable.eventNo, });
    return result.length > 0;
  },
};
