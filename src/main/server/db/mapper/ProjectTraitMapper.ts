import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { ProjectTraitVo } from '@app-types/vo.types';
import { projectTraitSchema } from '@zod-schema/projectTrait.schema';

import { projectTraitsTable as localProjectTraitsTable } from '../../schema/local/project_traits.table';
import { projectTraitsTable as remoteProjectTraitsTable } from '../../schema/remote/project_traits.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

function projectTraitRowToVo(row: Record<string, unknown>): ProjectTraitVo {
  return rowToVo(row, projectTraitSchema);
}

export const ProjectTraitMapper = {
  /** 목록 조회 (prjNo 스코프, del_yn = 'N', trait_no 내림차순, 페이징, 검색) */
  async selectList(
    prjNo: number,
    params: ProjectTraitVo
  ): Promise<{ list: ProjectTraitVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    const createWhere = (table: any) => {
      let where = and(eq(table.prjNo, prjNo), eq(table.delYn, 'N'))!;
      if (searchKeyword) {
        const keyword = `%${searchKeyword}%`;
        if (searchType === 'traitNm') {
          where = and(where, like(table.traitNm, keyword))!;
        }
        else if (searchType === 'traitExpln') {
          where = and(where, like(table.traitExpln, keyword))!;
        }
        else {
          where = and(
            where,
            or(like(table.traitNm, keyword), like(table.traitExpln, keyword))
          )!;
        }
      }
      return where;
    };

    if (mode === 'local') {
      const table = localProjectTraitsTable;
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
        .orderBy(desc(table.traitNo))
        .$dynamic();

      if (page && pageSize) {
        const offset = (page - 1) * pageSize;
        query = query.limit(pageSize).offset(offset);
      }

      const rows = await query;
      const list = rows.map((r) =>
        projectTraitRowToVo(r as unknown as Record<string, unknown>)
      );

      return { list, totalCnt, };
    }

    const table = remoteProjectTraitsTable;
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
      .orderBy(desc(table.traitNo))
      .$dynamic();

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query = query.limit(pageSize).offset(offset);
    }

    const rows = await query;
    const list = rows.map((r) =>
      projectTraitRowToVo(r as unknown as Record<string, unknown>)
    );

    return { list, totalCnt, };
  },

  /** 상세 조회 (prjNo + traitNo) */
  async selectByNo(
    prjNo: number,
    traitNo: number
  ): Promise<ProjectTraitVo | null> {
    const db = getDb();
    const mode = getDbMode();

    if (mode === 'local') {
      const table = localProjectTraitsTable;
      const dbLocal = db as LocalDb;
      const [ row, ] = await dbLocal
        .select()
        .from(table)
        .where(and(eq(table.prjNo, prjNo), eq(table.traitNo, traitNo)))
        .limit(1);
      return row
        ? projectTraitRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteProjectTraitsTable;
    const dbRemote = db as RemoteDb;
    const [ row, ] = await dbRemote
      .select()
      .from(table)
      .where(and(eq(table.prjNo, prjNo), eq(table.traitNo, traitNo)))
      .limit(1);
    return row
      ? projectTraitRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /** 생성 (prjNo 필수) */
  async insert(vo: ProjectTraitVo): Promise<ProjectTraitVo> {
    const db = getDb();
    const mode = getDbMode();
    const prjNo = vo.prjNo ?? 0;
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      prjNo,
      traitNm: (vo.traitNm ?? '').toString().trim(),
      traitExpln: vo.traitExpln ?? null,
      traitLcls: vo.traitLcls ?? null,
      traitMcls: vo.traitMcls ?? null,
      aplyTrgt: vo.aplyTrgt ?? null,
      cnflTraitNo: vo.cnflTraitNo ?? null,
      cnflTraitType: vo.cnflTraitType ?? null,
    };

    if (mode === 'local') {
      const table = localProjectTraitsTable;
      const dbLocal = db as LocalDb;
      const [ inserted, ] = await dbLocal
        .insert(table)
        .values({ ...values, crtDt: now as string, updtDt: now as string, })
        .returning();
      if (!inserted) throw new Error('ProjectTraitMapper.insert: no row returned');
      return projectTraitRowToVo(inserted as unknown as Record<string, unknown>);
    }

    const table = remoteProjectTraitsTable;
    const dbRemote = db as RemoteDb;
    const [ inserted, ] = await dbRemote
      .insert(table)
      .values({ ...values, crtDt: now as Date, updtDt: now as Date, })
      .returning();
    if (!inserted) throw new Error('ProjectTraitMapper.insert: no row returned');
    return projectTraitRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /** 수정 (prjNo + traitNo) */
  async update(
    prjNo: number,
    traitNo: number,
    vo: Partial<ProjectTraitVo>
  ): Promise<ProjectTraitVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      traitNm: vo.traitNm ?? undefined,
      traitExpln: vo.traitExpln ?? undefined,
      traitLcls: vo.traitLcls ?? undefined,
      traitMcls: vo.traitMcls ?? undefined,
      aplyTrgt: vo.aplyTrgt ?? undefined,
      cnflTraitNo: vo.cnflTraitNo ?? undefined,
      cnflTraitType: vo.cnflTraitType ?? undefined,
      updtDt: now,
    };

    const where = and(
      eq(localProjectTraitsTable.prjNo, prjNo),
      eq(localProjectTraitsTable.traitNo, traitNo)
    );

    if (mode === 'local') {
      const table = localProjectTraitsTable;
      const dbLocal = db as LocalDb;
      const [ updated, ] = await dbLocal
        .update(table)
        .set(values as Record<string, unknown>)
        .where(where)
        .returning();
      return updated
        ? projectTraitRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteProjectTraitsTable;
    const dbRemote = db as RemoteDb;
    const whereRemote = and(eq(table.prjNo, prjNo), eq(table.traitNo, traitNo));
    const [ updated, ] = await dbRemote
      .update(table)
      .set(values as Record<string, unknown>)
      .where(whereRemote)
      .returning();
    return updated
      ? projectTraitRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /** 삭제 (Soft Delete, prjNo + traitNo) */
  async delete(prjNo: number, traitNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    if (mode === 'local') {
      const table = localProjectTraitsTable;
      const dbLocal = db as LocalDb;
      const result = await dbLocal
        .update(table)
        .set({ delYn: 'Y', delDt: now as string, })
        .where(
          and(eq(table.prjNo, prjNo), eq(table.traitNo, traitNo))
        )
        .returning({ traitNo: table.traitNo, });
      return result.length > 0;
    }

    const table = remoteProjectTraitsTable;
    const dbRemote = db as RemoteDb;
    const result = await dbRemote
      .update(table)
      .set({ delYn: 'Y', delDt: now as Date, })
      .where(and(eq(table.prjNo, prjNo), eq(table.traitNo, traitNo)))
      .returning({ traitNo: table.traitNo, });
    return result.length > 0;
  },
};
