<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { cva, type VariantProps } from 'class-variance-authority';

import type { RegionVo } from '@app-types/vo.types';
import CategoryListSidebar from '~/components/common/CategoryListSidebar.vue';
import IconButton from '~/components/form/IconButton.vue';
import LoreDetailLayout from '~/components/layouts/LoreDetailLayout.vue';
import LoreListLayout from '~/components/layouts/LoreListLayout.vue';
import { useGetRegionList } from '~/composables/query/region/useGetRegionList';
import { useRegionForm } from '~/composables/useRegionForm';
import type { RegionFormState } from '~/composables/useRegionForm';
import { cn } from '~/utils/cn';
import RegionFormBody from '~/views/project-detail/regions/RegionFormBody.vue';

/** 지역 등록/상세 통합. */

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보
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

const isCreateMode = computed(() => {
  const c = route.params.regionNo;
  return c == null || c === '' || c === 'new';
});

const regionNoNum = computed(() => {
  if (isCreateMode.value) return null;
  const raw = route.params.regionNo;
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
} = useRegionForm({
  prjNo,
  route,
  router,
  isCreateMode,
  regionNoNum,
  queryClient,
});

const {
  data: sidebarListResponse,
  isPending: sidebarListLoading,
  error: sidebarListError,
} = useGetRegionList({
  prjNo,
  enabled: computed(() => prjNo.value != null),
});

const sidebarList = computed(() => sidebarListResponse.value?.data?.list ?? []);
const sidebarItems = computed(() => {
  const no = prjNo.value;
  const head = no != null
    ? [ { id: 'new' as number | string, label: '새로 추가', }, ]
    : [];
  const rest = sidebarList.value.map((row: RegionVo) => ({
    id: row.regionNo ?? 0,
    label: row.regionNm ?? '—',
  }));
  return [ ...head, ...rest, ];
});

const sidebarSelectedId = computed(() => {
  return isCreateMode.value
    ? 'new'
    : regionNoNum.value;
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
    : { name: 'project-regions', params: { prjNo: String(no), }, };
});

function getToRegionDetail(listItem: { id: number | string; label: string }) {
  const no = prjNo.value;
  if (no == null) return { name: 'project-regions', params: { prjNo: '', }, };
  if (listItem.id === 'new') {
    return { name: 'project-region-new', params: { prjNo: String(no), }, };
  }
  return {
    name: 'project-region-detail',
    params: { prjNo: String(no), regionNo: String(listItem.id), },
  };
}

function onFormFieldUpdate(payload: { key: keyof RegionFormState; value: string }) {
  form.value[payload.key] = payload.value;
}

watch(
  [ prjNo, regionNoNum, isCreateMode, ],
  () => {
    if (!isCreateMode.value) loadItem();
  },
  { immediate: true, }
);
</script>

<template>
  <div :class="cn(cssVariants({}), props.class)">
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

    <template v-else-if="!isCreateMode && !item">
      <p class="type-muted">
        로딩 중…
      </p>
    </template>

    <LoreListLayout v-else>
      <template #sidebar>
        <CategoryListSidebar
          title="지역"
          :items="sidebarItems"
          :selected-id="sidebarSelectedId"
          :get-to="getToRegionDetail"
          :loading="sidebarListLoading"
          :error-message="sidebarListErrorMessage"
          :route-to-list="routeToList"
        />
      </template>
      <LoreDetailLayout>
        <RegionFormBody
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
      </LoreDetailLayout>
    </LoreListLayout>
  </div>
</template>
