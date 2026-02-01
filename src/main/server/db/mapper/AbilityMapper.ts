import { abilitySchema } from '@zod-schema/ability.schema';
import { and, count, desc, eq, like, or } from 'drizzle-orm';

import type { AbilityVo } from '@app-types/vo.types';

import { abilitiesTable as localAbilitiesTable } from '../../schema/local/abilities.table';
import { abilitiesTable as remoteAbilitiesTable } from '../../schema/remote/abilities.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

/** DB row → 어빌리티 VO */
function abilityRowToVo(row: Record<string, unknown>): AbilityVo {
  return rowToVo(row, abilitySchema);
}

export const AbilityMapper = {
  /** 목록 조회 (del_yn = 'N', ability_no 내림차순, 페이징, 검색) */
  async selectList(params: AbilityVo): Promise<{ list: AbilityVo[]; totalCnt: number }> {
    const db = getDb();
    const mode = getDbMode();
    const { page, pageSize, searchKeyword, searchType, } = params;

    const createWhere = (table: any) => {
      let where = eq(table.delYn, 'N');
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
      const table = localAbilitiesTable;
      const dbLocal = db as LocalDb;
      const where = createWhere(table);

      const [ countRow, ] = await dbLocal.select({ count: count(), }).from(table).where(where);
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
      const list = rows.map((r) => abilityRowToVo(r as unknown as Record<string, unknown>));

      return { list, totalCnt, };
    }

    const table = remoteAbilitiesTable;
    const dbRemote = db as RemoteDb;
    const where = createWhere(table);

    const [ countRow, ] = await dbRemote.select({ count: count(), }).from(table).where(where);
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
    const list = rows.map((r) => abilityRowToVo(r as unknown as Record<string, unknown>));

    return { list, totalCnt, };
  },

  async selectByNo(abilityNo: number): Promise<AbilityVo | null> {
    const db = getDb();
    const mode = getDbMode();

    if (mode === 'local') {
      const table = localAbilitiesTable;
      const dbLocal = db as LocalDb;
      const [ row, ] = await dbLocal.select().from(table).where(eq(table.abilityNo, abilityNo)).limit(1);
      return row
        ? abilityRowToVo(row as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteAbilitiesTable;
    const dbRemote = db as RemoteDb;
    const [ row, ] = await dbRemote.select().from(table).where(eq(table.abilityNo, abilityNo)).limit(1);
    return row
      ? abilityRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  async insert(vo: AbilityVo): Promise<AbilityVo> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    const values = {
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
      const table = localAbilitiesTable;
      const dbLocal = db as LocalDb;
      const [ inserted, ] = await dbLocal
        .insert(table)
        .values({ ...values, crtDt: now as string, updtDt: now as string, })
        .returning();
      if (!inserted) throw new Error('AbilityMapper.insert: no row returned');
      return abilityRowToVo(inserted as unknown as Record<string, unknown>);
    }

    const table = remoteAbilitiesTable;
    const dbRemote = db as RemoteDb;
    const [ inserted, ] = await dbRemote
      .insert(table)
      .values({ ...values, crtDt: now as Date, updtDt: now as Date, })
      .returning();
    if (!inserted) throw new Error('AbilityMapper.insert: no row returned');
    return abilityRowToVo(inserted as unknown as Record<string, unknown>);
  },

  async update(abilityNo: number, vo: Partial<AbilityVo>): Promise<AbilityVo | null> {
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

    if (mode === 'local') {
      const table = localAbilitiesTable;
      const dbLocal = db as LocalDb;
      const [ updated, ] = await dbLocal
        .update(table)
        .set(values as any)
        .where(eq(table.abilityNo, abilityNo))
        .returning();
      return updated
        ? abilityRowToVo(updated as unknown as Record<string, unknown>)
        : null;
    }

    const table = remoteAbilitiesTable;
    const dbRemote = db as RemoteDb;
    const [ updated, ] = await dbRemote
      .update(table)
      .set(values as any)
      .where(eq(table.abilityNo, abilityNo))
      .returning();
    return updated
      ? abilityRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  async delete(abilityNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    const now = mode === 'local'
      ? new Date().toISOString()
      : new Date();

    if (mode === 'local') {
      const table = localAbilitiesTable;
      const dbLocal = db as LocalDb;
      const result = await dbLocal
        .update(table)
        .set({ delYn: 'Y', delDt: now as string, })
        .where(eq(table.abilityNo, abilityNo))
        .returning({ abilityNo: table.abilityNo, });
      return result.length > 0;
    }

    const table = remoteAbilitiesTable;
    const dbRemote = db as RemoteDb;
    const result = await dbRemote
      .update(table)
      .set({ delYn: 'Y', delDt: now as Date, })
      .where(eq(table.abilityNo, abilityNo))
      .returning({ abilityNo: table.abilityNo, });
    return result.length > 0;
  },
};
