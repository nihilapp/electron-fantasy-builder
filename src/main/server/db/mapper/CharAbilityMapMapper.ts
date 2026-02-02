import { and, eq } from 'drizzle-orm';

import type { CharAbilityMapVo } from '@app-types/vo.types';
import { charAbilityMapSchema } from '@zod-schema/charAbilityMap.schema';

import { charAbilityMapsTable as localTable } from '../../schema/local/char_ability_maps.table';
import { charAbilityMapsTable as remoteTable } from '../../schema/remote/char_ability_maps.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

function rowToVoMap(row: Record<string, unknown>): CharAbilityMapVo {
  return rowToVo(row, charAbilityMapSchema);
}

export const CharAbilityMapMapper = {
  async selectList(charNo: number): Promise<CharAbilityMapVo[]> {
    const db = getDb();
    const mode = getDbMode();
    if (mode === 'local') {
      const rows = await (db as LocalDb).select().from(localTable).where(eq(localTable.charNo, charNo));
      return rows.map((r) => rowToVoMap(r as unknown as Record<string, unknown>));
    }
    const rows = await (db as RemoteDb).select().from(remoteTable).where(eq(remoteTable.charNo, charNo));
    return rows.map((r) => rowToVoMap(r as unknown as Record<string, unknown>));
  },

  async selectOne(charNo: number, abilityNo: number, abilityType: string): Promise<CharAbilityMapVo | null> {
    const db = getDb();
    const mode = getDbMode();
    if (mode === 'local') {
      const [ row, ] = await (db as LocalDb).select().from(localTable).where(and(eq(localTable.charNo, charNo), eq(localTable.abilityNo, abilityNo), eq(localTable.abilityType, abilityType))).limit(1);
      return row
        ? rowToVoMap(row as unknown as Record<string, unknown>)
        : null;
    }
    const [ row, ] = await (db as RemoteDb).select().from(remoteTable).where(and(eq(remoteTable.charNo, charNo), eq(remoteTable.abilityNo, abilityNo), eq(remoteTable.abilityType, abilityType))).limit(1);
    return row
      ? rowToVoMap(row as unknown as Record<string, unknown>)
      : null;
  },

  async insert(vo: CharAbilityMapVo): Promise<CharAbilityMapVo> {
    const db = getDb();
    const mode = getDbMode();
    const values = { charNo: vo.charNo, abilityNo: vo.abilityNo, abilityType: vo.abilityType, profLvl: vo.profLvl ?? null, abilityRmk: vo.abilityRmk ?? null, };
    if (mode === 'local') {
      const [ inserted, ] = await (db as LocalDb).insert(localTable).values(values).returning();
      if (!inserted) throw new Error('CharAbilityMapMapper.insert: no row returned');
      return rowToVoMap(inserted as unknown as Record<string, unknown>);
    }
    const [ inserted, ] = await (db as RemoteDb).insert(remoteTable).values(values).returning();
    if (!inserted) throw new Error('CharAbilityMapMapper.insert: no row returned');
    return rowToVoMap(inserted as unknown as Record<string, unknown>);
  },

  async update(charNo: number, abilityNo: number, abilityType: string, vo: Partial<CharAbilityMapVo>): Promise<CharAbilityMapVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const values: Record<string, unknown> = { profLvl: vo.profLvl ?? undefined, abilityRmk: vo.abilityRmk ?? undefined, };
    if (mode === 'local') {
      const [ updated, ] = await (db as LocalDb).update(localTable).set(values).where(and(eq(localTable.charNo, charNo), eq(localTable.abilityNo, abilityNo), eq(localTable.abilityType, abilityType))).returning();
      return updated
        ? rowToVoMap(updated as unknown as Record<string, unknown>)
        : null;
    }
    const [ updated, ] = await (db as RemoteDb).update(remoteTable).set(values).where(and(eq(remoteTable.charNo, charNo), eq(remoteTable.abilityNo, abilityNo), eq(remoteTable.abilityType, abilityType))).returning();
    return updated
      ? rowToVoMap(updated as unknown as Record<string, unknown>)
      : null;
  },

  async delete(charNo: number, abilityNo: number, abilityType: string): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    if (mode === 'local') {
      const result = await (db as LocalDb).delete(localTable).where(and(eq(localTable.charNo, charNo), eq(localTable.abilityNo, abilityNo), eq(localTable.abilityType, abilityType))).returning({ charNo: localTable.charNo, });
      return result.length > 0;
    }
    const result = await (db as RemoteDb).delete(remoteTable).where(and(eq(remoteTable.charNo, charNo), eq(remoteTable.abilityNo, abilityNo), eq(remoteTable.abilityType, abilityType))).returning({ charNo: remoteTable.charNo, });
    return result.length > 0;
  },
};
