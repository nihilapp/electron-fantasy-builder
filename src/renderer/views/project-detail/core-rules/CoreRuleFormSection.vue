<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { cva, type VariantProps } from 'class-variance-authority';

import type { CoreRuleListItemVo } from '@app-types/vo.types';
import CategoryListSidebar from '~/components/common/CategoryListSidebar.vue';
import DetailField from '~/components/common/DetailField.vue';
import SettingSidebar from '~/components/common/SettingSidebar.vue';
import TagField from '~/components/common/TagField.vue';
import FormTextarea from '~/components/form/FormTextarea.vue';
import IconButton from '~/components/form/IconButton.vue';
import LoreDetailLayout from '~/components/layouts/LoreDetailLayout.vue';
import LoreListLayout from '~/components/layouts/LoreListLayout.vue';
import { useGetCoreRuleList } from '~/composables/query/coreRule/useGetCoreRuleList';
import { useCoreRuleForm } from '~/composables/useCoreRuleForm';
import type { CoreRuleFormState } from '~/composables/useCoreRuleForm';
import { cn } from '~/utils/cn';
import CoreRuleFormBody from '~/views/project-detail/core-rules/CoreRuleFormBody.vue';

/** 주요 설정 등록/상세 통합. 등록(core-rules/new) vs 수정(core-rules/:coreNo) — 플래그로 구분. */

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (inject prjNo, useRouter, useRoute)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [ 'flex h-full min-h-0 flex-1 flex-col overflow-hidden', ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const router = useRouter();
const route = useRoute();
const prjNo = inject<Ref<number | null>>('prjNo')!;
const queryClient = useQueryClient();

/** 등록 페이지이면 true, 상세/수정 페이지이면 false */
const isCreateMode = computed(() => {
  const c = route.params.coreNo;
  return c == null || c === '' || c === 'new';
});

/** 라우트 coreNo 파라미터를 숫자로 파싱 (상세일 때만 유효) */
const coreNoNum = computed(() => {
  if (isCreateMode.value) return null;
  const raw = route.params.coreNo;
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isInteger(n)
    ? n
    : null;
});

const {
  item,
  loadError,
  isViewMode,
  form,
  isSubmitting,
  errorMessage,
  canSubmit,
  loadItem,
  enterEditMode,
  exitEditMode,
  submit,
  goToList,
  onTagClick,
} = useCoreRuleForm({
  prjNo,
  route,
  router,
  isCreateMode,
  coreNoNum,
  queryClient,
});

/** 좌측 사이드바용 목록. 등록/상세 공통. useGetCoreRuleList로 캐시 공유 (CoreRulesSection과 동일 키). */
const {
  data: sidebarListResponse,
  isPending: sidebarListLoading,
  error: sidebarListError,
} = useGetCoreRuleList({
  prjNo,
  enabled: computed(() => prjNo.value != null),
});

const sidebarList = computed(() => sidebarListResponse.value?.data?.list ?? []);
/** 사이드바 항목: "새로 추가" + 기존 목록. 등록/상세 하나의 폼·레이아웃에서 사용. */
const sidebarItems = computed(() => {
  const no = prjNo.value;
  const head = no != null
    ? [ { id: 'new' as number | string, label: '새로 추가', }, ]
    : [];
  const rest = sidebarList.value.map((row: CoreRuleListItemVo) => ({
    id: row.coreNo ?? row.rowNo ?? 0,
    label: row.coreNm ?? '—',
  }));
  return [ ...head, ...rest, ];
});

/** 사이드바 선택 id: 등록이면 'new', 상세면 coreNo. */
const sidebarSelectedId = computed(() => {
  return isCreateMode.value
    ? 'new'
    : coreNoNum.value;
});

const sidebarListErrorMessage = computed(() => {
  const err = sidebarListError.value;
  return err instanceof Error
    ? err.message
    : null;
});

const routeToList = computed(() => {
  const no = prjNo.value;
  return no == null
    ? null
    : { name: 'project-core-rules', params: { prjNo: String(no), }, };
});

/** 사이드바 항목 클릭 시 이동 라우트. "새로 추가" → 등록, 그 외 → 상세. */
function getToCoreRuleDetail(listItem: { id: number | string; label: string }) {
  const no = prjNo.value;
  if (no == null) {
    return { name: 'project-core-rules', params: { prjNo: '', }, };
  }
  if (listItem.id === 'new') {
    return { name: 'project-core-rule-new', params: { prjNo: String(no), }, };
  }
  return {
    name: 'project-core-rule-detail',
    params: { prjNo: String(no), coreNo: String(listItem.id), },
  };
}

function onFormFieldUpdate(payload: { key: keyof CoreRuleFormState; value: string }) {
  form.value[payload.key] = payload.value;
}

watch(
  [ prjNo, coreNoNum, isCreateMode, ],
  () => {
    if (!isCreateMode.value) loadItem();
  },
  { immediate: true, }
);
</script>

<template>
  <div :class="cn(cssVariants({}), props.class)">
    <!-- 상세 전용: 로드 에러 시 -->
    <template v-if="!isCreateMode && loadError">
      <p class="text-sm text-destructive">
        {{ loadError }}
      </p>
      <IconButton
        class="mt-2"
        icon-name="lucide:arrow-left"
        a11y-label="목록으로"
        @click="goToList"
      />
    </template>

    <!-- 상세 전용: 로딩 중 -->
    <template v-else-if="!isCreateMode && !item">
      <p class="type-muted">
        로딩 중…
      </p>
    </template>

    <!-- 등록·상세 공통: 하나의 레이아웃 + 하나의 폼 (사이드바 | 본문 | 메타) -->
    <LoreListLayout v-else>
      <template #sidebar>
        <CategoryListSidebar
          title="주요 설정"
          :items="sidebarItems"
          :selected-id="sidebarSelectedId"
          :get-to="getToCoreRuleDetail"
          :loading="sidebarListLoading"
          :error-message="sidebarListErrorMessage"
          :route-to-list="routeToList"
        />
      </template>
      <LoreDetailLayout>
        <CoreRuleFormBody
          :is-create-mode="isCreateMode"
          :item="isCreateMode ? null : item"
          :form="form"
          :is-view-mode="isCreateMode ? false : isViewMode"
          :error-message="errorMessage"
          :can-submit="canSubmit"
          :is-submitting="isSubmitting"
          @submit="submit"
          @go-to-list="goToList"
          @enter-edit-mode="enterEditMode"
          @exit-edit-mode="exitEditMode"
          @update:form="onFormFieldUpdate"
        />
        <template #meta>
          <SettingSidebar :meta="isCreateMode ? null : item">
            <template #tags>
              <template v-if="!isCreateMode && isViewMode">
                <TagField
                  :tags="item?.tags ?? ''"
                  label="태그"
                  @tag-click="onTagClick"
                />
              </template>
              <template v-else>
                <FormTextarea
                  id="core-rule-form-tags"
                  v-model="form.tags"
                  label="태그"
                  placeholder="쉼표 구분 등"
                  :rows="4"
                  min-height-class="min-h-24"
                />
              </template>
            </template>
            <template #linkDocs>
              <template v-if="!isCreateMode && isViewMode">
                <DetailField label="연관 설정" :content="item?.linkDocs ?? null" />
              </template>
              <template v-else>
                <FormTextarea
                  id="core-rule-form-linkDocs"
                  v-model="form.linkDocs"
                  label="연관 설정"
                  placeholder="참조 문서 URL 또는 경로"
                  :rows="2"
                  min-height-class="min-h-16"
                />
              </template>
            </template>
          </SettingSidebar>
        </template>
      </LoreDetailLayout>
    </LoreListLayout>
  </div>
</template>
