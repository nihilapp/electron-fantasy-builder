# PLAN: FormButton → CommonButton 통합 및 일반 버튼 일원화

> **Date:** 2025-02-07
> **Task ID:** 001_UPDATE_FormButtonToCommonButton
> **Language:** Korean (Required)

## 1. Objective

- 폼 전용/일반 버튼 구별을 없애고, **단일 공통 버튼 컴포넌트**로 통일한다.
- 기존 `FormButton` 컴포넌트를 **CommonButton**으로 이름 변경하고, `btn-primary` / `btn-secondary` 를 쓰는 모든 버튼을 CommonButton 사용으로 교체한다.

## 2. Context Analysis

- **Target Files:**
  - `src/renderer/components/form/FormButton.vue` → 파일명·컴포넌트명을 CommonButton으로 변경
  - FormButton을 사용하는 뷰: `CoreRuleFormSection.vue`, `OverviewSection.vue`, `CreateProjectView.vue`
  - `btn-primary` / `btn-secondary` 를 사용하는 뷰: `CoreRulesSection.vue`, `TraitsAbilitiesSection.vue`, `App.vue`, `ProjectListView.vue`, `MainView.vue`
- **Current Issue:**
  - “폼 버튼(FormButton)”과 “일반 버튼(btn-primary 등)”이 혼재하여 스타일·크기·간격이 일관되지 않음.
  - 하나의 컴포넌트로 통일하면 유지보수와 디자인 일관성이 좋아짐.

## 3. Strategy

1. **컴포넌트 리네이밍**
   - `FormButton.vue` → `CommonButton.vue` 로 파일 이름 변경.
   - script 내 JSDoc·주석에서 “폼 버튼” → “공통 버튼”으로 표현만 수정 (동작·props 유지).
   - `unplugin-vue-components` 에 의해 `CommonButton.vue` 가 자동으로 `CommonButton` 으로 등록되므로, 기존 `FormButton` 사용처를 모두 `CommonButton` 으로 치환.

2. **기존 FormButton 사용처**
   - `CoreRuleFormSection.vue`, `OverviewSection.vue`, `CreateProjectView.vue` 에서 `<FormButton` → `<CommonButton`, `</FormButton>` → `</CommonButton>` 으로 일괄 치환. props·slot(#icon) 구조는 그대로 유지.

3. **btn-primary / btn-secondary 사용처를 CommonButton으로 교체**
   - **CoreRulesSection.vue**: “추가” 버튼 → `<CommonButton variant="primary" label="추가" @click="goToAdd">` + `#icon` 에 `<VueIcon icon-name="lucide:plus" />`.
   - **TraitsAbilitiesSection.vue**: “특성 추가”/“능력 추가” → `<CommonButton variant="primary" :label="activeTab === 'traits' ? '특성 추가' : '능력 추가'" @click="onCreateClick">` + `#icon` 에 plus 아이콘.
   - **App.vue**: “다시 시도” 버튼 → `<CommonButton type="button" variant="primary" label="다시 시도" @click="retryLoad" />`.
   - **ProjectListView.vue**: “관리” 링크는 `RouterLink` + `custom v-slot="{ navigate }"` 로 감싼 뒤, 내부에 `<CommonButton>` + `@click="navigate"` 사용. 아이콘은 기존처럼 `#icon` slot.
   - **MainView.vue**: “프로젝트 관리” / “프로젝트 생성” 두 개의 `RouterLink` 내부 버튼을 동일하게 `RouterLink` custom + `CommonButton` + `@click="navigate"` 패턴으로 교체. variant는 기존대로 secondary / primary, label와 #icon 유지.

4. **스타일 정리**
   - `tailwind.css` 의 `.btn-primary` (및 `.btn-secondary` 존재 시) 는 **당 작업 범위에서는 제거하지 않음**. 다른 레거시 참조가 있을 수 있으므로, CommonButton으로 교체된 뒤 별도 이슈/정리에서 제거하는 것을 권장. (또는 사용처가 전부 제거되었으면 주석 처리 또는 제거.)

5. **문서**
   - PRD `Coding Rules & Guidelines.md` 에 FormButton/폼 버튼 언급이 없으므로 수정 없음. (있을 경우 CommonButton/공통 버튼으로 수정.)

## 4. Impact Analysis

- **Affected Files:**
  - [Renamed] `src/renderer/components/form/FormButton.vue` → `CommonButton.vue`
  - [Modified] `CoreRuleFormSection.vue` (FormButton → CommonButton 4곳)
  - [Modified] `OverviewSection.vue` (FormButton → CommonButton 2곳)
  - [Modified] `CreateProjectView.vue` (FormButton → CommonButton 2곳)
  - [Modified] `CoreRulesSection.vue` (btn-primary 1곳 → CommonButton)
  - [Modified] `TraitsAbilitiesSection.vue` (btn-primary 1곳 → CommonButton)
  - [Modified] `App.vue` (btn-primary 1곳 → CommonButton)
  - [Modified] `ProjectListView.vue` (RouterLink+btn-primary 1곳 → RouterLink+CommonButton)
  - [Modified] `MainView.vue` (RouterLink+btn-secondary 1곳, RouterLink+btn-primary 1곳 → RouterLink+CommonButton)
- **Side Effects:**
  - `components.d.ts` 는 unplugin-vue-components 가 재생성하므로, FormButton 제거·CommonButton 추가는 빌드 시 자동 반영.
  - 라우트/API 변경 없음. 순수 UI 컴포넌트·마크업 교체.

## 5. Task List

- [ ] 1. `FormButton.vue` 를 `CommonButton.vue` 로 복사(이동) 후, 파일 내부 JSDoc 등 “폼 버튼” → “공통 버튼”으로 문구 수정.
- [ ] 2. 기존 `FormButton.vue` 파일 삭제.
- [ ] 3. `CoreRuleFormSection.vue` 에서 FormButton → CommonButton 치환 (4곳).
- [ ] 4. `OverviewSection.vue` 에서 FormButton → CommonButton 치환 (2곳).
- [ ] 5. `CreateProjectView.vue` 에서 FormButton → CommonButton 치환 (2곳).
- [ ] 6. `CoreRulesSection.vue` 에서 btn-primary “추가” 버튼을 CommonButton으로 교체.
- [ ] 7. `TraitsAbilitiesSection.vue` 에서 btn-primary “특성/능력 추가” 버튼을 CommonButton으로 교체.
- [ ] 8. `App.vue` 에서 “다시 시도” btn-primary 버튼을 CommonButton으로 교체.
- [ ] 9. `ProjectListView.vue` 에서 RouterLink+btn-primary “관리” 버튼을 RouterLink + CommonButton으로 교체.
- [ ] 10. `MainView.vue` 에서 두 개의 RouterLink+button 을 RouterLink + CommonButton으로 교체.
- [ ] 11. 전체 검색으로 `FormButton` / `form/FormButton` 잔여 참조 제거 여부 확인 및 린트/빌드 확인.

## 6. Verification Plan

- 프로젝트에서 `FormButton` 검색 시 0건 (CommonButton만 존재).
- `btn-primary` / `btn-secondary` 검색 시 tailwind.css 정의부만 남고, 뷰에서는 CommonButton 사용만 남는지 확인.
- 앱 실행 후 주요 설정·특성/능력·프로젝트 생성·Overview·에러 재시도·프로젝트 목록·메인 화면에서 버튼 동작(클릭·라우팅·로딩 상태)이 기존과 동일한지 확인.
