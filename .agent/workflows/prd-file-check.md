# 워크플로우: PRD 지정 파일 점검

PRD·Coding Rules에 지정된 파일들을 두 문서를 참조해 점검하는 워크플로우.

---

## 입력

- 참조 문서: `PRD/PRD.md`, `PRD/Coding Rules & Guidelines.md`

## 출력

- 위반 파일 목록
- 위반 내용(규칙 항목별)
- 수정 제안(구체적 변경안)

---

## 단계

### 1. 참조 문서 읽기

- `PRD/PRD.md` 읽기. (프로젝트 개요, 테크 스택, 아키텍처, UI·데이터·API, 코드 규칙 참조 위치 파악.)
- `PRD/Coding Rules & Guidelines.md` 읽기. (명명, 폴더 구조, 코딩 표준, Vue·디자인·Fantasy Builder 특화 규칙 파악.)

### 2. 지정 파일·경로 추출

두 문서에 언급된 경로·파일을 나열한다. 예:

- `src/types/` (*.types.ts), `src/constants/` (*.const.ts), `src/config/app.json`
- `src/main/server/schema/local/`, `remote/` (*.table.ts, common.columns.ts)
- `src/main/` (IPC, API, Controller, Service, Mapper 명명)
- `src/renderer/` (Vue PascalCase, template.vue, SettingItemCard, assets/styles)
- `src/drizzle/local/`, `src/drizzle/remote/`

실제 목록은 **현재 문서 본문** 기준으로 추출.

### 3. 점검 실행 (Coding Rules 기준)

각 대상에 대해 다음 항목을 검사:

- **명명**: 파일명·변수·상수·타입 규칙 준수 여부
- **폴더 구조**: 문서 Tree View와의 일치 여부
- **스타일**: 구문별 한 줄 공백, 변수·매개변수 축약 금지, JSDoc, 객체·인자 줄바꿈, 화살표 함수 반환 괄호, 이벤트 핸들러 `on<Action><Target>`
- **Vue**: CVA 사용, script setup 섹션 순서(BASE → STOREDATA → STATES → ACTIONS → WATCH → LIFECYCLE), 경계 주석, template.vue와의 일치
- **타입**: `any` 미사용, 공용 타입은 `src/types/` 단일 정의
- **디자인**: 시맨틱 토큰, radius 숫자·rounded-full 예외, Custom Only(assets/styles)

### 4. 결과 정리

- **위반 파일**: 경로·파일명 나열
- **위반 내용**: 위 항목별로 어떤 규칙을 어겼는지 기술
- **수정 제안**: 규칙에 맞게 어떻게 고칠지 구체적으로 제안

---

*이 워크플로우를 실행할 때는 위 단계를 순서대로 수행하고, 출력 형식에 맞춰 결과를 보고한다.*
