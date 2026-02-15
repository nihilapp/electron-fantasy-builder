<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';

import type { CharacterVo } from '@app-types/vo.types';
import { useDeleteCharacter } from '~/composables/query/character/useDeleteCharacter';
import { useGetCharacterList } from '~/composables/query/character/useGetCharacterList';
import { cn } from '~/utils/cn';

/** 인물 목록. 카드에 이름·설명 요약 표시. */

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
} = useGetCharacterList({ prjNo, });

const deleteCharacterMutation = useDeleteCharacter();

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

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

function isFavorite(charNo: number | null | undefined) {
  return charNo != null && favoriteSet.value.has(charNo);
}

function isProtected(charNo: number | null | undefined) {
  return charNo != null && protectedSet.value.has(charNo);
}

function goToAdd() {
  const no = prjNo.value;
  if (no == null) return;
  router.push({ name: 'project-character-new', params: { prjNo: String(no), }, });
}

function goToView(charNo: number | null | undefined) {
  const no = prjNo.value;
  if (no == null || charNo == null) return;
  router.push({
    name: 'project-character-detail',
    params: { prjNo: String(no), charNo: String(charNo), },
  });
}

function goToEdit(charNo: number | null | undefined) {
  const no = prjNo.value;
  if (no == null || charNo == null) return;
  router.push({
    name: 'project-character-detail',
    params: { prjNo: String(no), charNo: String(charNo), },
    query: { mode: 'edit', },
  });
}

function toggleFavorite(charNo: number | null | undefined, e: Event) {
  e.preventDefault();
  e.stopPropagation();
  if (charNo == null) return;
  const next = new Set(favoriteSet.value);
  if (next.has(charNo)) next.delete(charNo);
  else next.add(charNo);
  favoriteSet.value = next;
}

function toggleProtected(charNo: number | null | undefined, e: Event) {
  e.preventDefault();
  e.stopPropagation();
  if (charNo == null) return;
  const next = new Set(protectedSet.value);
  if (next.has(charNo)) next.delete(charNo);
  else next.add(charNo);
  protectedSet.value = next;
}

async function removeItem(item: CharacterVo) {
  const no = prjNo.value;
  const charNo = item.charNo ?? null;
  if (no == null || charNo == null) return;
  const confirmed = window.confirm(`"${item.charNm ?? '이 항목'}"을(를) 삭제할까요?`);
  if (!confirmed) return;
  try {
    await deleteCharacterMutation.mutateAsync({ prjNo: no, charNo, });
    deleteError.value = null;
  }
  catch (err) {
    deleteError.value = err instanceof Error
      ? err.message
      : '삭제에 실패했습니다.';
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
        인물
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
        등록된 인물이 없습니다.
      </p>
    </template>
    <template v-else>
      <ul class="flex flex-col gap-2">
        <li
          v-for="(item, index) in list"
          :key="item.charNo ?? index"
          class="flex"
        >
          <SettingItemCard
            :title="item.charNm ?? '—'"
            category="인물"
            :is-favorite="isFavorite(item.charNo)"
            :is-protected="isProtected(item.charNo)"
            @view="goToView(item.charNo)"
            @edit="goToEdit(item.charNo)"
            @toggle-favorite="toggleFavorite(item.charNo, $event)"
            @toggle-protected="toggleProtected(item.charNo, $event)"
            @delete="removeItem(item)"
          />
        </li>
      </ul>
    </template>
  </div>
</template>
