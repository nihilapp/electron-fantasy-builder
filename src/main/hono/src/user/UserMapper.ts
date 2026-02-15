import { and, eq } from 'drizzle-orm';

import type { UserVo } from '@app-types/vo.types';
import { userSchema } from '@zod-schema/user.schema';

import type { RemoteDb } from '../common/db/client/remote';
import { getDb } from '../common/db/context';
import { rowToVo } from '../common/db/rowToVo';
import { usersTable as remoteUsersTable } from '../common/db/schema/remote/users.table';

/**
 * @description DB row → 사용자 VO.
 * @param row DB 결과 한 행
 */
function userRowToVo(row: Record<string, unknown>): UserVo {
  return rowToVo(row, userSchema);
}

export const UserMapper = {
  /**
   * @description 사용자 번호로 조회.
   * @param userNo 사용자 번호
   */
  async selectByNo(userNo: number): Promise<UserVo | null> {
    const db = getDb() as RemoteDb;
    const table = remoteUsersTable;

    const [ row, ] = await db
      .select()
      .from(table)
      .where(and(eq(table.userNo, userNo), eq(table.delYn, 'N')))
      .limit(1);

    return row
      ? userRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 이메일로 조회.
   * @param email 이메일
   */
  async selectByEmail(email: string): Promise<UserVo | null> {
    const db = getDb() as RemoteDb;
    const table = remoteUsersTable;

    const [ row, ] = await db
      .select()
      .from(table)
      .where(and(eq(table.userEml, email), eq(table.delYn, 'N')))
      .limit(1);

    return row
      ? userRowToVo(row as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 사용자 생성.
   * @param vo 생성할 VO
   */
  async insert(vo: UserVo): Promise<UserVo> {
    const db = getDb() as RemoteDb;
    const table = remoteUsersTable;
    const now = new Date();

    const values = {
      userEml: vo.userEml ?? '',
      userNm: vo.userNm ?? null,
      userRole: vo.userRole ?? 'USER',
      proflImgUrl: vo.proflImgUrl ?? null,
      biogp: vo.biogp ?? null,
      enpswd: vo.enpswd ?? null,
      reshToken: vo.reshToken ?? null,
      acntLckYn: vo.acntLckYn ?? 'N',
      lgnFailNmtm: vo.lgnFailNmtm ?? 0,
      lastLgnDt: vo.lastLgnDt
        ? new Date(vo.lastLgnDt)
        : null,
      lastLgnIp: vo.lastLgnIp ?? null,
      lastPswdChgDt: vo.lastPswdChgDt
        ? new Date(vo.lastPswdChgDt)
        : null,
      emlAuthYn: vo.emlAuthYn ?? 'N',
      mktRecpAgreYn: vo.mktRecpAgreYn ?? 'N',
      crtDt: now,
      updtDt: now,
    };

    const [ inserted, ] = await db
      .insert(table)
      .values(values)
      .returning();

    if (!inserted) throw new Error('UserMapper.insert: no row returned');

    return userRowToVo(inserted as unknown as Record<string, unknown>);
  },

  /**
   * @description 사용자 수정.
   * @param userNo 사용자 번호
   * @param vo 수정할 필드 (부분)
   */
  async update(userNo: number, vo: Partial<UserVo>): Promise<UserVo | null> {
    const db = getDb() as RemoteDb;
    const table = remoteUsersTable;
    const now = new Date();

    const values = {
      userNm: vo.userNm ?? undefined,
      proflImgUrl: vo.proflImgUrl ?? undefined,
      biogp: vo.biogp ?? undefined,
      enpswd: vo.enpswd ?? undefined,
      reshToken: vo.reshToken ?? undefined,
      acntLckYn: vo.acntLckYn ?? undefined,
      lgnFailNmtm: vo.lgnFailNmtm ?? undefined,
      lastLgnDt: vo.lastLgnDt
        ? new Date(vo.lastLgnDt)
        : undefined,
      lastLgnIp: vo.lastLgnIp ?? undefined,
      lastPswdChgDt: vo.lastPswdChgDt
        ? new Date(vo.lastPswdChgDt)
        : undefined,
      emlAuthYn: vo.emlAuthYn ?? undefined,
      mktRecpAgreYn: vo.mktRecpAgreYn ?? undefined,
      updtDt: now,
    };

    const [ updated, ] = await db
      .update(table)
      .set(values as Record<string, unknown>)
      .where(eq(table.userNo, userNo))
      .returning();

    return updated
      ? userRowToVo(updated as unknown as Record<string, unknown>)
      : null;
  },

  /**
   * @description 소프트 삭제.
   * @param userNo 사용자 번호
   */
  async delete(userNo: number): Promise<boolean> {
    const db = getDb() as RemoteDb;
    const table = remoteUsersTable;
    const now = new Date();

    const result = await db
      .update(table)
      .set({ delYn: 'Y', delDt: now, })
      .where(eq(table.userNo, userNo))
      .returning({ userNo: table.userNo, });

    return result.length > 0;
  },
};
