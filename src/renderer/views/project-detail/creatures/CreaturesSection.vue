<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { CreatureVo } from '@app-types/vo.types';
import { useDeleteCreature } from '~/composables/query/creature/useDeleteCreature';
import { useGetCreatureList } from '~/composables/query/creature/useGetCreatureList';
import { cn } from '~/utils/cn';

/** 종족/생물 목록. 카드에 이름·설명 요약 표시. */

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
} = useGetCreatureList({ prjNo, });

const deleteCreatureMutation = useDeleteCreature();

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

const list = computed(() => listResponse.value?.data?.list ?? []);
const listErrorMessage = computed(() => {
  const err = listError.value;
  return err instanceof Error ? err.message : null;
});
const deleteError = ref<string | null>(null);
const errorMessage = computed(() => listErrorMessage.value ?? deleteError.value);

const favoriteSet = ref<Set<number>>(new Set());
const protectedSet = ref<Set<number>>(new Set());

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

function isFavorite(creatureNo: number | null | undefined) {
  return creatureNo != null && favoriteSet.value.has(creatureNo);
}

function isProtected(creatureNo: number | null | undefined) {
  return creatureNo != null && protectedSet.value.has(creatureNo);
}

function goToAdd() {
  const no = prjNo.value;
  if (no == null) return;
  router.push({ name: 'project-creature-new', params: { prjNo: String(no), }, });
}

function goToView(creatureNo: number | null | undefined) {
  const no = prjNo.value;
  if (no == null || creatureNo == null) return;
  router.push({
    name: 'project-creature-detail',
    params: { prjNo: String(no), creatureNo: String(creatureNo), },
  });
}

function goToEdit(creatureNo: number | null | undefined) {
  const no = prjNo.value;
  if (no == null || creatureNo == null) return;
  router.push({
    name: 'project-creature-detail',
    params: { prjNo: String(no), creatureNo: String(creatureNo), },
    query: { mode: 'edit', },
  });
}

function toggleFavorite(creatureNo: number | null | undefined, e: Event) {
  e.preventDefault();
  e.stopPropagation();
  if (creatureNo == null) return;
  const next = new Set(favoriteSet.value);
  if (next.has(creatureNo)) next.delete(creatureNo);
  else next.add(creatureNo);
  favoriteSet.value = next;
}

function toggleProtected(creatureNo: number | null | undefined, e: Event) {
  e.preventDefault();
  e.stopPropagation();
  if (creatureNo == null) return;
  const next = new Set(protectedSet.value);
  if (next.has(creatureNo)) next.delete(creatureNo);
  else next.add(creatureNo);
  protectedSet.value = next;
}

async function removeItem(item: CreatureVo) {
  const no = prjNo.value;
  const creatureNo = item.creatureNo ?? null;
  if (no == null || creatureNo == null) return;
  const confirmed = window.confirm(`"${item.creatureNm ?? '이 항목'}"을(를) 삭제할까요?`);
  if (!confirmed) return;
  try {
    await deleteCreatureMutation.mutateAsync({ prjNo: no, creatureNo, });
    deleteError.value = null;
  }
  catch (err) {
    deleteError.value = err instanceof Error ? err.message : '삭제에 실패했습니다.';
  }
}

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────
</script>

<template>
  <div :class="cn(cssVariants({}), 'p-4', props.class)">
    <div class="flex items-center justify-between gap-2">
      <h2 class="type-section-title">
        종족/생물
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
        등록된 종족/생물이 없습니다.
      </p>
    </template>
    <template v-else>
      <ul class="flex flex-col gap-2">
        <li
          v-for="(item, index) in list"
          :key="item.creatureNo ?? index"
          class="flex"
        >
          <SettingItemCard
            :title="item.creatureNm ?? '—'"
            category="종족/생물"
            :is-favorite="isFavorite(item.creatureNo)"
            :is-protected="isProtected(item.creatureNo)"
            @view="goToView(item.creatureNo)"
            @edit="goToEdit(item.creatureNo)"
            @toggle-favorite="toggleFavorite(item.creatureNo, $event)"
            @toggle-protected="toggleProtected(item.creatureNo, $event)"
            @delete="removeItem(item)"
          />
        </li>
      </ul>
    </template>
  </div>
</template>
