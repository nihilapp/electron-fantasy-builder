import { projectSchema } from '@zod-schema/project.schema';
import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { ProjectVo } from '@app-types/vo.types';

import { projectsTable as localProjectsTable } from '../../schema/local/projects.table';
import { projectsTable as remoteProjectsTable } from '../../schema/remote/projects.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

/** DB row → 프로젝트 VO (공용 rowToVo + projectSchema) */
function projectRowToVo(row: Record<string, unknown>): ProjectVo {
  return rowToVo(row, projectSchema);
}

export const ProjectMapper = {
  /** 목록 조회 (del_yn = 'N', prj_no 내림차순, 페이징, 검색) */
  async selectList(params: ProjectVo): Promise<{ list: ProjectVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    if (mode === 'local') {
      const table = localProjectsTable;
      const dbLocal = db as LocalDb;

      let where = eq(table.delYn, 'N');

      if (searchKeyword) {
        const keyword = `%${searchKeyword}%`;
        if (searchType === 'prjNm') {
          where = and(where, like(table.prjNm, keyword))!;
        }
        else if (searchType === 'prjDesc') {
          where = and(where, like(table.prjDesc, keyword))!;
        }
        else {
          // 전체 검색 (prjNm OR prjDesc)
          where = and(
            where,
            or(like(table.prjNm, keyword), like(table.prjDesc, keyword))
          )!;
        }
      }

      const [ countRow, ] = await dbLocal.select({ count: count(), }).from(table).where(where);
      const totalCnt = Number(countRow?.count ?? 0);

      let query = dbLocal
        .select()
        .from(table)
        .where(where)
        .orderBy(desc(table.prjNo))
        .$dynamic();

      if (page && pageSize) {
        const offset = (page - 1) * pageSize;
        query = query.limit(pageSize).offset(offset);
      }

      const rows = await query;
      const list = rows.map((r) => projectRowToVo(r as unknown as Record<string, unknown>));

      return { list, totalCnt, };
    }

    const table = remoteProjectsTable;
    const dbRemote = db as RemoteDb;

    let where = eq(table.delYn, 'N');

    if (searchKeyword) {
      const keyword = `%${searchKeyword}%`;
      if (searchType === 'prjNm') {
        where = and(where, like(table.prjNm, keyword))!;
      }
      else if (searchType === 'prjDesc') {
        where = and(where, like(table.prjDesc, keyword))!;
      }
      else {
        where = and(
          where,
          or(like(table.prjNm, keyword), like(table.prjDesc, keyword))
        )!;
      }
    }

    const [ countRow, ] = await dbRemote.select({ count: count(), }).from(table).where(where);
    const totalCnt = Number(countRow?.count ?? 0);

    let query = dbRemote
      .select()
      .from(table)
      .where(where)
      .orderBy(desc(table.prjNo))
      .$dynamic();

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query = query.limit(pageSize).offset(offset);
    }

    const rows = await query;
    const list = rows.map((r) => projectRowToVo(r as unknown as Record<string, unknown>));

    return { list, totalCnt, };
  },

  /** 상세 조회 (prj_no). 삭제 여부 무관. */
  async selectByNo(prjNo: number): Promise<ProjectVo | null> {
    const db = getDb();
    const mode = getDbMode();

    if (mode === 'local') {
      const table = localProjectsTable;
      const dbLocal = db as LocalDb;

      const [ row, ] = await dbLocal.select().from(table).where(eq(table.prjNo, prjNo)).limit(1);

      return row
        ? projectRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteProjectsTable;
    const dbRemote = db as RemoteDb;

    const [ row, ] = await dbRemote.select().from(table).where(eq(table.prjNo, prjNo)).limit(1);

    return row
      ? projectRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /** 생성. 로컬은 prjNo 생략, 원격은 userNo 필요 시 body에서. */
  async insert(vo: ProjectVo): Promise<ProjectVo> {
    const db = getDb();
    const mode = getDbMode();
    const now = new Date().toISOString();

    const prjNm = (vo.prjNm ?? '').toString().trim();

    if (mode === 'local') {
      const table = localProjectsTable;
      const dbLocal = db as LocalDb;

      const [ inserted, ] = await dbLocal
        .insert(table)
        .values({
          prjNm,
          genreType: vo.genreType ?? null,
          prjDesc: vo.prjDesc ?? null,
          cvrImgUrl: vo.cvrImgUrl ?? null,
          prjExpln: vo.prjExpln ?? null,
          prjVer: vo.prjVer ?? null,
          crtDt: now,
          updtDt: now,
        })
        .returning();

      if (!inserted) throw new Error('ProjectMapper.insert: no row returned');

      return projectRowToVo(inserted as unknown as Record<string, unknown>);
    }

    const table = remoteProjectsTable;
    const dbRemote = db as RemoteDb;
    const userNo = vo.userNo ?? 1;

    const [ inserted, ] = await dbRemote
      .insert(table)
      .values({
        userNo,
        prjNm,
        genreType: vo.genreType ?? null,
        prjDesc: vo.prjDesc ?? null,
        cvrImgUrl: vo.cvrImgUrl ?? null,
        prjExpln: vo.prjExpln ?? null,
        prjVer: vo.prjVer ?? null,
        crtDt: new Date(),
        updtDt: new Date(),
      })
      .returning();

    if (!inserted) throw new Error('ProjectMapper.insert: no row returned');

    return projectRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /** 수정. */
  async update(prjNo: number, vo: ProjectVo): Promise<ProjectVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      prjNm: vo.prjNm ?? undefined,
      genreType: vo.genreType ?? undefined,
      prjDesc: vo.prjDesc ?? undefined,
      cvrImgUrl: vo.cvrImgUrl ?? undefined,
      prjExpln: vo.prjExpln ?? undefined,
      prjVer: vo.prjVer ?? undefined,
    };

    if (mode === 'local') {
      const table = localProjectsTable;
      const dbLocal = db as LocalDb;

      const [ updated, ] = await dbLocal
        .update(table)
        .set({
          ...values,
          updtDt: now as string,
        })
        .where(eq(table.prjNo, prjNo))
        .returning();

      return updated
        ? projectRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteProjectsTable;
    const dbRemote = db as RemoteDb;

    const [ updated, ] = await dbRemote
      .update(table)
      .set({
        ...values,
        updtDt: now as Date,
      })
      .where(eq(table.prjNo, prjNo))
      .returning();

    return updated
      ? projectRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /** 소프트 삭제 (del_yn = 'Y', del_dt 설정). */
  async delete(prjNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    if (mode === 'local') {
      const table = localProjectsTable;
      const dbLocal = db as LocalDb;

      const result = await dbLocal
        .update(table)
        .set({ delYn: 'Y', delDt: now as string, })
        .where(eq(table.prjNo, prjNo))
        .returning({ prjNo: table.prjNo, });

      return result.length > 0;
    }

    const table = remoteProjectsTable;
    const dbRemote = db as RemoteDb;

    const result = await dbRemote
      .update(table)
      .set({ delYn: 'Y', delDt: now as Date, })
      .where(eq(table.prjNo, prjNo))
      .returning({ prjNo: table.prjNo, });

    return result.length > 0;
  },
};
