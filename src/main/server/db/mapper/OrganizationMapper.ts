import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { OrganizationVo } from '@app-types/vo.types';
import { organizationSchema } from '@zod-schema/organization.schema';

import { organizationsTable as localOrganizationsTable } from '../../schema/local/organizations.table';
import { organizationsTable as remoteOrganizationsTable } from '../../schema/remote/organizations.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

/**
 * @description DB row → 조직 VO.
 * @param row DB 결과 한 행
 */
function organizationRowToVo(row: Record<string, unknown>): OrganizationVo {
  return rowToVo(row, organizationSchema);
}

type OrganizationsTable = typeof localOrganizationsTable | typeof remoteOrganizationsTable;

export const OrganizationMapper = {
  /**
   * @description 목록 조회 (prjNo 스코프, del_yn = 'N', org_no 내림차순, 페이징, 검색).
   * @param prjNo 프로젝트 번호
   * @param params 검색/페이징 파라미터
   */
  async selectList(prjNo: number, params: OrganizationVo): Promise<{ list: OrganizationVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    const createWhere = (table: OrganizationsTable) => {
      let where = and(eq(table.prjNo, prjNo), eq(table.delYn, 'N'))!;

      if (searchKeyword) {
        const keyword = `%${searchKeyword}%`;

        if (searchType === 'orgNm') where = and(where, like(table.orgNm, keyword))!;
        else if (searchType === 'logline') where = and(where, like(table.logline, keyword))!;
        else where = and(where, or(like(table.orgNm, keyword), like(table.logline, keyword)))!;
      }

      return where;
    };

    if (mode === 'local') {
      const table = localOrganizationsTable;
      const dbLocal = db as LocalDb;
      const where = createWhere(table);

      const [ countRow, ] = await dbLocal.select({ count: count(), }).from(table).where(where);
      const totalCnt = Number(countRow?.count ?? 0);

      let query = dbLocal.select().from(table).where(where).orderBy(desc(table.orgNo)).$dynamic();

      if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);

      const rows = await query;

      return { list: rows.map((row) => organizationRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
    }

    const table = remoteOrganizationsTable;
    const dbRemote = db as RemoteDb;
    const where = createWhere(table);

    const [ countRow, ] = await dbRemote.select({ count: count(), }).from(table).where(where);
    const totalCnt = Number(countRow?.count ?? 0);

    let query = dbRemote.select().from(table).where(where).orderBy(desc(table.orgNo)).$dynamic();

    if (page && pageSize) query = query.limit(pageSize).offset((page - 1) * pageSize);

    const rows = await query;

    return { list: rows.map((row) => organizationRowToVo(row as unknown as Record<string, unknown>)), totalCnt, };
  },

  /**
   * @description 상세 조회 (prjNo + orgNo).
   * @param prjNo 프로젝트 번호
   * @param orgNo 조직 번호
   */
  async selectByNo(prjNo: number, orgNo: number): Promise<OrganizationVo | null> {
    const db = getDb();
    const mode = getDbMode();

    if (mode === 'local') {
      const [ row, ] = await (db as LocalDb).select().from(localOrganizationsTable).where(and(eq(localOrganizationsTable.prjNo, prjNo), eq(localOrganizationsTable.orgNo, orgNo))).limit(1);
      return row
        ? organizationRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }

    const [ row, ] = await (db as RemoteDb).select().from(remoteOrganizationsTable).where(and(eq(remoteOrganizationsTable.prjNo, prjNo), eq(remoteOrganizationsTable.orgNo, orgNo))).limit(1);
    return row
      ? organizationRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 조직 생성.
   * @param vo 생성할 VO
   */
  async insert(vo: OrganizationVo): Promise<OrganizationVo> {
    const db = getDb();
    const mode = getDbMode();
    const prjNo = vo.prjNo ?? 0;
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      prjNo,
      orgNm: (vo.orgNm ?? '').toString().trim(),
      orgType: vo.orgType ?? null,
      logline: vo.logline ?? null,
      orgTheme: vo.orgTheme ?? null,
      purpPub: vo.purpPub ?? null,
      purpHid: vo.purpHid ?? null,
      fndBg: vo.fndBg ?? null,
      orgStrc: vo.orgStrc ?? null,
      orgScale: vo.orgScale ?? null,
      joinCond: vo.joinCond ?? null,
      exitRule: vo.exitRule ?? null,
      mainAct: vo.mainAct ?? null,
      actArea: vo.actArea ?? null,
      actMthd: vo.actMthd ?? null,
      fundSrc: vo.fundSrc ?? null,
      keyFig: vo.keyFig ?? null,
      histDesc: vo.histDesc ?? null,
      currStat: vo.currStat ?? null,
      loreType: vo.loreType ?? 'ORGANIZATION',
      subLoreType: vo.subLoreType ?? null,
    };

    if (mode === 'local') {
      const [ inserted, ] = await (db as LocalDb).insert(localOrganizationsTable).values({ ...values, crtDt: now as string, updtDt: now as string, }).returning();
      if (!inserted) throw new Error('OrganizationMapper.insert: no row returned');
      return organizationRowToVo(inserted as unknown as Record<string, unknown>);
    }

    const [ inserted, ] = await (db as RemoteDb).insert(remoteOrganizationsTable).values({ ...values, crtDt: now as Date, updtDt: now as Date, }).returning();
    if (!inserted) throw new Error('OrganizationMapper.insert: no row returned');
    return organizationRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description 조직 수정 (prjNo + orgNo).
   * @param prjNo 프로젝트 번호
   * @param orgNo 조직 번호
   * @param vo 수정할 필드 (부분)
   */
  async update(prjNo: number, orgNo: number, vo: Partial<OrganizationVo>): Promise<OrganizationVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values: Record<string, unknown> = {
      orgNm: vo.orgNm ?? undefined,
      orgType: vo.orgType ?? undefined,
      logline: vo.logline ?? undefined,
      orgTheme: vo.orgTheme ?? undefined,
      purpPub: vo.purpPub ?? undefined,
      purpHid: vo.purpHid ?? undefined,
      fndBg: vo.fndBg ?? undefined,
      orgStrc: vo.orgStrc ?? undefined,
      orgScale: vo.orgScale ?? undefined,
      joinCond: vo.joinCond ?? undefined,
      exitRule: vo.exitRule ?? undefined,
      mainAct: vo.mainAct ?? undefined,
      actArea: vo.actArea ?? undefined,
      actMthd: vo.actMthd ?? undefined,
      fundSrc: vo.fundSrc ?? undefined,
      keyFig: vo.keyFig ?? undefined,
      histDesc: vo.histDesc ?? undefined,
      currStat: vo.currStat ?? undefined,
      loreType: vo.loreType ?? undefined,
      subLoreType: vo.subLoreType ?? undefined,
      updtDt: now,
    };

    if (mode === 'local') {
      const [ updated, ] = await (db as LocalDb).update(localOrganizationsTable).set(values).where(and(eq(localOrganizationsTable.prjNo, prjNo), eq(localOrganizationsTable.orgNo, orgNo))).returning();
      return updated
        ? organizationRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }

    const [ updated, ] = await (db as RemoteDb).update(remoteOrganizationsTable).set(values).where(and(eq(remoteOrganizationsTable.prjNo, prjNo), eq(remoteOrganizationsTable.orgNo, orgNo))).returning();
    return updated
      ? organizationRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 소프트 삭제 (prjNo + orgNo).
   * @param prjNo 프로젝트 번호
   * @param orgNo 조직 번호
   */
  async delete(prjNo: number, orgNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    if (mode === 'local') {
      const result = await (db as LocalDb).update(localOrganizationsTable).set({ delYn: 'Y', delDt: now as string, }).where(and(eq(localOrganizationsTable.prjNo, prjNo), eq(localOrganizationsTable.orgNo, orgNo))).returning({ orgNo: localOrganizationsTable.orgNo, });
      return result.length > 0;
    }

    const result = await (db as RemoteDb).update(remoteOrganizationsTable).set({ delYn: 'Y', delDt: now as Date, }).where(and(eq(remoteOrganizationsTable.prjNo, prjNo), eq(remoteOrganizationsTable.orgNo, orgNo))).returning({ orgNo: remoteOrganizationsTable.orgNo, });
    return result.length > 0;
  },
};
