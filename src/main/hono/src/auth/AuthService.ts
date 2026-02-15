import { sign, verify } from 'hono/jwt';

import type { ResponseType } from '@app-types/response.types';
import type { UserVo } from '@app-types/vo.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

import { UserService } from '../user/UserService';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('Missing AUTH_SECRET in environment variables (ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET)');
}

const ACCESS_EXP_STR = process.env.ACCESS_TOKEN_EXP || '1h';
const REFRESH_EXP_STR = process.env.REFRESH_TOKEN_EXP || '7d';

/** 시간 문자열(1h, 7d)을 초 단위로 변환 */
const parseDuration = (duration: string): number => {
  const match = duration.match(/^(\d+)([dhms])$/);
  if (!match) return 3600; // default 1h
  const val = parseInt(match[1], 10);
  const unit = match[2];
  if (unit === 'd') return val * 24 * 60 * 60;
  if (unit === 'h') return val * 60 * 60;
  if (unit === 'm') return val * 60;
  if (unit === 's') return val;
  return 3600;
};

const ACCESS_EXP_SEC = parseDuration(ACCESS_EXP_STR);
const REFRESH_EXP_SEC = parseDuration(REFRESH_EXP_STR);

export const AuthService = {
  /**
   * @description 로그인 (이메일/비번 검증 -> 액세스/리프레시 토큰 발급)
   */
  async signin(email: string, password: string): Promise<ResponseType<{ accessToken: string; refreshToken: string; user: UserVo } | null>> {
    const user = await UserService.getByEmail(email);

    if (!user) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.UNAUTHORIZED,
        message: '존재하지 않는 이메일입니다.',
      };
    }

    const isPasswordValid = user.enpswd === password;
    if (!isPasswordValid) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.UNAUTHORIZED,
        message: '비밀번호가 일치하지 않습니다.',
      };
    }

    // 민감 정보 제거
    const { enpswd: _, ...safeUser } = user;

    const payloadBase = {
      userNo: safeUser.userNo,
      userEml: safeUser.userEml,
    };

    const now = Math.floor(Date.now() / 1000);

    const accessToken = await sign({ ...payloadBase, exp: now + ACCESS_EXP_SEC, }, ACCESS_SECRET!, 'HS256');
    const refreshToken = await sign({ ...payloadBase, exp: now + REFRESH_EXP_SEC, }, REFRESH_SECRET!, 'HS256');

    return {
      data: {
        accessToken,
        refreshToken,
        user: safeUser as UserVo,
      },
      error: false,
      code: RESPONSE_CODE.OK,
      message: '로그인 성공',
    };
  },

  /**
   * @description 리프레시 토큰으로 토큰 재발급 (Access + Refresh 둘 다 갱신 - Rotation)
   */
  async refresh(oldRefreshToken: string): Promise<ResponseType<{ accessToken: string; refreshToken: string; user: UserVo } | null>> {
    try {
      const payload = await verify(oldRefreshToken, REFRESH_SECRET!, 'HS256');
      if (!payload || !payload.userNo) throw new Error('Invalid token');

      const userNo = Number(payload.userNo);
      const userResponse = await UserService.getByNo(userNo);

      if (userResponse.data === null) throw new Error('User not found');

      const user = userResponse.data;
      const { enpswd: _, ...safeUser } = user;

      // 민감 정보 제거

      const payloadBase = {
        userNo: safeUser.userNo,
        userEml: safeUser.userEml,
      };

      const now = Math.floor(Date.now() / 1000);

      // Rotation: 둘 다 새로 발급
      const accessToken = await sign({ ...payloadBase, exp: now + ACCESS_EXP_SEC, }, ACCESS_SECRET!, 'HS256');
      const refreshToken = await sign({ ...payloadBase, exp: now + REFRESH_EXP_SEC, }, REFRESH_SECRET!, 'HS256');

      return {
        data: {
          accessToken,
          refreshToken,
          user: safeUser as UserVo,
        },
        error: false,
        code: RESPONSE_CODE.OK,
        message: '토큰 갱신 성공',
      };
    }
    catch (_error) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.UNAUTHORIZED,
        message: '유효하지 않은 리프레시 토큰입니다.',
      };
    }
  },

  /**
   * @description 액세스 토큰 검증 및 유저 조회
   */
  async verifyAccessToken(token: string): Promise<ResponseType<UserVo | null>> {
    try {
      const payload = await verify(token, ACCESS_SECRET!, 'HS256');
      if (!payload || !payload.userNo) throw new Error('Invalid payload');

      const userNo = Number(payload.userNo);
      return await UserService.getByNo(userNo);
    }
    catch (_error) {
      return {
        data: null,
        error: true,
        code: RESPONSE_CODE.UNAUTHORIZED,
        message: '유효하지 않은 액세스 토큰입니다.',
      };
    }
  },
};
