import { eq } from 'drizzle-orm';

import type { CreatureAbilityMapVo } from '@app-types/vo.types';
import { creatureAbilityMapSchema } from '@zod-schema/creatureAbilityMap.schema';

import { creatureAbilityMapsTable as localTable } from '../../schema/local/creature_ability_maps.table';
import { creatureAbilityMapsTable as remoteTable } from '../../schema/remote/creature_ability_maps.table';
import type { LocalDb } from '../client/local';
import type { RemoteDb } from '../client/remote';
import { getDb } from '../context';
import { getDbMode } from '../context';

import { rowToVo } from './rowToVo';

/**
 * @description DB row → 종족-어빌리티 매핑 VO.
 * @param row DB 결과 한 행
 */
function rowToVoMap(row: Record<string, unknown>): CreatureAbilityMapVo {
  return rowToVo(row, creatureAbilityMapSchema);
}

export const CreatureAbilityMapMapper = {
  /**
   * @description 종족 기준 목록 조회.
   * @param creatureNo 종족 번호
   */
  async selectList(creatureNo: number): Promise<CreatureAbilityMapVo[]> {
    const db = getDb();
    const mode = getDbMode();
    if (mode === 'local') {
      const rows = await (db as LocalDb).select().from(localTable).where(eq(localTable.creatureNo, creatureNo));
      return rows.map((row) => rowToVoMap(row as unknown as Record<string, unknown>));
    }
    const rows = await (db as RemoteDb).select().from(remoteTable).where(eq(remoteTable.creatureNo, creatureNo));
    return rows.map((row) => rowToVoMap(row as unknown as Record<string, unknown>));
  },

  /**
   * @description 단건 조회 (mapNo).
   * @param mapNo 매핑 번호
   */
  async selectByMapNo(mapNo: number): Promise<CreatureAbilityMapVo | null> {
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

  /**
   * @description 종족-어빌리티 매핑 생성.
   * @param vo 생성할 VO
   */
  async insert(vo: CreatureAbilityMapVo): Promise<CreatureAbilityMapVo> {
    const db = getDb();
    const mode = getDbMode();
    const values = { creatureNo: vo.creatureNo, abilityNo: vo.abilityNo, abilityType: vo.abilityType, profLvl: vo.profLvl ?? null, abilityRmk: vo.abilityRmk ?? null, };
    if (mode === 'local') {
      const [ inserted, ] = await (db as LocalDb).insert(localTable).values(values).returning();
      if (!inserted) throw new Error('CreatureAbilityMapMapper.insert: no row returned');
      return rowToVoMap(inserted as unknown as Record<string, unknown>);
    }
    const [ inserted, ] = await (db as RemoteDb).insert(remoteTable).values(values).returning();
    if (!inserted) throw new Error('CreatureAbilityMapMapper.insert: no row returned');
    return rowToVoMap(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description 종족-어빌리티 매핑 수정.
   * @param mapNo 매핑 번호
   * @param vo 수정할 필드 (부분)
   */
  async update(mapNo: number, vo: Partial<CreatureAbilityMapVo>): Promise<CreatureAbilityMapVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const values: Record<string, unknown> = { profLvl: vo.profLvl ?? undefined, abilityRmk: vo.abilityRmk ?? undefined, };
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

  /**
   * @description 종족-어빌리티 매핑 삭제.
   * @param mapNo 매핑 번호
   */
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
