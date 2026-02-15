<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { RegionVo } from '@app-types/vo.types';
import { useDeleteRegion } from '~/composables/query/region/useDeleteRegion';
import { useGetRegionList } from '~/composables/query/region/useGetRegionList';
import { cn } from '~/utils/cn';

/** 지역 목록. 카드에 이름·설명 요약 표시. */

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva, inject prjNo, useRouter)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [ 'flex min-h-0 flex-1 flex-col gap-4', ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const router = useRouter();
const prjNo = inject<Ref<number | null>>('prjNo')!;

const {
  data: listResponse,
  isPending: loading,
  error: listError,
} = useGetRegionList({ prjNo, });

const deleteRegionMutation = useDeleteRegion();

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

const list = computed(() => listResponse.value?.data?.list ?? []);
const listErrorMessage = computed(() => {
  const err = listError.value;
  return err instanceof Error
    ? err.message
    : null;
});
const deleteError = ref<string | null>(null);
const errorMessage = computed(() => listErrorMessage.value ?? deleteError.value);

const favoriteSet = ref<Set<number>>(new Set());
const protectedSet = ref<Set<number>>(new Set());

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

function isFavorite(regionNo: number | null | undefined) {
  return regionNo != null && favoriteSet.value.has(regionNo);
}

function isProtected(regionNo: number | null | undefined) {
  return regionNo != null && protectedSet.value.has(regionNo);
}

function goToAdd() {
  const no = prjNo.value;
  if (no == null) return;
  router.push({ name: 'project-region-new', params: { prjNo: String(no), }, });
}

function goToView(regionNo: number | null | undefined) {
  const no = prjNo.value;
  if (no == null || regionNo == null) return;
  router.push({
    name: 'project-region-detail',
    params: { prjNo: String(no), regionNo: String(regionNo), },
  });
}

function goToEdit(regionNo: number | null | undefined) {
  const no = prjNo.value;
  if (no == null || regionNo == null) return;
  router.push({
    name: 'project-region-detail',
    params: { prjNo: String(no), regionNo: String(regionNo), },
    query: { mode: 'edit', },
  });
}

function toggleFavorite(regionNo: number | null | undefined, e: Event) {
  e.preventDefault();
  e.stopPropagation();
  if (regionNo == null) return;
  const next = new Set(favoriteSet.value);
  if (next.has(regionNo)) next.delete(regionNo);
  else next.add(regionNo);
  favoriteSet.value = next;
}

function toggleProtected(regionNo: number | null | undefined, e: Event) {
  e.preventDefault();
  e.stopPropagation();
  if (regionNo == null) return;
  const next = new Set(protectedSet.value);
  if (next.has(regionNo)) next.delete(regionNo);
  else next.add(regionNo);
  protectedSet.value = next;
}

async function removeItem(item: RegionVo) {
  const no = prjNo.value;
  const regionNo = item.regionNo ?? null;
  if (no == null || regionNo == null) return;
  const confirmed = window.confirm(`"${item.regionNm ?? '이 항목'}"을(를) 삭제할까요?`);
  if (!confirmed) return;
  try {
    await deleteRegionMutation.mutateAsync({ prjNo: no, regionNo, });
    deleteError.value = null;
  }
  catch (err) {
    deleteError.value = err instanceof Error
      ? err.message
      : '삭제에 실패했습니다.';
  }
}
</script>

<template>
  <div :class="cn(cssVariants({}), 'p-4', props.class)">
    <div class="flex items-center justify-between gap-2">
      <h2 class="type-section-title">
        지역
      </h2>
      <CommonButton
        type="button"
        variant="primary"
        label="추가"
        @click="goToAdd"
      >
        <template #icon>
          <VueIcon icon-name="lucide:plus" class="size-4" />
        </template>
      </CommonButton>
    </div>

    <template v-if="loading">
      <p class="type-muted">
        로딩 중…
      </p>
    </template>
    <template v-else-if="errorMessage">
      <p class="type-body text-destructive">
        {{ errorMessage }}
      </p>
    </template>
    <template v-else-if="list.length === 0">
      <p class="type-muted">
        등록된 지역이 없습니다.
      </p>
    </template>
    <template v-else>
      <ul class="flex flex-col gap-2">
        <li
          v-for="(item, index) in list"
          :key="item.regionNo ?? index"
          class="flex"
        >
          <SettingItemCard
            :title="item.regionNm ?? '—'"
            category="지역"
            :is-favorite="isFavorite(item.regionNo)"
            :is-protected="isProtected(item.regionNo)"
            @view="goToView(item.regionNo)"
            @edit="goToEdit(item.regionNo)"
            @toggle-favorite="toggleFavorite(item.regionNo, $event)"
            @toggle-protected="toggleProtected(item.regionNo, $event)"
            @delete="removeItem(item)"
          />
        </li>
      </ul>
    </template>
  </div>
</template>
