import { eq } from 'drizzle-orm';

import type { CreatureTraitMapVo } from '@app-types/vo.types';
import { creatureTraitMapSchema } from '@zod-schema/creatureTraitMap.schema';

import { creatureTraitMapsTable as localTable } from '../../schema/local/creature_trait_maps.table';
import { creatureTraitMapsTable as remoteTable } from '../../schema/remote/creature_trait_maps.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

function rowToVoMap(row: Record<string, unknown>): CreatureTraitMapVo {
  return rowToVo(row, creatureTraitMapSchema);
}

export const CreatureTraitMapMapper = {
  async selectList(creatureNo: number): Promise<CreatureTraitMapVo[]> {
    const db = getDb();
    const mode = getDbMode();
    if (mode === 'local') {
      const rows = await (db as LocalDb).select().from(localTable).where(eq(localTable.creatureNo, creatureNo));
      return rows.map((r) => rowToVoMap(r as unknown as Record<string, unknown>));
    }
    const rows = await (db as RemoteDb).select().from(remoteTable).where(eq(remoteTable.creatureNo, creatureNo));
    return rows.map((r) => rowToVoMap(r as unknown as Record<string, unknown>));
  },

  async selectByMapNo(mapNo: number): Promise<CreatureTraitMapVo | null> {
    const db = getDb();
    const mode = getDbMode();
    if (mode === 'local') {
      const [ row, ] = await (db as LocalDb).select().from(localTable).where(eq(localTable.mapNo, mapNo)).limit(1);
      return row
        ? rowToVoMap(row as unknown as Record<string, unknown>)
        : null;
    }
    const [ row, ] = await (db as RemoteDb).select().from(remoteTable).where(eq(remoteTable.mapNo, mapNo)).limit(1);
    return row
      ? rowToVoMap(row as unknown as Record<string, unknown>)
      : null;
  },

  async insert(vo: CreatureTraitMapVo): Promise<CreatureTraitMapVo> {
    const db = getDb();
    const mode = getDbMode();
    const values = { creatureNo: vo.creatureNo, traitNo: vo.traitNo, traitType: vo.traitType, traitRmk: vo.traitRmk ?? null, };
    if (mode === 'local') {
      const [ inserted, ] = await (db as LocalDb).insert(localTable).values(values).returning();
      if (!inserted) throw new Error('CreatureTraitMapMapper.insert: no row returned');
      return rowToVoMap(inserted as unknown as Record<string, unknown>);
    }
    const [ inserted, ] = await (db as RemoteDb).insert(remoteTable).values(values).returning();
    if (!inserted) throw new Error('CreatureTraitMapMapper.insert: no row returned');
    return rowToVoMap(inserted as unknown as Record<string, unknown>);
  },

  async update(mapNo: number, vo: Partial<CreatureTraitMapVo>): Promise<CreatureTraitMapVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const values: Record<string, unknown> = { traitRmk: vo.traitRmk ?? undefined, };
    if (mode === 'local') {
      const [ updated, ] = await (db as LocalDb).update(localTable).set(values).where(eq(localTable.mapNo, mapNo)).returning();
      return updated
        ? rowToVoMap(updated as unknown as Record<string, unknown>)
        : null;
    }
    const [ updated, ] = await (db as RemoteDb).update(remoteTable).set(values).where(eq(remoteTable.mapNo, mapNo)).returning();
    return updated
      ? rowToVoMap(updated as unknown as Record<string, unknown>)
      : null;
  },

  async delete(mapNo: number): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    if (mode === 'local') {
      const result = await (db as LocalDb).delete(localTable).where(eq(localTable.mapNo, mapNo)).returning({ mapNo: localTable.mapNo, });
      return result.length > 0;
    }
    const result = await (db as RemoteDb).delete(remoteTable).where(eq(remoteTable.mapNo, mapNo)).returning({ mapNo: remoteTable.mapNo, });
    return result.length > 0;
  },
};
