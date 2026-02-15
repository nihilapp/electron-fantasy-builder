import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { ResponseType } from '@app-types/response.types';
import { RESPONSE_CODE } from '@constants/response-code.const';

type ErrorResponse = ResponseType<null>;
type ResponseCode = (typeof RESPONSE_CODE)[keyof typeof RESPONSE_CODE];

/**
 * @description 이 프로젝트는 모든 API 응답을 HTTP 200으로 반환하며, 성공/실패는 본문의 error·code 필드로 구분한다. (4xx/5xx 상태 코드 미사용)
 */

/** @description HTTPException.status → RESPONSE_CODE 매핑 (본문 code용, HTTP 상태 아님) */
const STATUS_TO_CODE: Record<number, ResponseCode> = {
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

/** @description 표준 에러 응답 객체 생성 */
function toErrorResponse(code: ResponseCode, message: string): ErrorResponse {
  return {
    data: null,
    error: true,
    code,
    message: message || '오류가 발생했습니다.',
  };
}

/**
 * @description Hono 전역 에러 핸들러. 미처리 예외를 ResponseType 형태로 변환해 HTTP 200으로 반환한다.
 * @param err 발생한 예외
 * @param context Hono 컨텍스트
 */
export function globalExceptionHandler(err: Error, context: Context): Response {
  if (err instanceof HTTPException) {
    const code = STATUS_TO_CODE[err.status] ?? RESPONSE_CODE.ERROR;
    const message = err.message || `HTTP ${err.status}`;

    return context.json(
      toErrorResponse(code, message),
      200
    );
  }

  const message = err instanceof Error
    ? err.message
    : String(err);

  return context.json(
    toErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, message),
    200
  );
}
