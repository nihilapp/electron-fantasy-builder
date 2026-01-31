# TODO — Fantasy Builder (Electron + Vue + Hono)

**작성일**: 2026-01-31  
**상태**: 진행 중인 작업 및 향후 개선 사항

---

## 중요 (기능 완성)

### 1. 사용 현황 조회 기능
- **위치**: Trait/Ability Service (또는 전용 SearchService)
- **상태**: 매핑 테이블(char_trait_maps, char_ability_maps, creature_trait_maps, creature_ability_maps) 구현 후 사용 현황 조회 로직 완성
- **의존성**: Phase 6 (매핑 테이블 CRUD) 완료 후 작업

### 2. 이메일 인증
- [ ] 이메일 인증 토큰 생성
- [ ] 이메일 인증 처리 (users.eml_auth_yn)

### 3. JWT·인증 미들웨어
- [ ] Hono 미들웨어 또는 라우트 레벨에서 JWT 검증
- [ ] 현재 사용자 추출 (IPC 또는 API 컨텍스트)

---

## 개선 사항

### 4. 검증 강화
- [ ] Zod 스키마로 요청 body/query 검증
- [ ] 이메일 형식, 비밀번호 강도, 필수 필드 검증

### 5. 에러 코드 통일
- [ ] NOT_FOUND, VALIDATION_ERROR, ACCOUNT_LOCKED 등 코드 상수화
- [ ] 표준 에러 응답 포맷 (code, message) 유지

### 6. 로깅
- [ ] 주요 비즈니스 로직(생성/수정/삭제, 로그인) 로깅
- [ ] 프로덕션용 로그 레벨·정책

---

## Phase별 미완료

- **Phase 2**: 공통 ApiResponse, ListType, GlobalExceptionHandler, types 확장
- **Phase 3**: User/Auth Mapper·Service·Controller, JWT·bcrypt
- **Phase 4**: Trait, Ability, Project, ProjectTrait, ProjectAbility, 통합 검색
- **Phase 5~6**: 설정 엔티티 CRUD, 매핑 테이블 CRUD
- **Phase 7~8**: 권한, 테스트, 문서화

---

## 기술적

- [ ] 원격 DB 마이그레이션 적용 방식 확인 (drizzle/remote 적용 스크립트 또는 수동)
- [ ] 단위/통합 테스트 (Vitest 등) 도입 여부
- [ ] API 문서 (OpenAPI/Swagger) 도입 여부

---

*문서 끝*
