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

function eventRowToVo(row: Record<string, unknown>): EventVo {
  return rowToVo(row, eventSchema);
}

type EventsTable = typeof localEventsTable | typeof remoteEventsTable;

export const EventMapper = {
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
        else where = and(where, or(like(table.eventNm, keyword), like(table.smry, keyword)))!;
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
      return { list: rows.map((r) => eventRowToVo(r as unknown as Record<string, unknown>)), totalCnt, };
    }
    const table = remoteEventsTable;
    const dbRemote = db as RemoteDb;
    const where = createWhere(table);
    const [ countRow, ] = await dbRemote.select({ count: count(), }).from(table).where(where);
    const totalCnt = Number(countRow?.count ?? 0);
    let query = dbRemote.select().from(table).where(where).orderBy(desc(table.eventNo)).$dynamic();
    if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);
    const rows = await query;
    return { list: rows.map((r) => eventRowToVo(r as unknown as Record<string, unknown>)), totalCnt, };
  },

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
