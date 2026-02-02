/**
 * API 응답용 상태 코드 문자열.
 * HTTP 상태 코드와 대응하며, 표준 응답 래퍼의 code 필드 등에 사용.
 */
export const RESPONSE_CODE = {
  // 2xx Success
  OK: 'OK', // 200 - 요청 성공
  CREATED: 'CREATED', // 201 - 리소스 생성 성공
  ACCEPTED: 'ACCEPTED', // 202 - 요청 수락됨 (비동기 처리)
  NO_CONTENT: 'NO_CONTENT', // 204 - 성공했으나 반환할 내용 없음

  // 4xx Client Error
  BAD_REQUEST: 'BAD_REQUEST', // 400 - 잘못된 요청
  UNAUTHORIZED: 'UNAUTHORIZED', // 401 - 인증 필요 (로그인이 필요함)
  FORBIDDEN: 'FORBIDDEN', // 403 - 권한 없음 (접근 권한이 없음)
  NOT_FOUND: 'NOT_FOUND', // 404 - 리소스를 찾을 수 없음
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED', // 405 - 허용되지 않은 HTTP 메서드
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT', // 408 - 요청 시간 초과
  CONFLICT: 'CONFLICT', // 409 - 리소스 충돌 (중복 등)
  GONE: 'GONE', // 410 - 리소스가 영구적으로 삭제됨
  PRECONDITION_FAILED: 'PRECONDITION_FAILED', // 412 - 선행 조건 실패
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE', // 413 - 요청 본문이 너무 큼
  UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE', // 415 - 지원하지 않는 Content-Type
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY', // 422 - 처리할 수 없는 엔티티
  VALIDATION_ERROR: 'VALIDATION_ERROR', // 422 - 입력값 검증 실패
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS', // 429 - 요청 횟수 제한 초과

  // 권한 관련
  NOT_OWNER: 'NOT_OWNER', // 소유자가 아님 (수정/삭제 권한이 없음)
  NOT_PUBLIC: 'NOT_PUBLIC', // 비공개 리소스임 (공유되지 않은 리소스)

  // 인증 관련
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS', // 잘못된 인증 정보 (이메일 또는 비밀번호가 올바르지 않음)
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS', // 이메일이 이미 존재함
  INVALID_TOKEN: 'INVALID_TOKEN', // 잘못된 토큰
  INVALID_PASSWORD: 'INVALID_PASSWORD', // 잘못된 비밀번호
  USER_NOT_FOUND: 'USER_NOT_FOUND', // 사용자를 찾을 수 없음
  TOKEN_EXPIRED: 'TOKEN_EXPIRED', // 토큰이 만료됨
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED', // 계정이 잠금됨

  // 리소스 관련 (도메인)
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND', // 프로젝트를 찾을 수 없음
  ABILITY_NOT_FOUND: 'ABILITY_NOT_FOUND', // 어빌리티를 찾을 수 없음
  PROJECT_ABILITY_NOT_FOUND: 'PROJECT_ABILITY_NOT_FOUND', // 프로젝트 종속 어빌리티를 찾을 수 없음
  TRAIT_NOT_FOUND: 'TRAIT_NOT_FOUND', // 특성을 찾을 수 없음
  PROJECT_TRAIT_NOT_FOUND: 'PROJECT_TRAIT_NOT_FOUND', // 프로젝트 종속 특성을 찾을 수 없음
  CORE_RULE_NOT_FOUND: 'CORE_RULE_NOT_FOUND', // 코어 설정을 찾을 수 없음
  CREATURE_NOT_FOUND: 'CREATURE_NOT_FOUND', // 생물/종족을 찾을 수 없음
  CHARACTER_NOT_FOUND: 'CHARACTER_NOT_FOUND', // 인물을 찾을 수 없음
  ITEM_NOT_FOUND: 'ITEM_NOT_FOUND', // 아이템을 찾을 수 없음
  REGION_NOT_FOUND: 'REGION_NOT_FOUND', // 지역을 찾을 수 없음
  NATION_NOT_FOUND: 'NATION_NOT_FOUND', // 국가를 찾을 수 없음
  ORGANIZATION_NOT_FOUND: 'ORGANIZATION_NOT_FOUND', // 조직을 찾을 수 없음
  EVENT_NOT_FOUND: 'EVENT_NOT_FOUND', // 사건을 찾을 수 없음
  LORE_NOT_FOUND: 'LORE_NOT_FOUND', // 전승/설화를 찾을 수 없음
  CHAR_TRAIT_MAP_NOT_FOUND: 'CHAR_TRAIT_MAP_NOT_FOUND', // 인물-특성 매핑을 찾을 수 없음
  CHAR_ABILITY_MAP_NOT_FOUND: 'CHAR_ABILITY_MAP_NOT_FOUND', // 인물-어빌리티 매핑을 찾을 수 없음
  CREATURE_TRAIT_MAP_NOT_FOUND: 'CREATURE_TRAIT_MAP_NOT_FOUND', // 종족-특성 매핑을 찾을 수 없음
  CREATURE_ABILITY_MAP_NOT_FOUND: 'CREATURE_ABILITY_MAP_NOT_FOUND', // 종족-어빌리티 매핑을 찾을 수 없음

  // 5xx Server Error
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR', // 500 - 내부 서버 오류
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED', // 501 - 구현되지 않음
  BAD_GATEWAY: 'BAD_GATEWAY', // 502 - 게이트웨이 오류
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE', // 503 - 서비스 사용 불가
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT', // 504 - 게이트웨이 시간 초과

  // 기타
  ERROR: 'ERROR', // 일반적인 에러 (구체적인 에러 코드를 사용할 수 없을 때)
} as const;
