<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { cva, type VariantProps } from 'class-variance-authority';

import type { CharacterVo } from '@app-types/vo.types';
import CategoryListSidebar from '~/components/common/CategoryListSidebar.vue';
import IconButton from '~/components/form/IconButton.vue';
import LoreDetailLayout from '~/components/layouts/LoreDetailLayout.vue';
import LoreListLayout from '~/components/layouts/LoreListLayout.vue';
import { useGetCharacterList } from '~/composables/query/character/useGetCharacterList';
import { useCharacterForm } from '~/composables/useCharacterForm';
import type { CharacterFormState } from '~/composables/useCharacterForm';
import { cn } from '~/utils/cn';
import CharacterFormBody from '~/views/project-detail/characters/CharacterFormBody.vue';

/** 인물 등록/상세 통합. 등록(characters/new) vs 수정(characters/:charNo). */

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
  const c = route.params.charNo;
  return c == null || c === '' || c === 'new';
});

const charNoNum = computed(() => {
  if (isCreateMode.value) return null;
  const raw = route.params.charNo;
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
} = useCharacterForm({
  prjNo,
  route,
  router,
  isCreateMode,
  charNoNum,
  queryClient,
});

const {
  data: sidebarListResponse,
  isPending: sidebarListLoading,
  error: sidebarListError,
} = useGetCharacterList({
  prjNo,
  enabled: computed(() => prjNo.value != null),
});

const sidebarList = computed(() => sidebarListResponse.value?.data?.list ?? []);
const sidebarItems = computed(() => {
  const no = prjNo.value;
  const head = no != null
    ? [ { id: 'new' as number | string, label: '새로 추가', }, ]
    : [];
  const rest = sidebarList.value.map((row: CharacterVo) => ({
    id: row.charNo ?? 0,
    label: row.charNm ?? '—',
  }));
  return [ ...head, ...rest, ];
});

const sidebarSelectedId = computed(() => {
  return isCreateMode.value
    ? 'new'
    : charNoNum.value;
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
    : { name: 'project-characters', params: { prjNo: String(no), }, };
});

function getToCharacterDetail(listItem: { id: number | string; label: string }) {
  const no = prjNo.value;
  if (no == null) return { name: 'project-characters', params: { prjNo: '', }, };
  if (listItem.id === 'new') {
    return { name: 'project-character-new', params: { prjNo: String(no), }, };
  }
  return {
    name: 'project-character-detail',
    params: { prjNo: String(no), charNo: String(listItem.id), },
  };
}

function onFormFieldUpdate(payload: { key: keyof CharacterFormState; value: string }) {
  form.value[payload.key] = payload.value;
}

watch(
  [ prjNo, charNoNum, isCreateMode, ],
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
          title="인물"
          :items="sidebarItems"
          :selected-id="sidebarSelectedId"
          :get-to="getToCharacterDetail"
          :loading="sidebarListLoading"
          :error-message="sidebarListErrorMessage"
          :route-to-list="routeToList"
        />
      </template>
      <LoreDetailLayout>
        <CharacterFormBody
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
