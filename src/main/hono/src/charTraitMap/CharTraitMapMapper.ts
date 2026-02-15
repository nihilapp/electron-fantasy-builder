import { and, eq } from 'drizzle-orm';

import type { CharTraitMapVo } from '@app-types/vo.types';
import { charTraitMapSchema } from '@zod-schema/charTraitMap.schema';

import type { LocalDb } from '../common/db/client/local';
import type { RemoteDb } from '../common/db/client/remote';
import { getDb } from '../common/db/context';
import { getDbMode } from '../common/db/context';
import { rowToVo } from '../common/db/rowToVo';
import { charTraitMapsTable as localTable } from '../common/db/schema/local/char_trait_maps.table';
import { charTraitMapsTable as remoteTable } from '../common/db/schema/remote/char_trait_maps.table';

/**
 * @description DB row → 인물-특성 매핑 VO.
 * @param row DB 결과 한 행
 */
function rowToVoMap(row: Record<string, unknown>): CharTraitMapVo {
  return rowToVo(row, charTraitMapSchema);
}

export const CharTraitMapMapper = {
  /**
   * @description 인물 기준 목록 조회.
   * @param charNo 인물 번호
   */
  async selectList(charNo: number): Promise<CharTraitMapVo[]> {
    const db = getDb();
    const mode = getDbMode();
    if (mode === 'local') {
      const rows = await (db as LocalDb).select().from(localTable).where(eq(localTable.charNo, charNo));
      return rows.map((row) => rowToVoMap(row as unknown as Record<string, unknown>));
    }
    const rows = await (db as RemoteDb).select().from(remoteTable).where(eq(remoteTable.charNo, charNo));
    return rows.map((row) => rowToVoMap(row as unknown as Record<string, unknown>));
  },

  /**
   * @description 단건 조회 (charNo + traitNo + traitType).
   * @param charNo 인물 번호
   * @param traitNo 특성 번호
   * @param traitType 특성 타입 (GLOBAL | PROJECT)
   */
  async selectOne(charNo: number, traitNo: number, traitType: string): Promise<CharTraitMapVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const where = and(
      eq(localTable.charNo, charNo),
      eq(localTable.traitNo, traitNo),
      eq(localTable.traitType, traitType)
    );
    if (mode === 'local') {
      const [ row, ] = await (db as LocalDb).select().from(localTable).where(where).limit(1);
      return row
        ? rowToVoMap(row as unknown as Record<string, unknown>)
        : null;
    }
    const [ row, ] = await (db as RemoteDb).select().from(remoteTable).where(and(eq(remoteTable.charNo, charNo), eq(remoteTable.traitNo, traitNo), eq(remoteTable.traitType, traitType))).limit(1);
    return row
      ? rowToVoMap(row as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 인물-특성 매핑 생성.
   * @param vo 생성할 VO
   */
  async insert(vo: CharTraitMapVo): Promise<CharTraitMapVo> {
    const db = getDb();
    const mode = getDbMode();
    const values = { charNo: vo.charNo, traitNo: vo.traitNo, traitType: vo.traitType, traitRmk: vo.traitRmk ?? null, };
    if (mode === 'local') {
      const [ inserted, ] = await (db as LocalDb).insert(localTable).values(values).returning();
      if (!inserted) throw new Error('CharTraitMapMapper.insert: no row returned');
      return rowToVoMap(inserted as unknown as Record<string, unknown>);
    }
    const [ inserted, ] = await (db as RemoteDb).insert(remoteTable).values(values).returning();
    if (!inserted) throw new Error('CharTraitMapMapper.insert: no row returned');
    return rowToVoMap(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description 인물-특성 매핑 수정.
   * @param charNo 인물 번호
   * @param traitNo 특성 번호
   * @param traitType 특성 타입
   * @param vo 수정할 필드 (부분)
   */
  async update(charNo: number, traitNo: number, traitType: string, vo: Partial<CharTraitMapVo>): Promise<CharTraitMapVo | null> {
    const db = getDb();
    const mode = getDbMode();
    const values: Record<string, unknown> = { traitRmk: vo.traitRmk ?? undefined, };
    if (mode === 'local') {
      const [ updated, ] = await (db as LocalDb).update(localTable).set(values).where(and(eq(localTable.charNo, charNo), eq(localTable.traitNo, traitNo), eq(localTable.traitType, traitType))).returning();
      return updated
        ? rowToVoMap(updated as unknown as Record<string, unknown>)
        : null;
    }
    const [ updated, ] = await (db as RemoteDb).update(remoteTable).set(values).where(and(eq(remoteTable.charNo, charNo), eq(remoteTable.traitNo, traitNo), eq(remoteTable.traitType, traitType))).returning();
    return updated
      ? rowToVoMap(updated as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 인물-특성 매핑 삭제.
   * @param charNo 인물 번호
   * @param traitNo 특성 번호
   * @param traitType 특성 타입
   */
  async delete(charNo: number, traitNo: number, traitType: string): Promise<boolean> {
    const db = getDb();
    const mode = getDbMode();
    if (mode === 'local') {
      const result = await (db as LocalDb).delete(localTable).where(and(eq(localTable.charNo, charNo), eq(localTable.traitNo, traitNo), eq(localTable.traitType, traitType))).returning({ charNo: localTable.charNo, });
      return result.length > 0;
    }
    const result = await (db as RemoteDb).delete(remoteTable).where(and(eq(remoteTable.charNo, charNo), eq(remoteTable.traitNo, traitNo), eq(remoteTable.traitType, traitType))).returning({ charNo: remoteTable.charNo, });
    return result.length > 0;
  },
};
