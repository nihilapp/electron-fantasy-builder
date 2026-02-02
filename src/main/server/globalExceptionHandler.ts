import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { ResponseType } from '@app-types/response.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

type ErrorResponse = ResponseType<null>;

/**
 * 이 프로젝트는 모든 API 응답이 HTTP 200입니다.
 * 성공/실패 구별은 본문의 error, code 필드로만 합니다. (4xx/5xx 상태 코드 사용 안 함)
 */

/** HTTPException.status → RESPONSE_CODE 매핑 (본문 code용, HTTP 상태 아님) */
const STATUS_TO_CODE: Record<number, (typeof RESPONSE_CODE)[keyof typeof RESPONSE_CODE]> = {
  400: RESPONSE_CODE.BAD_REQUEST,
  401: RESPONSE_CODE.UNAUTHORIZED,
  403: RESPONSE_CODE.FORBIDDEN,
  404: RESPONSE_CODE.NOT_FOUND,
  405: RESPONSE_CODE.METHOD_NOT_ALLOWED,
  408: RESPONSE_CODE.REQUEST_TIMEOUT,
  409: RESPONSE_CODE.CONFLICT,
  410: RESPONSE_CODE.GONE,
  412: RESPONSE_CODE.PRECONDITION_FAILED,
  413: RESPONSE_CODE.PAYLOAD_TOO_LARGE,
  415: RESPONSE_CODE.UNSUPPORTED_MEDIA_TYPE,
  422: RESPONSE_CODE.VALIDATION_ERROR,
  429: RESPONSE_CODE.TOO_MANY_REQUESTS,
  500: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
  501: RESPONSE_CODE.NOT_IMPLEMENTED,
  502: RESPONSE_CODE.BAD_GATEWAY,
  503: RESPONSE_CODE.SERVICE_UNAVAILABLE,
  504: RESPONSE_CODE.GATEWAY_TIMEOUT,
};

function toErrorResponse(
  code: (typeof RESPONSE_CODE)[keyof typeof RESPONSE_CODE],
  message: string
): ErrorResponse {
  return {
    data: null,
    error: true,
    code,
    message: message || '오류가 발생했습니다.',
  };
}

/**
 * Hono 전역 에러 핸들러.
 * 모든 미처리 예외를 표준 응답(ResponseType)으로 변환해 HTTP 200으로 반환합니다.
 * PRD: "모든 API는 HTTP 200으로 반환. 성공/실패는 본문의 error, code로 구분."
 */
export function globalExceptionHandler(err: Error, c: Context): Response {
  if (err instanceof HTTPException) {
    const status = err.status;
    const code = STATUS_TO_CODE[status] ?? RESPONSE_CODE.ERROR;
    const message = err.message || `HTTP ${status}`;
    // 항상 200 반환. 구별은 본문 error/code로.
    return c.json(toErrorResponse(code, message), 200);
  }

  const message
    = err instanceof Error
      ? err.message
      : String(err);
  // 항상 200 반환. 구별은 본문 error/code로.
  return c.json(
    toErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, message),
    200
  );
}
