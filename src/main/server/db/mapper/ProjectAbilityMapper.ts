import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { ProjectAbilityVo } from '@app-types/vo.types';
import { projectAbilitySchema } from '@zod-schema/projectAbility.schema';

import { projectAbilitiesTable as localProjectAbilitiesTable } from '../../schema/local/project_abilities.table';
import { projectAbilitiesTable as remoteProjectAbilitiesTable } from '../../schema/remote/project_abilities.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

/**
 * @description DB row → 프로젝트 어빌리티 VO.
 * @param row DB 결과 한 행
 */
function projectAbilityRowToVo(row: Record<string, unknown>): ProjectAbilityVo {
  return rowToVo(row, projectAbilitySchema);
}

type ProjectAbilitiesTable = typeof localProjectAbilitiesTable | typeof remoteProjectAbilitiesTable;

export const ProjectAbilityMapper = {
  /**
   * @description 목록 조회 (prjNo 스코프, del_yn = 'N', ability_no 내림차순, 페이징, 검색).
   * @param prjNo 프로젝트 번호
   * @param params 검색/페이징 파라미터
   */
  async selectList(
    prjNo: number,
    params: ProjectAbilityVo
  ): Promise<{ list: ProjectAbilityVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    const createWhere = (table: ProjectAbilitiesTable) => {
      let where = and(eq(table.prjNo, prjNo), eq(table.delYn, 'N'))!;
      if (searchKeyword) {
        const keyword = `%${searchKeyword}%`;
        if (searchType === 'abilityNm') {
          where = and(where, like(table.abilityNm, keyword))!;
        }
        else if (searchType === 'abilityExpln') {
          where = and(where, like(table.abilityExpln, keyword))!;
        }
        else {
          where = and(
            where,
            or(like(table.abilityNm, keyword), like(table.abilityExpln, keyword))
          )!;
        }
      }
      return where;
    };

    if (mode === 'local') {
      const table = localProjectAbilitiesTable;
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
        .orderBy(desc(table.abilityNo))
        .$dynamic();

      if (page && pageSize) {
        const offset = (page - 1) * pageSize;
        query = query.limit(pageSize).offset(offset);
      }

      const rows = await query;
      const list = rows.map((row) =>
        projectAbilityRowToVo(row as unknown as Record<string, unknown>)
      );

      return { list, totalCnt, };
    }

    const table = remoteProjectAbilitiesTable;
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
      .orderBy(desc(table.abilityNo))
      .$dynamic();

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query = query.limit(pageSize).offset(offset);
    }

    const rows = await query;
    const list = rows.map((row) =>
      projectAbilityRowToVo(row as unknown as Record<string, unknown>)
    );

    return { list, totalCnt, };
  },

  /**
   * @description 상세 조회 (prjNo + abilityNo).
   * @param prjNo 프로젝트 번호
   * @param abilityNo 어빌리티 번호
   */
  async selectByNo(
    prjNo: number,
    abilityNo: number
  ): Promise<ProjectAbilityVo | null> {
    const db = getDb();
    const mode = getDbMode();

    if (mode === 'local') {
      const table = localProjectAbilitiesTable;
      const dbLocal = db as LocalDb;
      const [ row, ] = await dbLocal
        .select()
        .from(table)
        .where(and(eq(table.prjNo, prjNo), eq(table.abilityNo, abilityNo)))
        .limit(1);
      return row
        ? projectAbilityRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteProjectAbilitiesTable;
    const dbRemote = db as RemoteDb;
    const [ row, ] = await dbRemote
      .select()
      .from(table)
      .where(and(eq(table.prjNo, prjNo), eq(table.abilityNo, abilityNo)))
      .limit(1);
    return row
      ? projectAbilityRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 프로젝트 어빌리티 생성 (prjNo 필수).
   * @param vo 생성할 VO
   */
  async insert(vo: ProjectAbilityVo): Promise<ProjectAbilityVo> {
    const db = getDb();
    const mode = getDbMode();
    const prjNo = vo.prjNo ?? 0;
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      prjNo,
      abilityNm: (vo.abilityNm ?? '').toString().trim(),
      abilityType: vo.abilityType ?? null,
      abilityLcls: vo.abilityLcls ?? null,
      abilityExpln: vo.abilityExpln ?? null,
      trgtType: vo.trgtType ?? null,
      dmgType: vo.dmgType ?? null,
      statEffType: vo.statEffType ?? null,
      useCost: vo.useCost ?? null,
      coolTime: vo.coolTime ?? null,
      castTime: vo.castTime ?? null,
      useCnd: vo.useCnd ?? null,
    };

    if (mode === 'local') {
      const table = localProjectAbilitiesTable;
      const dbLocal = db as LocalDb;
      const [ inserted, ] = await dbLocal
        .insert(table)
        .values({ ...values, crtDt: now as string, updtDt: now as string, })
        .returning();
      if (!inserted) throw new Error('ProjectAbilityMapper.insert: no row returned');
      return projectAbilityRowToVo(inserted as unknown as Record<string, unknown>);
    }

    const table = remoteProjectAbilitiesTable;
    const dbRemote = db as RemoteDb;
    const [ inserted, ] = await dbRemote
      .insert(table)
      .values({ ...values, crtDt: now as Date, updtDt: now as Date, })
      .returning();
    if (!inserted) throw new Error('ProjectAbilityMapper.insert: no row returned');
    return projectAbilityRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description 프로젝트 어빌리티 수정 (prjNo + abilityNo).
   * @param prjNo 프로젝트 번호
   * @param abilityNo 어빌리티 번호
   * @param vo 수정할 필드 (부분)
   */
  async update(
    prjNo: number,
    abilityNo: number,
    vo: Partial<ProjectAbilityVo>
  ): Promise<ProjectAbilityVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
      abilityNm: vo.abilityNm ?? undefined,
      abilityType: vo.abilityType ?? undefined,
      abilityLcls: vo.abilityLcls ?? undefined,
      abilityExpln: vo.abilityExpln ?? undefined,
      trgtType: vo.trgtType ?? undefined,
      dmgType: vo.dmgType ?? undefined,
      statEffType: vo.statEffType ?? undefined,
      useCost: vo.useCost ?? undefined,
      coolTime: vo.coolTime ?? undefined,
      castTime: vo.castTime ?? undefined,
      useCnd: vo.useCnd ?? undefined,
      updtDt: now,
    };

    const where = and(
      eq(localProjectAbilitiesTable.prjNo, prjNo),
      eq(localProjectAbilitiesTable.abilityNo, abilityNo)
    );

    if (mode === 'local') {
      const table = localProjectAbilitiesTable;
      const dbLocal = db as LocalDb;
      const [ updated, ] = await dbLocal
        .update(table)
        .set(values as Record<string, unknown>)
        .where(where)
        .returning();
      return updated
        ? projectAbilityRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteProjectAbilitiesTable;
    const dbRemote = db as RemoteDb;
    const whereRemote = and(eq(table.prjNo, prjNo), eq(table.abilityNo, abilityNo));
    const [ updated, ] = await dbRemote
      .update(table)
      .set(values as Record<string, unknown>)
      .where(whereRemote)
      .returning();
    return updated
      ? projectAbilityRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 소프트 삭제 (prjNo + abilityNo).
   * @param prjNo 프로젝트 번호
   * @param abilityNo 어빌리티 번호
   */
  async delete(prjNo: number, abilityNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    if (mode === 'local') {
      const table = localProjectAbilitiesTable;
      const dbLocal = db as LocalDb;
      const result = await dbLocal
        .update(table)
        .set({ delYn: 'Y', delDt: now as string, })
        .where(and(eq(table.prjNo, prjNo), eq(table.abilityNo, abilityNo)))
        .returning({ abilityNo: table.abilityNo, });
      return result.length > 0;
    }

    const table = remoteProjectAbilitiesTable;
    const dbRemote = db as RemoteDb;
    const result = await dbRemote
      .update(table)
      .set({ delYn: 'Y', delDt: now as Date, })
      .where(and(eq(table.prjNo, prjNo), eq(table.abilityNo, abilityNo)))
      .returning({ abilityNo: table.abilityNo, });
    return result.length > 0;
  },
};
