/**
 * API 응답용 상태 코드 문자열.
 * HTTP 상태 코드와 대응하며, 표준 응답 래퍼의 code 필드 등에 사용.
 */
export const RESPONSE_CODE = {
  // 2xx Success
  /** @description 요청 성공 (200) */
  OK: 'OK',
  /** @description 리소스 생성 성공 (201) */
  CREATED: 'CREATED',
  /** @description 요청 수락됨, 비동기 처리 (202) */
  ACCEPTED: 'ACCEPTED',
  /** @description 성공했으나 반환할 내용 없음 (204) */
  NO_CONTENT: 'NO_CONTENT',

  // 4xx Client Error
  /** @description 잘못된 요청 (400) */
  BAD_REQUEST: 'BAD_REQUEST',
  /** @description 인증 필요, 로그인이 필요함 (401) */
  UNAUTHORIZED: 'UNAUTHORIZED',
  /** @description 권한 없음, 접근 권한이 없음 (403) */
  FORBIDDEN: 'FORBIDDEN',
  /** @description 리소스를 찾을 수 없음 (404) */
  NOT_FOUND: 'NOT_FOUND',
  /** @description 허용되지 않은 HTTP 메서드 (405) */
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  /** @description 요청 시간 초과 (408) */
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  /** @description 리소스 충돌, 중복 등 (409) */
  CONFLICT: 'CONFLICT',
  /** @description 리소스가 영구적으로 삭제됨 (410) */
  GONE: 'GONE',
  /** @description 선행 조건 실패 (412) */
  PRECONDITION_FAILED: 'PRECONDITION_FAILED',
  /** @description 요청 본문이 너무 큼 (413) */
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  /** @description 지원하지 않는 Content-Type (415) */
  UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE',
  /** @description 처리할 수 없는 엔티티 (422) */
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
  /** @description 입력값 검증 실패 (422) */
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  /** @description 요청 횟수 제한 초과 (429) */
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

  // 권한 관련
  /** @description 소유자가 아님, 수정/삭제 권한이 없음 */
  NOT_OWNER: 'NOT_OWNER',
  /** @description 비공개 리소스, 공유되지 않은 리소스 */
  NOT_PUBLIC: 'NOT_PUBLIC',

  // 인증 관련
  /** @description 잘못된 인증 정보, 이메일 또는 비밀번호가 올바르지 않음 */
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  /** @description 이메일이 이미 존재함 */
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  /** @description 잘못된 토큰 */
  INVALID_TOKEN: 'INVALID_TOKEN',
  /** @description 잘못된 비밀번호 */
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  /** @description 사용자를 찾을 수 없음 */
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  /** @description 토큰이 만료됨 */
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  /** @description 계정이 잠금됨 */
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',

  // 리소스 관련 (도메인)
  /** @description 프로젝트를 찾을 수 없음 */
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  /** @description 어빌리티를 찾을 수 없음 */
  ABILITY_NOT_FOUND: 'ABILITY_NOT_FOUND',
  /** @description 프로젝트 종속 어빌리티를 찾을 수 없음 */
  PROJECT_ABILITY_NOT_FOUND: 'PROJECT_ABILITY_NOT_FOUND',
  /** @description 특성을 찾을 수 없음 */
  TRAIT_NOT_FOUND: 'TRAIT_NOT_FOUND',
  /** @description 프로젝트 종속 특성을 찾을 수 없음 */
  PROJECT_TRAIT_NOT_FOUND: 'PROJECT_TRAIT_NOT_FOUND',
  /** @description 코어 설정을 찾을 수 없음 */
  CORE_RULE_NOT_FOUND: 'CORE_RULE_NOT_FOUND',
  /** @description 생물/종족을 찾을 수 없음 */
  CREATURE_NOT_FOUND: 'CREATURE_NOT_FOUND',
  /** @description 인물을 찾을 수 없음 */
  CHARACTER_NOT_FOUND: 'CHARACTER_NOT_FOUND',
  /** @description 아이템을 찾을 수 없음 */
  ITEM_NOT_FOUND: 'ITEM_NOT_FOUND',
  /** @description 지역을 찾을 수 없음 */
  REGION_NOT_FOUND: 'REGION_NOT_FOUND',
  /** @description 국가를 찾을 수 없음 */
  NATION_NOT_FOUND: 'NATION_NOT_FOUND',
  /** @description 조직을 찾을 수 없음 */
  ORGANIZATION_NOT_FOUND: 'ORGANIZATION_NOT_FOUND',
  /** @description 사건을 찾을 수 없음 */
  EVENT_NOT_FOUND: 'EVENT_NOT_FOUND',
  /** @description 전승/설화를 찾을 수 없음 */
  LORE_NOT_FOUND: 'LORE_NOT_FOUND',
  /** @description 인물-특성 매핑을 찾을 수 없음 */
  CHAR_TRAIT_MAP_NOT_FOUND: 'CHAR_TRAIT_MAP_NOT_FOUND',
  /** @description 인물-어빌리티 매핑을 찾을 수 없음 */
  CHAR_ABILITY_MAP_NOT_FOUND: 'CHAR_ABILITY_MAP_NOT_FOUND',
  /** @description 종족-특성 매핑을 찾을 수 없음 */
  CREATURE_TRAIT_MAP_NOT_FOUND: 'CREATURE_TRAIT_MAP_NOT_FOUND',
  /** @description 종족-어빌리티 매핑을 찾을 수 없음 */
  CREATURE_ABILITY_MAP_NOT_FOUND: 'CREATURE_ABILITY_MAP_NOT_FOUND',

  // 5xx Server Error
  /** @description 내부 서버 오류 (500) */
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  /** @description 구현되지 않음 (501) */
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  /** @description 게이트웨이 오류 (502) */
  BAD_GATEWAY: 'BAD_GATEWAY',
  /** @description 서비스 사용 불가 (503) */
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  /** @description 게이트웨이 시간 초과 (504) */
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',

  // 기타
  /** @description 일반적인 에러, 구체적인 에러 코드를 사용할 수 없을 때 */
  ERROR: 'ERROR',
} as const;
