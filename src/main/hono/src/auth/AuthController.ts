import { Hono } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

import { RESPONSE_CODE } from '@constants/response-code.const';

import { AuthService } from './AuthService';

const auth = new Hono();

// 시간 파싱 로직 (Service와 동일하게 유지)
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

const ACCESS_EXP_STR = process.env.ACCESS_TOKEN_EXP || '1h';
const REFRESH_EXP_STR = process.env.REFRESH_TOKEN_EXP || '7d';

const ACCESS_EXP_SEC = parseDuration(ACCESS_EXP_STR);
const REFRESH_EXP_SEC = parseDuration(REFRESH_EXP_STR);

/**
 * @description POST /auth/signin
 * 이메일/비번 -> 검증 -> 쿠키 설정 (Access + Refresh) -> 유저 정보 반환
 */
auth.post('/signin', async (context) => {
  const { userEml, enpswd, } = await context.req.json();

  if (!userEml || !enpswd) {
    return context.json(
      {
        data: null,
        error: true,
        code: RESPONSE_CODE.BAD_REQUEST,
        message: '이메일과 비밀번호를 입력해주세요.',
      },
      200
    );
  }

  const result = await AuthService.signin(userEml, enpswd);

  if (result.error || !result.data) {
    return context.json(result, 200);
  }

  const { accessToken, refreshToken, user, } = result.data;

  // Access Token Cookie
  setCookie(context, 'accessToken', accessToken, {
    httpOnly: true,
    secure: false, // 로컬 환경
    path: '/',
    maxAge: ACCESS_EXP_SEC,
  });

  // Refresh Token Cookie
  setCookie(context, 'refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    path: '/', // 전체 경로에서 접근 가능해야 Rotation 가능
    maxAge: REFRESH_EXP_SEC,
  });

  // 응답 Body에는 유저 정보만
  return context.json({
    data: user,
    error: false,
    code: RESPONSE_CODE.OK,
    message: '로그인 성공',
  }, 200);
});

/**
 * @description POST /auth/signout
 * 쿠키 삭제
 */
auth.post('/signout', async (context) => {
  deleteCookie(context, 'accessToken', { path: '/', secure: false, });
  deleteCookie(context, 'refreshToken', { path: '/', secure: false, });

  return context.json({
    data: null,
    error: false,
    code: RESPONSE_CODE.OK,
    message: '로그아웃 성공',
  }, 200);
});

/**
 * @description GET /auth/me
 * 1. Access Token 검증 -> 성공 시 유저 반환
 * 2. 실패 시 Refresh Token 검증 -> 성공 시 토큰 Rotation (쿠키 갱신) 후 유저 반환
 * 3. 둘 다 실패 시 -> 401
 */
auth.get('/me', async (context) => {
  const accessToken = getCookie(context, 'accessToken');
  const refreshToken = getCookie(context, 'refreshToken');

  // 1. Access Token 시도
  if (accessToken) {
    const accessResult = await AuthService.verifyAccessToken(accessToken);
    if (!accessResult.error && accessResult.data) {
      return context.json(accessResult, 200);
    }
  }

  // 2. Refresh Token 시도 (Access 없거나 만료됨)
  if (refreshToken) {
    const refreshResult = await AuthService.refresh(refreshToken);

    if (!refreshResult.error && refreshResult.data) {
      const { accessToken: newAccess, refreshToken: newRefresh, user, } = refreshResult.data;

      // 쿠키 갱신 (Rotation)
      setCookie(context, 'accessToken', newAccess, {
        httpOnly: true,
        secure: false,
        path: '/',
        maxAge: ACCESS_EXP_SEC,
      });

      setCookie(context, 'refreshToken', newRefresh, {
        httpOnly: true,
        secure: false,
        path: '/',
        maxAge: REFRESH_EXP_SEC,
      });

      return context.json({
        data: user,
        error: false,
        code: RESPONSE_CODE.OK,
        message: '토큰 갱신 성공',
      }, 200);
    }
  }

  // 3. 인증 실패
  // 쿠키 정리
  deleteCookie(context, 'accessToken');
  deleteCookie(context, 'refreshToken');

  return context.json({
    data: null,
    error: true,
    code: RESPONSE_CODE.UNAUTHORIZED,
    message: '로그인되어 있지 않습니다.',
  }, 200);
});

export { auth as AuthController };
