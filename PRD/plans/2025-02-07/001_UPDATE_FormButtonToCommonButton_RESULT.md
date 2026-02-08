# RESULT: FormButton → CommonButton 통합 및 일반 버튼 일원화

> **Date:** 2025-02-07
> **Task ID:** 001_UPDATE_FormButtonToCommonButton
> **Status:** ✅ SUCCESS
> **Language:** Korean

## 1. Execution Summary

- FormButton 컴포넌트를 **CommonButton**으로 파일명·컴포넌트명 변경하고, 기존 `btn-primary`/`btn-secondary` 사용 버튼을 모두 CommonButton 사용으로 통일하였다.
- 일반 버튼과 폼 버튼 구별 없이 단일 **CommonButton** 컴포넌트로 일원화 완료.

## 2. Modified Files

- **[Added]** `src/renderer/components/form/CommonButton.vue` — 공통 버튼 컴포넌트 (기존 FormButton 로직·스타일 유지, JSDoc만 "공통 버튼"으로 수정)
- **[Deleted]** `src/renderer/components/form/FormButton.vue`
- **[Modified]** `src/renderer/views/project-detail/core-rules/CoreRuleFormSection.vue` — FormButton → CommonButton (4곳)
- **[Modified]** `src/renderer/views/project-detail/OverviewSection.vue` — FormButton → CommonButton (2곳)
- **[Modified]** `src/renderer/views/CreateProjectView.vue` — FormButton → CommonButton (2곳)
- **[Modified]** `src/renderer/views/project-detail/core-rules/CoreRulesSection.vue` — btn-primary "추가" 버튼 → CommonButton
- **[Modified]** `src/renderer/views/project-detail/TraitsAbilitiesSection.vue` — btn-primary "특성/능력 추가" → CommonButton
- **[Modified]** `src/renderer/App.vue` — btn-primary "다시 시도" → CommonButton
- **[Modified]** `src/renderer/views/ProjectListView.vue` — RouterLink+btn-primary "관리" → RouterLink custom + CommonButton
- **[Modified]** `src/renderer/views/MainView.vue` — RouterLink+btn-secondary/btn-primary "프로젝트 관리"/"프로젝트 생성" → RouterLink custom + CommonButton (2곳)
- **[Modified]** `src/renderer/components.d.ts` — FormButton 선언 제거 (CommonButton만 유지)

## 3. Key Changes

- **컴포넌트 통일:** 모든 주요 액션 버튼이 CommonButton을 사용. variant="primary" | "secondary", label, #icon 슬롯, type, disabled, loading 등 기존과 동일하게 사용.
- **RouterLink 연동:** "관리", "프로젝트 관리", "프로젝트 생성"은 `RouterLink`의 `custom` + `v-slot="{ navigate }"` 내부에서 CommonButton을 두고 `@click="navigate"` 로 라우팅 처리.
- **스타일:** `tailwind.css`의 `.btn-primary`, `.btn-secondary` 정의는 유지(다른 참조 가능성 대비). 뷰에서는 더 이상 사용하지 않음.

## 4. Verification Results

- `FormButton` / `form/FormButton` 검색: src 내 0건 (components.d.ts에서 FormButton 선언 제거 완료).
- `btn-primary` / `btn-secondary`: 뷰 파일에서는 0건. `src/renderer/assets/styles/tailwind.css` 정의부만 존재.
- 수정한 뷰·컴포넌트 대상 린트 에러 없음.
- 빌드·실행 시 `unplugin-vue-components`가 `components.d.ts`를 재생성할 수 있으나, FormButton.vue가 삭제된 상태이므로 재생성 후에도 CommonButton만 등록됨.
