PRD와 Coding Rules에 지정된 파일들을 점검해줘.

**참조 문서 (반드시 먼저 읽어라):**
- `PRD/PRD.md` — 프로젝트 개요, 테크 스택, 아키텍처, UI·데이터·API 원칙. 코드 규칙은 Coding Rules를 따른다고 명시.
- `PRD/Coding Rules & Guidelines.md` — 명명 규칙, 폴더 구조, 코딩 표준, Fantasy Builder 특화 규칙.

**절차:**
1. 위 두 문서를 읽고, 문서에 **명시된 경로·파일** 목록을 정리해라.
2. 해당 경로·파일들을 **Coding Rules & Guidelines.md** 기준으로 점검해라.
   - 명명(파일명·변수·상수·타입), 폴더 구조, 스타일(구문별 공백·JSDoc·객체·인자 줄바꿈·이벤트 핸들러 명명), Vue(CVA·섹션 순서·경계 주석), 타입(any 금지), 디자인(시맨틱 토큰·radius·Custom Only).
3. 결과를 **위반 파일 / 위반 내용 / 수정 제안**으로 구분해 보고해라.
