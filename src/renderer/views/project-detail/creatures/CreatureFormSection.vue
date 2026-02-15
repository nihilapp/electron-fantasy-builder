<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { cva, type VariantProps } from 'class-variance-authority';

import type { CreatureVo } from '@app-types/vo.types';
import CategoryListSidebar from '~/components/common/CategoryListSidebar.vue';
import IconButton from '~/components/form/IconButton.vue';
import LoreDetailLayout from '~/components/layouts/LoreDetailLayout.vue';
import LoreListLayout from '~/components/layouts/LoreListLayout.vue';
import { useGetCreatureList } from '~/composables/query/creature/useGetCreatureList';
import { useCreatureForm } from '~/composables/useCreatureForm';
import type { CreatureFormState } from '~/composables/useCreatureForm';
import { cn } from '~/utils/cn';
import CreatureFormBody from '~/views/project-detail/creatures/CreatureFormBody.vue';

/** 종족/생물 등록/상세 통합. 등록(creatures/new) vs 수정(creatures/:creatureNo). */

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

const isCreateMode = computed(() => {
  const c = route.params.creatureNo;
  return c == null || c === '' || c === 'new';
});

const creatureNoNum = computed(() => {
  if (isCreateMode.value) return null;
  const raw = route.params.creatureNo;
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
} = useCreatureForm({
  prjNo,
  route,
  router,
  isCreateMode,
  creatureNoNum,
  queryClient,
});

const {
  data: sidebarListResponse,
  isPending: sidebarListLoading,
  error: sidebarListError,
} = useGetCreatureList({
  prjNo,
  enabled: computed(() => prjNo.value != null),
});

const sidebarList = computed(() => sidebarListResponse.value?.data?.list ?? []);
const sidebarItems = computed(() => {
  const no = prjNo.value;
  const head = no != null
    ? [ { id: 'new' as number | string, label: '새로 추가', }, ]
    : [];
  const rest = sidebarList.value.map((row: CreatureVo) => ({
    id: row.creatureNo ?? 0,
    label: row.creatureNm ?? '—',
  }));
  return [ ...head, ...rest, ];
});

const sidebarSelectedId = computed(() => {
  return isCreateMode.value
    ? 'new'
    : creatureNoNum.value;
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
    : { name: 'project-creatures', params: { prjNo: String(no), }, };
});

function getToCreatureDetail(listItem: { id: number | string; label: string }) {
  const no = prjNo.value;
  if (no == null) return { name: 'project-creatures', params: { prjNo: '', }, };
  if (listItem.id === 'new') {
    return { name: 'project-creature-new', params: { prjNo: String(no), }, };
  }
  return {
    name: 'project-creature-detail',
    params: { prjNo: String(no), creatureNo: String(listItem.id), },
  };
}

function onFormFieldUpdate(payload: { key: keyof CreatureFormState; value: string }) {
  form.value[payload.key] = payload.value;
}

watch(
  [ prjNo, creatureNoNum, isCreateMode, ],
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
          title="종족/생물"
          :items="sidebarItems"
          :selected-id="sidebarSelectedId"
          :get-to="getToCreatureDetail"
          :loading="sidebarListLoading"
          :error-message="sidebarListErrorMessage"
          :route-to-list="routeToList"
        />
      </template>
      <LoreDetailLayout>
        <CreatureFormBody
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
