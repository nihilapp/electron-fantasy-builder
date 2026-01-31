import type { RESPONSE_CODE } from '@constants/response-code.const';

/**
 * API 표준 응답 래퍼.
 * 모든 API는 HTTP 200으로 반환하며, 성공/실패는 error·code 필드로 구분.
 */
export interface ResponseType<TData> {
  data: TData;
  error: boolean;
  code: (typeof RESPONSE_CODE)[keyof typeof RESPONSE_CODE];
  message: string;
}

/** 목록 응답용 페이징 구조 (data 안에 넣어 사용). */
export interface ListType<TData> {
  list: TData[];
  totalCnt: number;
  pageSize: number;
  page: number;
  totalPage: number;
  isFirst: boolean;
  isLast: boolean;
}

/** 목록 API 응답 타입: ResponseType<ListType<TData>> */
export type ListResponseType<TData> = ResponseType<ListType<TData>>;
